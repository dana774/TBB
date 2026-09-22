# AGENTS.md — operating rules for VGP Funding OS v2

These rules bind any human or automated agent (including AI assistants) working
on this repository or the bound Apps Script project. They exist to protect a
live production system that touches Dana's Gmail and the master funding
database.

## Golden rules

1. **Do not create duplicates.** Never create a new spreadsheet, a new funding
   database, or a second Apps Script project. The runtime stays bound to
   `VGP_Funding_Hotlist_Master` (`1RnXhEMl_Y8mzlKGvvof38_oGrlRfB8NIlVIQQS58rnA`).
2. **DRAFT_ONLY is a safety contract.** Keep `auto_push_mode = DRAFT_ONLY` in
   `00_Config`. Code may call `GmailApp.createDraft` only. It must never call
   `GmailApp.sendEmail`, `MailApp.sendEmail`, `draft.send()`, or
   `message.forward()`. Changing this requires Dana's explicit written approval
   and a documented change to the production specification.
3. **Never destroy data.** No deleting Gmail messages, no deleting Drive files,
   no clearing entire tabs, no replacing the master spreadsheet. Writes append
   or update the 17 V2 columns; historical columns are preserved.
4. **Preserve business rules.** Scoring weights (30/30/20/20), tier bands
   (A 90–100 / B 75–89 / C 60–74 / D <60), founder-routing gates, and the
   `Candidate / unverified` default must not change without documenting the
   change in `docs/audit-report.md` and getting Dana's sign-off.
5. **Never assert `Open now`.** Unverified inbound signals stay
   `Candidate / unverified` until an official-source review.

## Before you change code

- Run `npm run validate` and `npm test`. Both must pass.
- If you touch scoring, normalization, or send logic, add/adjust tests.
- Keep OAuth scopes least-privilege (see `appsscript.json`). Adding a scope is a
  security decision — justify it in the PR and the deployment checklist.

## Secrets

- Never commit `.clasp.json`, `.clasprc.json`, OAuth client secrets, refresh
  tokens, API keys, or service-account files. `.gitignore` blocks them; keep it
  that way. Credentials live only in local `clasp` auth or a secure store.

## Triggers

- Exactly one daily trigger (`runDailyFundingSweep`, ~07:00 ET) and one weekly
  trigger (`runWeeklyFundingReview`, Wed ~09:00 ET). Installation is idempotent
  via `installRequiredTriggers_` (it deletes existing handlers first).
- **Do not** install the Friday publication trigger — Funding Friday (Step 5) is
  intentionally held.

## When in doubt

Stop and ask Dana. A missed opportunity is recoverable; an email sent to
founders without review, or a corrupted master sheet, is not.
