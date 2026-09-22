# VGP Funding OS v2 — Deployment Checklist

This deploys the version-controlled `Code.gs` + `appsscript.json` onto the
**spreadsheet-bound** Apps Script project inside `VGP_Funding_Hotlist_Master`.
It does not create a new spreadsheet or a standalone script.

> **Credentials:** everything below uses **your own** `clasp`/Google login.
> No OAuth secret, refresh token, or API key is ever placed in this repository.

## 0. Prerequisites

- Node 18+ and npm.
- Install clasp locally: `npm install -g @google/clasp`.
- Be signed into the VGP Workspace account (`dana@valugrowthpartners.com`).

## 1. Pre-flight (local, no Google needed)

```bash
cd vgp-funding-os-v2
npm run validate     # must print VALIDATION PASSED
npm test             # must print pass 25 / fail 0
node scripts/local-dry-run.js   # must print LOCAL DRY-RUN OK
```

Do not proceed unless all three pass.

## 2. Authenticate clasp

```bash
clasp login          # opens Google OAuth in your browser; token stored in ~/.clasprc.json (git-ignored)
```

Enable the Apps Script API once if prompted: https://script.google.com/home/usersettings

## 3. Bind to the existing bound project

The script **must** be the container-bound project of the master sheet so the
custom menu appears. Get its Script ID from **the master spreadsheet →
Extensions → Apps Script → Project Settings → Script ID**.

- If a bound project already exists:
  ```bash
  cp .clasp.json.example .clasp.json
  # edit .clasp.json: set "scriptId" to the bound Script ID
  clasp pull          # optional: snapshot whatever is currently deployed (see rollback plan)
  ```
- If no bound project exists yet, create one **bound to the sheet**:
  ```bash
  clasp create --type sheets --parentId 1RnXhEMl_Y8mzlKGvvof38_oGrlRfB8NIlVIQQS58rnA --title "VGP Funding OS v2"
  ```
  (`--parentId` is the master spreadsheet ID; `--type sheets` makes it bound.)

Confirm `.clasp.json` is git-ignored: `git check-ignore .clasp.json` prints the path.

## 4. Push the code

```bash
clasp push           # uploads Code.gs + appsscript.json to the bound project
clasp open           # opens the editor to eyeball the upload (optional)
```

## 5. One-time setup + authorization

In the Apps Script editor (or `clasp run` once configured):

1. Run **`setupVGPFundingOSv2`** once.
2. Approve the OAuth consent screen for the requested scopes (spreadsheets,
   gmail.readonly, gmail.compose, script.scriptapp, userinfo.email).

`setupVGPFundingOSv2` will: ensure the 17 V2 headers (no-op if present), add any
missing config defaults **without overwriting existing keys**, and install the
two triggers.

## 6. Production dry run

1. Reload `VGP_Funding_Hotlist_Master`. Confirm the **VGP Funding OS v2** menu
   appears.
2. Menu → **Run Daily Funding Sweep**.
3. Open `08_Agent_Run_Log`: the newest row should be `status = Completed` with
   `records_read` / `records_written` populated.
4. Confirm **no** founder email was sent (there is no send path) and that
   `12_Tier_A_Push_Queue` only shows drafts/queued rows — never "sent".

## Validation (must all be true before calling deployment done)

- [ ] The **VGP Funding OS v2** menu is present in the master sheet.
- [ ] **Triggers:** exactly one `runDailyFundingSweep` (~07:00 ET) and one
      `runWeeklyFundingReview` (Wed ~09:00 ET). No Friday trigger.
      Check: Apps Script editor → Triggers, or run this in the editor:
      ```js
      function listTriggers(){ ScriptApp.getProjectTriggers()
        .forEach(t => Logger.log(t.getHandlerFunction()+' '+t.getEventType())); }
      ```
- [ ] `appsscript.json` time zone is `America/New_York` (Project Settings shows it).
- [ ] The master sheet is unchanged except the expected V2 updates
      (scores/tier/queue/run-log). Historical columns and rows are intact.
- [ ] **No external email was sent** (Gmail Sent shows nothing from the run;
      only Drafts, and only if an approved founder mapping exists).
- [ ] `00_Config` `auto_push_mode` is still `DRAFT_ONLY`.
- [ ] `08_Agent_Run_Log` has a success row (or a detailed error row).
- [ ] The Apps Script project is **bound** to the master spreadsheet
      (Project Settings → "Project is bound to <spreadsheet>").

## Notes

- **Tier A drafts** are created only by the manual menu item **Create Tier A
  Gmail Drafts**, and only when `10_Founder_Mapping` has at least one
  `Active` + `approved_for_auto_push = TRUE` row with a valid email. Automated
  triggers never draft.
- Keep `auto_push_mode = DRAFT_ONLY`. Enabling any send path requires Dana's
  written approval and a documented spec change (see AGENTS.md).
