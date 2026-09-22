# VGP Funding OS v2 — Rollback Plan

Every change this deployment makes is reversible without data loss. The system
only **appends** rows and **writes the 17 V2 columns**; it never deletes,
clears, or replaces anything. This plan reverses each layer.

## Snapshot BEFORE deploying (recommended)

1. **Sheet backup:** in `VGP_Funding_Hotlist_Master`, File → Make a copy →
   name it `VGP_Funding_Hotlist_Master_BACKUP_<yyyy-mm-dd>`. (A copy is a safety
   net; the master itself is never replaced.)
2. **Code snapshot:** if a bound project already exists, `clasp pull` into a
   scratch dir to capture the currently deployed `Code.gs`/`appsscript.json`.
3. Note the current trigger list (Apps Script → Triggers).

## Rollback scenarios

### A. Stop all automation immediately (fastest, non-destructive)

Removes the schedule without touching code or data.

- Apps Script editor → **Triggers** → delete the `runDailyFundingSweep` and
  `runWeeklyFundingReview` triggers, **or** run in the editor:
  ```js
  function removeVGPTriggers(){
    ScriptApp.getProjectTriggers().forEach(function(t){
      var h = t.getHandlerFunction();
      if (h === 'runDailyFundingSweep' || h === 'runWeeklyFundingReview') ScriptApp.deleteTrigger(t);
    });
  }
  ```
- Effect: no further runs. All existing data remains. Menu still available for
  manual use. Reinstall later with `setupVGPFundingOSv2`.

### B. Freeze Tier A drafting only

- Set `00_Config` `auto_push_mode` to any value other than `DRAFT_ONLY`
  (e.g. `PAUSED`). `createTierADrafts` then refuses to run and throws. Sweeps and
  scoring continue. (This is the opposite of enabling send — it is strictly more
  restrictive.)

### C. Revert the code to the previous version

- Restore the snapshot from "Snapshot before deploying" step 2:
  ```bash
  cd <scratch-dir-with-old-code>
  clasp push        # re-uploads the previous Code.gs/appsscript.json
  ```
- Or check out the prior git commit of this repo and `clasp push` from there.

### D. Undo V2 column writes on a row

- The V2 columns are computed and idempotent: fix the inputs and re-run
  **Score Open Opportunities**, or clear the 17 V2 cells for that row by hand.
  Historical (non-V2) columns are never touched by the code.

### E. Remove auto-added config defaults

- `writeConfigDefaults_` only adds a key if it was **absent**. If you want to
  drop an auto-added default, delete that single `Key,Value` row in `00_Config`.
  Pre-existing keys were never modified.

### F. Full teardown (last resort)

1. Do **A** (remove triggers).
2. Do **C** (revert or remove code): in the Apps Script editor you may delete the
   project's files, or restore the pre-deploy snapshot.
3. Optionally clear the 17 V2 columns in `03_Opportunity_Master` and remove
   auto-generated rows in `12_Tier_A_Push_Queue` (rows created by runs are
   identifiable by `queue_id` prefixed `PUSH-`).
4. The master spreadsheet, Drive folders, and all historical data remain intact
   — nothing this system does deletes them.

## What rollback never requires

- No Gmail cleanup (the system only ever created **drafts**, and only with an
  approved founder mapping; delete unwanted drafts manually if any exist).
- No Drive cleanup (no files created or deleted).
- No restoration of the master sheet (never replaced or cleared).

## Verifying a clean rollback

- Apps Script → Triggers shows no VGP handlers (scenario A/F).
- `08_Agent_Run_Log` shows no new rows after the rollback time.
- Gmail Sent is empty of system messages (always true — there is no send path).
