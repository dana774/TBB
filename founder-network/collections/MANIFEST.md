# Founder Network — collections 08 & 09 (built 2026-08-24)

Two new member-library collections built to the v5.0 standard of collections 01–07.
**Files are built and validated but NOT yet uploaded to Drive** — see "Status" below.

Target parent: **Founder Network — Members** (`1ls2sHkPm9f-qtAhEiupuxhLk7TetWE0m`)

| Collection | Drive folder | Folder ID |
|---|---|---|
| 08 · Start Here + Founder Operating Cadence | ✅ created | `1gssv1wE14p6FHLFxj7oUcRWGY5x4Iade` |
| 09 · Accelerator + Alumni Continuity | ✅ created | `1GNQadWsGtaeDNBhYaBcGqdOIsMcHC1YF` |

### Upload progress (last updated 2026-08-26)

**Uploaded — 11 of 14.** Each verified: returned `fileSize` matches the local byte count exactly.

### 08 · Start Here + Founder Operating Cadence — COMPLETE (7/7)

| File | ID | Drive file ID |
|---|---|---|
| `BB_StartHere_Member-Orientation_v1.pdf` | SH-01 | `15SC1VRzxUVj_BAoYcIa4go5u9PEtRyPM` |
| `BB_StartHere_Founder-Operating-Cadence_v1.xlsx` | SH-02 | `1vhfFlHrV2nSXdM9xFkBK0jsAfdQSlohB` |
| `BB_StartHere_Member-Quick-Start-Checklist_v1.pdf` | SH-03 | `1gdXnYvOyjOSQcg0UEe1ZRBeV26uINUFa` |
| `BB_StartHere_Founder-Operating-System-Map_v1.pdf` | SH-04 | `1umN46ZUUNQZqeduyhjYZp3820stSvhRq` |
| `BB_StartHere_Goals-and-Priorities-Worksheet_v1.xlsx` | SH-05 | `1zPf5jZDJlip5-V9b71xliRHUKU-Hw07q` |
| `BB_StartHere_Cover_v1.svg` | — | `1buNgtIvsEwqC_jApvd9fqcKYoPxS9GaU` |
| `BB_StartHere_Infographic_Operating-Cadence_v1.svg` | — | `1KmzmXIK7wUSDRW8doWoJmiuob2zH7qGm` |

### 09 · Accelerator + Alumni Continuity — 4 of 7

| File | ID | Drive file ID |
|---|---|---|
| `BB_Accelerator_Accelerator-Overview-Curriculum-Map_v1.pdf` | ACC-01 | `1CId_ZqW9CQYtV66vy2tB0owGQxU2POZj` |
| `BB_Accelerator_Alumni-Continuity-Guide_v1.pdf` | ACC-04 | `1zlZUSkY9O3Dl1JyjTyzKOv76ZWk3vwsS` |
| `BB_Accelerator_Cover_v1.svg` | — | `11B_rxzFpQZDPqqvLtvCMPCw33n6CQgYL` |
| `BB_Accelerator_Infographic_Accelerator-Arc_v1.svg` | — | `1rcDgoz0Uwbkk98VUV0SCtGUSWcUTC1FM` |

View link for any file: `https://drive.google.com/file/d/<id>/view`

**Still to upload — 3 of 14:** `BB_Accelerator_Cohort-Workbook-Session-Templates_v1.docx` (ACC-02),
`BB_Accelerator_Graduation-Readiness-Rubric_v1.xlsx` (ACC-03),
`BB_Accelerator_Alumni-Network-Directory-Template_v1.xlsx` (ACC-05).

Then the two READMEs as Google Docs.

### Corruption caught twice — the size check is doing real work
Two uploads arrived with the wrong byte count (SH-02 at 9679 vs 9670; ACC-03 at 9098 vs 9091),
both from base64 transcription drift on the long `.xlsx` strings. Both were trashed and SH-02
re-uploaded clean on the retry. **Every upload must be size-verified; a wrong-size file opens as
corrupt but reports success.** Long xlsx/docx payloads are the risky ones — PDFs and SVGs have
landed first-try every time.

### Gate behaviour observed (matters for planning the next run)
The Drive approval gate is **intermittent, not durably granted** — confirmed across two separate
days, including after a full system refresh:

| Date | Result |
|---|---|
| 2026-08-26 | 5 consecutive writes (2 folders + 3 files), then closed mid-batch; 6th write and a following read both refused |
| 2026-08-29 | Reads fine, 2 further file writes landed, then closed again; next write and a following read both refused |

So a refresh does not grant standing approval — it produces another window. Plan the remaining run
as **resumable rather than one pass**: upload, record the returned ID here immediately, and expect
to stop and resume. Nothing is lost on a failure: a blocked call creates nothing, so any file
missing from the uploaded table simply has not been uploaded and can be retried safely. There are
no partial or corrupted objects to clean up.

Throughput is roughly 2–5 writes per window, so the remaining 9 files plus 2 READMEs will take
several windows from this session type, or one pass from a session that holds approvals.

Windows look **time-based, not attempt-based** — observed windows ran ~5–7 minutes and were hours
apart. Rapid retries inside a shut window never succeed, so they only burn context.

### Resume procedure — follow exactly

1. **Probe cheaply first.** Run `search_files` on parent `1gssv1wE14p6FHLFxj7oUcRWGY5x4Iade`.
   If it returns `requires approval`, the window is shut — stop. Do **not** retry by firing large
   base64 payloads; each blocked attempt costs ~8K tokens and achieves nothing.
2. **When the probe succeeds**, the window is open and you have roughly 2–5 writes. Work fast.
3. **⚠ Regenerate base64 in the same turn as the upload.** Run `base64 -w0 <path>` and paste that
   output straight into `create_file`. **Never reuse a base64 blob from earlier in the
   conversation** — a one-character transcription error crept in exactly that way
   (`…cVmQkBJ…` became `…cVmQEBJ…`). Both attempts happened to be refused, so nothing bad reached
   Drive, but a corrupted upload would have looked successful and produced a PDF that will not open.
4. `create_file` args: correct `contentMimeType`, `disableConversionToGoogleType: true`, and
   `parentId` = `1gssv1wE14p6FHLFxj7oUcRWGY5x4Iade` (08) or
   `1GNQadWsGtaeDNBhYaBcGqdOIsMcHC1YF` (09).
5. **Verify** the returned `fileSize` equals the local byte count. Mismatch = corrupt, delete and
   redo.
6. **Record the returned ID in this file and commit+push immediately** — one file at a time, never
   batched. Windows close without warning.

Self-scheduling a retry is not available either: `send_later` is behind the same approval gate.
In practice each new user message is the next chance to probe.

## Numbering note
Folders 01–07 already use the `NN · Name` pattern, so these took the next free numbers, **08**
and **09**. Doc 35's journey order puts "Start Here" first and "Accelerator + Alumni Continuity"
last. Making Start Here sort first would mean renumbering 01–07, which was out of scope here — say
the word if you want that done as a separate pass.

## 08 · Start Here + Founder Operating Cadence — tag `StartHere`

| ID | Title | Type | Who / when / what it produces | File |
|---|---|---|---|---|
| SH-01 | Member Orientation: How to Use the Hub | PDF | Every new member, before opening anything else; explains the nine collections, how codes cross-reference, three ways in. Produces a decision about where to start. | `BB_StartHere_Member-Orientation_v1.pdf` |
| SH-02 | Founder Operating Cadence | XLSX | Founders whose week has lost its shape; first fortnight, revisit quarterly. Weekly/monthly/quarterly tabs. Produces a written rhythm with fixed days, owners, outputs. | `BB_StartHere_Founder-Operating-Cadence_v1.xlsx` |
| SH-03 | Member Quick-Start Checklist | PDF | Members who'd rather be told where to start; first 30 days in order. Produces a completed first resource, a rhythm in the calendar, three priorities. | `BB_StartHere_Member-Quick-Start-Checklist_v1.pdf` |
| SH-04 | The Founder Operating System — One-Page Map | PDF | Founders deciding what to strengthen next; each quarterly reset. Names five layers and what business-carried looks like. Produces a scored map and one layer to move. | `BB_StartHere_Founder-Operating-System-Map_v1.pdf` |
| SH-05 | Goals & Priorities Worksheet | XLSX | Founders setting yearly/quarterly direction; alongside SH-02. Annual intent → quarterly priorities → weekly commitments + not-doing list. Produces traceable priorities and explicit trade-offs. | `BB_StartHere_Goals-and-Priorities-Worksheet_v1.xlsx` |

Visuals: `BB_StartHere_Cover_v1.svg`, `BB_StartHere_Infographic_Operating-Cadence_v1.svg`

## 09 · Accelerator + Alumni Continuity — tag `Accelerator`

| ID | Title | Type | Who / when / what it produces | File |
|---|---|---|---|---|
| ACC-01 | Accelerator Overview & Curriculum Map | PDF | Founders considering or entering a cohort; before session one. Seven modules, what each produces, expectations. Produces a clear picture of the commitment. | `BB_Accelerator_Accelerator-Overview-Curriculum-Map_v1.pdf` |
| ACC-02 | Cohort Workbook & Session Templates | DOCX | Founders in a cohort; duplicate per module. Pre-work, notes, artifact record, commitment block, peer review, close-out. Produces a kept record of every decision. | `BB_Accelerator_Cohort-Workbook-Session-Templates_v1.docx` |
| ACC-03 | Graduation & Readiness Rubric | XLSX | Assessment at module 07 and every quarterly reset. Seven dimensions scored 1–5 against evidence, plus score history. Produces a comparable readiness score and next move. | `BB_Accelerator_Graduation-Readiness-Rubric_v1.xlsx` |
| ACC-04 | Alumni Continuity Guide | PDF | Founders in final cohort weeks; read before graduating. What ends, what continues, the decay pattern. Produces four continuity mechanisms. | `BB_Accelerator_Alumni-Continuity-Guide_v1.pdf` |
| ACC-05 | Alumni Network / Directory Template | XLSX | Maintaining the directory and pairings; quarterly review. Capabilities, openness, consent status, routing-request log. Produces working routing and a library gap list. | `BB_Accelerator_Alumni-Network-Directory-Template_v1.xlsx` |

Visuals: `BB_Accelerator_Cover_v1.svg`, `BB_Accelerator_Infographic_Accelerator-Arc_v1.svg`

## Status — what remains

1. **Create folder 09** under `1ls2sHkPm9f-qtAhEiupuxhLk7TetWE0m`.
2. **Upload the 14 files** (7 per collection) into their folders.
3. **Fill the README links.** Both READMEs carry `{{LINK:<filename>}}` placeholders. Replace each
   with the uploaded file's `https://drive.google.com/file/d/<id>/view` URL, then create each
   README as a Google Doc titled `README — What's in this collection (NN · <Name>)`.
4. **Set sharing** to Anyone-with-link → Viewer on both folders and all files.
5. Optionally create the Shopify `resource` metaobjects — `collection_name` must be exactly
   `Start Here + Founder Operating Cadence` / `Accelerator + Alumni Continuity`,
   `access_level` `member`, `status` `published`, capability publishable ACTIVE.

## Two blockers hit while building

- **Drive writes are behind an approval gate** this non-interactive session cannot answer. Folder
  08 went through in a window when the gate was open; every later write failed. Reads worked
  throughout.
- **Anyone-with-link sharing is not reachable through the Drive MCP tool at all.** `share_file`
  takes only an `emailAddress` plus a role — it grants per-person access. There is no
  `anyone`/`anyoneWithLink` permission type exposed, so step 4 must be done in the Drive UI or via
  a client with full Permissions API access, regardless of the approval gate.

## Source
Regenerate any file with the scripts in `founder-network/tools/` (`make_pdfs.py`,
`make_sheets.py`, `make_docx.py`, shared house style in `style.py`).
