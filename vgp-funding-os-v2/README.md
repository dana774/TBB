# VGP Funding Operating System v2

Spreadsheet-bound Google Apps Script that runs the VGP funding-intelligence
pipeline **in place** on the existing master workbook. It ingests Gmail funding
signals, normalizes them into opportunity records, scores them with the V2
model, matches founders, and prepares **Tier A Gmail drafts** — never sending
email while the system is in `DRAFT_ONLY`.

This repository is the version-controlled, defect-corrected form of the source
maintained in the Google Doc _VGP_Funding_OS_v2_Apps_Script_Source_. It does not
create a new system, spreadsheet, or database.

| Item | Value |
| --- | --- |
| Master spreadsheet | `VGP_Funding_Hotlist_Master` |
| Spreadsheet ID | `1RnXhEMl_Y8mzlKGvvof38_oGrlRfB8NIlVIQQS58rnA` |
| Root Drive folder | `1hKGP8JaTc_q4OmrWMQMfT3YdC8D4YpCy` |
| Runtime | Google Apps Script (V8), **spreadsheet-bound** |
| Time zone | `America/New_York` |
| Safety posture | `DRAFT_ONLY` — Tier A messages are Gmail drafts only |

## Repository layout

```
vgp-funding-os-v2/
├── Code.gs                     # Apps Script source (corrected, production)
├── appsscript.json             # Manifest: America/New_York, least-privilege scopes
├── package.json                # npm test / validate scripts
├── .clasp.json.example         # Template for clasp binding (real .clasp.json is git-ignored)
├── .gitignore                  # Excludes clasp/OAuth credentials, node_modules
├── README.md
├── AGENTS.md                   # Operating rules for automation/agents
├── scripts/
│   ├── validate-schema.js      # Static schema + send-safety validation (no Google needed)
│   └── local-dry-run.js        # Offline end-to-end pipeline simulation (no Google I/O)
├── tests/
│   ├── harness.js              # Loads Code.gs in a vm sandbox with Apps Script stubs
│   ├── scoring.test.js         # Scoring, tiers, parsing, classification
│   └── normalization.test.js   # Dedup, DRAFT_ONLY, founder routing, triggers, empty sheets
└── docs/
    ├── audit-report.md         # Pre-deployment schema + source audit (read-only)
    ├── deployment-checklist.md # Step-by-step clasp deploy + validation
    └── rollback-plan.md        # How to reverse every change safely
```

## What the code does

- **Daily sweep (`runDailyFundingSweep`)** and **weekly review
  (`runWeeklyFundingReview`)**: read Gmail using the query in `00_Config`,
  normalize new signals into `01_Raw_Alerts`, create de-duplicated
  `Candidate / unverified` opportunity records in `03_Opportunity_Master`, log
  sources in `07_Source_Log`, apply the V2 score, and refresh the
  `12_Tier_A_Push_Queue`. Every run is logged to `08_Agent_Run_Log`.
- **Scoring (`scoreOpportunitiesV2`)**: writes only into the 17 V2 columns.
  `Final Score = Capital 30% + Network Fit 30% + Urgency 20% + Effort Ease 20%`.
  Tiers: **A 90–100 · B 75–89 · C 60–74 · D <60**.
- **Founder routing (`getFounderMatches_`)**: routes only rows in
  `10_Founder_Mapping` where `active_status = Active` **and**
  `approved_for_auto_push = TRUE` **and** the email address is valid.
- **Tier A drafts (`createTierADrafts`)**: `GmailApp.createDraft` only.
  It refuses to run unless `auto_push_mode = DRAFT_ONLY`. Automated triggers
  never create drafts — drafting is a deliberate menu action.

## Safety guarantees (enforced by code + tests + validator)

- Never calls `GmailApp.sendEmail`, `MailApp.sendEmail`, `draft.send()`, or
  `message.forward()` (checked by `scripts/validate-schema.js`).
- Never deletes Gmail messages or Drive files; never clears whole tabs.
- Uses `LockService` (no overlapping runs) and `PropertiesService` (run state).
- Preserves existing records and config keys; only appends.
- New inbound signals are always `Candidate / unverified` — never `Open now`.
- Least-privilege OAuth: `spreadsheets`, `gmail.readonly`, `gmail.compose`,
  `script.scriptapp`, `userinfo.email`. No `gmail.modify`, no Drive write.

## Local development

```bash
cd vgp-funding-os-v2
npm test          # runs tests/*.test.js (Node 18+; no Google credentials needed)
npm run validate  # static schema + send-safety checks
node scripts/local-dry-run.js   # offline end-to-end pipeline simulation
```

Apps Script has no local runtime, so the tests load the real `Code.gs` inside a
Node `vm` context with in-memory stubs for the Apps Script services. The same
functions that run in production are exercised unmodified.

## Deploying

See **docs/deployment-checklist.md**. In short: authenticate `clasp` to the VGP
Google account, bind to the **spreadsheet-bound** Apps Script project inside
`VGP_Funding_Hotlist_Master`, `clasp push`, run `setupVGPFundingOSv2` once to
install the daily/weekly triggers, then validate. Credentials live only in your
local `clasp` auth — never in this repository.
