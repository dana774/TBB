# VGP Funding OS v2 — Pre-Deployment Audit Report (read-only)

**Date:** 2026-08-05
**Auditor:** VGP automation engineering
**Scope:** Read-only audit of the live master workbook and the Apps Script
source, plus defect correction in this repository. **No live Google object was
modified during this audit.**

---

## 1. Access confirmation

| Check | Result |
| --- | --- |
| Authenticated Google account | `dana@valugrowthpartners.com` (owner of all three artifacts) |
| Master spreadsheet reachable | ✅ `VGP_Funding_Hotlist_Master` / `1RnXhEMl_Y8mzlKGvvof38_oGrlRfB8NIlVIQQS58rnA` |
| Apps Script source doc reachable | ✅ `1oXv5dWWQ8e8Wr6YXXlAd5l7VcMR1qzmDj68RmN3eeMU` |
| Activation runbook reachable | ✅ `1LgfkST5O8SXYQawAzN8LQNykaJmnVL4zdHv-nXEYE7g` |
| Root Drive folder | `1hKGP8JaTc_q4OmrWMQMfT3YdC8D4YpCy` (master parented under data folder `1IKJ5VhnBkJEf-fQbzALfBwPxmBLZMYB1`) |

> **Access method note.** This audit used the read-oriented Google Drive
> connector. It exposes cell **contents** but not sheet **names** or Apps Script
> project internals. Items that require the Sheets API / Apps Script API to
> confirm by name are flagged **[verify on deploy]** and are re-checked by the
> deployment checklist once `clasp` is authenticated.

## 2. Sheet / schema audit

Confirmed present by live **content** signature:

| Required tab | Evidence in live workbook |
| --- | --- |
| `00_Config` | Key/Value config incl. `auto_push_mode,DRAFT_ONLY` |
| `01_Raw_Alerts` | `raw_alert_id … notes` header + RAW-2026… rows |
| `03_Opportunity_Master` | Full base header + **all 17 V2 columns** (see §3) |
| `04_Verification_Log` | Referenced by config/runbook **[verify on deploy]** |
| `05_Hotlist_Queue` | Referenced by runbook (weekly digest target) **[verify on deploy]** |
| `06_Published_Issues` | Referenced by config **[verify on deploy]** |
| `07_Source_Log` | Source schema (signal type/confidence/verification/freshness) |
| `08_Agent_Run_Log` | Run-log header (`run_id … status … notes`) |
| `09_Email_Groups` | `email_groups_tab,09_Email_Groups` in config **[verify on deploy]** |
| `10_Founder_Mapping` | Founder schema referenced; **empty (headers only)** — dashboard shows "Founder records approved for auto push = 0" |
| `11_Automation_Rules` | AUTO-001…AUTO-006 rows incl. tier thresholds |
| `12_Tier_A_Push_Queue` | `queue_id … draft_status, draft_url, notes` header (18 cols) |
| `13_V2_Dashboard` | Dashboard tiles incl. "Automation mode = DRAFT_ONLY" |

> **Config drift observed (informational, not blocking):** the `sheet_tabs`
> value inside `00_Config` is a stale 2026-05-20 list that stops at
> `09_Editorial_Review_Form` and predates tabs 10–13. The live workbook clearly
> contains the newer tabs (evidence above). The code does **not** rely on the
> `sheet_tabs` string; it references tabs by explicit name, so this drift is
> cosmetic. Recommend Dana refresh `sheet_tabs` at leisure — **no code change
> required.**

## 3. 17 V2 columns — confirmed in `03_Opportunity_Master`

Live header row ends with exactly, in order:

```
funding_type_v2 · stage_fit_v2 · capital_value_score · network_fit_score ·
urgency_score · effort_ease_score · strategic_value_score · final_score · tier ·
founder_match_count · founder_segments_v2 · decision_status_v2 · next_action ·
next_action_owner · next_action_due · auto_push_eligible · last_scored_at
```

`scripts/validate-schema.js` asserts this list matches `V2_MASTER_HEADERS` in
`Code.gs` (present, 17, in order). ✅

## 4. Configuration audit (`00_Config`)

| Key | Live value | Status |
| --- | --- | --- |
| `auto_push_mode` | `DRAFT_ONLY` | ✅ required posture |
| `timezone` | `America/New_York` | ✅ |
| `tier_a_threshold` / `b` / `c` | `90` / `75` / `60` | ✅ matches spec |
| `scoring_weights` | Capital 30 / Network 30 / Urgency 20 / Effort 20 | ✅ |
| `daily_sweep_schedule` | Daily at 7 AM America/New_York | ✅ |
| `weekly_review_schedule` | Wednesday at 9 AM America/New_York | ✅ |
| `funding_friday_schedule` | Friday 8 AM ET **— Step 5 held** | ✅ trigger intentionally NOT installed |
| `gmail_daily_query` / `gmail_weekly_query` | present (richer keyword set than source defaults) | ✅ preserved; `writeConfigDefaults_` never overwrites existing keys |

## 5. Trigger audit

**[verify on deploy]** Trigger enumeration requires the Apps Script project,
which the read connector cannot see. The deployment checklist verifies triggers
after `clasp push`. The code is defensively idempotent: `installRequiredTriggers_`
deletes any existing `runDailyFundingSweep` / `runWeeklyFundingReview` handlers
before creating one of each, so re-running setup can never duplicate them
(covered by `normalization.test.js`).

## 6. Source-code defect audit and corrections

Audited the source in doc `1oXv5dWWQ8e8Wr6YXXlAd5l7VcMR1qzmDj68RmN3eeMU`. The
source was **broadly sound and safe** (DRAFT_ONLY, dedup, empty-sheet guards,
idempotent triggers already present). Corrections applied in `Code.gs` — all
**production hardening, no business-rule changes**:

| ID | Defect / risk in source | Correction |
| --- | --- | --- |
| C1 | No `LockService` — overlapping daily/weekly runs could double-write | Script lock in `runSweep_`; overlap is logged as `Skipped` and returns |
| C2 | No `PropertiesService` run state | `setRunState_` records `LAST_RUN_ID/SCOPE/STATUS/AT` |
| C3 | Per-record `appendRow` inside the sweep loop → sheet-write quota risk | `batchAppendByHeaders_`: one `setValues` per sheet per sweep |
| C4 | Only success was logged; a thrown error logged nothing | `try/catch` around the sweep; errors logged to `08_Agent_Run_Log` with `status = Error` + message/stack |
| C5 | `GmailApp.search(...,0,100)` then read all messages → read-quota / 6-min timeout risk | `MAX_THREADS`/`MAX_MESSAGES` caps + elapsed-time guard (`MAX_RUN_MS`) |
| C6 | Scorer wrote a 17-wide block from `funding_type_v2` assuming contiguity — silent corruption if headers shifted | `assertContiguousV2Block_` refuses to write unless the 17 V2 headers are present, contiguous, and in order |
| C7 | A brand-new/zero-column sheet could throw in `getRange(...,0)` | Zero-column / empty-sheet guards on every reader |
| C8 | `new Date('rolling 2026')`-style lenient parsing could yield bogus deadlines; deadlines without a year returned null | `parseDeadline_` now requires date-shaped text and, when the year is absent, assumes the next occurrence — all in `America/New_York` |
| C9 | Manifest requested `gmail.modify` + full `drive` (more than needed; `modify` can delete mail) | Tightened to `gmail.readonly` + `gmail.compose` + `spreadsheets` + `script.scriptapp` + `userinfo.email` |
| C10 | (Confirmation, not a fix) automated triggers must never draft | Triggers call the sweep only; `createTierADrafts` stays a manual, `DRAFT_ONLY`-gated menu action |
| — | Robustness: invalid founder emails could be routed | `isValidEmail_` added to `getFounderMatches_` gate |

Items reviewed and found **acceptable / no change** (documented so they are not
"fixed" into behavior changes):

- **First-date-in-body deadline extraction** can occasionally grab an unrelated
  date. Acceptable: records are `Candidate / unverified` and require human
  verification before any founder-facing action. Business rule unchanged.
- **`General startup founders` broad match** in `getFounderMatches_` can match
  any active/approved founder. Acceptable: gated behind Tier A + current +
  verified, which a generic opportunity is unlikely to reach. Business rule
  unchanged.
- **Name/URL-based dedup** may suppress a genuinely new opportunity that reuses a
  prior title. Acceptable and conservative (favors no-duplicate). Unchanged.

## 7. Safety verification (automated)

- `scripts/validate-schema.js` → **PASS**: `America/New_York`; least-privilege
  scopes; 17 V2 columns in order; all required tabs referenced; **no**
  `sendEmail`/`send(`/`forward(`/delete/clear-all in executable code;
  `createDraft` present; `DRAFT_ONLY` default present.
- `npm test` → **25/25 pass** across duplicate detection, deadline parsing,
  closed-program detection, amount parsing, category inference, founder-sector
  matching, tier thresholds, `Candidate / unverified` behavior, `DRAFT_ONLY`
  enforcement, missing-email behavior, empty-sheet behavior, and trigger cleanup.
- `scripts/local-dry-run.js` → **PASS**: 4 messages → 1 noise filtered, 1
  duplicate deduped, 2 opportunities inserted, 2 sources logged, 0 Tier A queue,
  **0 drafts** (empty founder mapping), **0 emails**, run logged `Completed`,
  lock released, run state persisted.

## 8. Residual items requiring live Google (deploy-time)

1. Confirm exact names of tabs 04/05/06/09 and enumerate triggers (Apps Script
   API) — deployment checklist §Validation.
2. Confirm `10_Founder_Mapping` header names match those the code reads
   (`founder_name, brand_name, email, segment, sector, subsector, capital_need,
   active_status, approved_for_auto_push`). The runbook lists the first seven;
   `subsector`/`capital_need` are optional profile fields (safe if absent).
3. Run the production dry run (menu → **Run Daily Funding Sweep**) once and read
   back `08_Agent_Run_Log`.
