# Doc 33 — Writeback Automation: Activation Runbook

Makes funding-system close-outs fully automatic. The module lives at
`automation/writeback/Writeback.gs` (also mirrored as a Google Doc in the
funding system's automation folder). Two intake paths once live:

- **Instant (webhook)**: an agent POSTs the write-back JSON to the web
  app URL and it is applied immediately.
- **Fallback (file drop)**: an agent drops a `WRITEBACK-<date>` Sheet in
  the data folder and/or an `APPEND-<date>` Doc beside the working doc;
  an hourly poller parses, applies, and renames them `APPLIED-…`.

Both paths write only to tabs 03/05/06/07/08 of
`VGP_Funding_Hotlist_Master` and the working doc, are idempotent (rows
with an existing queue_id / source_id / run_id / issue_name are skipped;
repeated cell-appends are skipped), never touch `09_Email_Groups`, never
delete, never send email, and log every application to
`08_Agent_Run_Log`.

## Dana's one-time activation (~10 minutes)

1. Go to **script.google.com** and open the existing **"VGP Funding OS
   v2"** project (the one from the v2 activation).
2. Click **+ → Script**, name the new file **Writeback**, and paste the
   full contents of `Writeback.gs` (from the repo file or the
   "VGP_Writeback_Automation_Source" Google Doc in the automation
   folder). Save.
3. In the function dropdown select **setupVGPWritebackAutomation** and
   click **Run**. Approve the permissions prompt. This installs the
   hourly poller and generates the secret token.
4. Open **View → Executions → (that run) → logs** (or Executions log)
   and copy the printed **WRITEBACK_TOKEN** value.
5. Click **Deploy → New deployment → type: Web app**. Set *Execute as*:
   **Me**; *Who has access*: **Anyone**. Deploy and copy the **Web app
   URL**.
6. Hand the Web app URL and the token to the publishing agents (store in
   Project config as `VGP_WRITEBACK_URL` and `VGP_WRITEBACK_TOKEN` —
   never in the repo).

Security note: "Anyone" access is required for agents to reach the
endpoint, but every request must carry the token or it is rejected; the
endpoint can only write to the whitelisted tabs. Rotate the token any
time by editing the `WRITEBACK_TOKEN` Script Property.

## What happens immediately after activation

Within the hour, the poller finds and applies the pending
**WRITEBACK-20260901** Sheet and **APPEND-20260901** recap doc from the
September 1 issue (both are renamed `APPLIED-…` when done), and logs the
application to `08_Agent_Run_Log`. If any of those rows were already
pasted manually, the idempotency checks skip them.

## How agents use it (webhook)

```
POST <VGP_WRITEBACK_URL>
Content-Type: application/json

{ "token": "<VGP_WRITEBACK_TOKEN>",
  "action": "writeback",
  "source": "VGP Founder Funding Hot List Publisher",
  "appends": {
    "06_Published_Issues": [ { "issue_date": "...", "issue_name": "...", ... } ],
    "05_Hotlist_Queue":    [ { "queue_id": "HLQ-...", ... }, ... ],
    "07_Source_Log":       [ { "source_id": "SRC-...", ... }, ... ],
    "08_Agent_Run_Log":    [ { "run_id": "RUN-...", ... } ]
  },
  "cell_edits": [
    { "opportunity_id": "OPP-...", "field": "publish_status", "value": "Published 2026-09-01" },
    { "opportunity_id": "OPP-...", "field": "notes", "mode": "append", "value": "..." }
  ],
  "working_doc_append": "recap text",
  "run_note": "Issue <date> close-out" }
```

Health check: `{ "token": "...", "action": "ping" }` → `{ ok: true }`.
Column names are matched to tab headers case-insensitively; genuinely new
columns are added at the right edge (same behavior as the v2 script's
header management). A field named `"notes (APPEND)"` is treated as
`notes` with append mode.

## Verification test (after Dana provides URL + token)

1. `ping` → expect `{ ok: true, version: "writeback-1.0" }`.
2. Confirm the Sept 1 package rows landed: 06 has the Sept 1 issue row,
   05 has 14 HLQ-20260901 rows, 03 shows publish statuses, 07 has 10
   SRC-20260901 rows, 08 has RUN-20260901-HOTLIST-001 plus the
   automation's own run rows, and the working doc ends with the recap.
3. From then on, doc 32's agents use the webhook first and the file drop
   only when the network path is unavailable.
