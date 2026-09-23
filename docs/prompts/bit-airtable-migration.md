# BIT Airtable Migration — Prompt for the Airtable Agent

**How to use:** Share this prompt with the Airtable agent that already operates the BIT Coaching base. It covers the full migration of the base into Build in Tulsa's workspace per Desiree's 8/24/2026 directive, while preserving Dana Ammons' working access. Phase 1 (inventory + plan) should be completed BEFORE Dana's meeting with Desiree this week; Phase 3 (execution) only runs after Desiree confirms the approach.

---

## THE PROMPT

You are managing the migration of the **BIT Post-Program Executive Coaching 2026** Airtable base (`appdnMf3Om0tCtxyn`, currently in Dana Ammons' "TBB Ecosystem" workspace `wspbXD6tXB4X1aIAJ`) into **Build in Tulsa's own Airtable workspace**. Context: BIT requires all program deliverables, databases, and documentation to live in BIT systems, and will not reimburse VGP tooling costs. Dana must retain hands-on working access after the move — he runs the program day-to-day. Desiree Frieson (desiree@buildintulsa.com) already has edit access via share.

### What this base contains (inventory to verify, not assume)
- **9 tables**: Founders `tblSDwP5KVGpHFDkU` (43 records, BIT-001..043), Goals & KPIs `tblck6VB8pnQvWljG`, Sessions `tbl1pIclJA9t6d07S`, Opportunities `tblULOIFOf4xXqtna`, Monthly Outcomes `tbl5rIXeL60msTnmu`, Intake Submissions `tblb1XdGOxf7fEpJC`, Workshop RSVPs `tblH3I2OS5n3bK4n7`, PPN Readiness `tblNeYsxpabm56to8`, Time & Invoice Log `tblLLcxszrjD9vrCC`.
- **Published interface** "BIT Coaching Ops" (`pbdYOMNSIh54mjkOP`, 11 pages).
- **5 form views** (built in the UI, not via API): Founder Baseline Intake (share `shrACHoj0eHk0kygX`), Monthly Progress Pulse (share `shrXdQ1hsfvMdPx7n`), Warm Introduction Request, Workshop RSVP + Reflection, Product Pitch Night Readiness.
- **39 personalized prefilled form links** (in `BIT_Executive_Coaching/BIT_Founder_Personalized_Form_Links.csv`) that embed the base's share IDs and record IDs — several are live in founders' inboxes and in Desiree's hands right now, with an intake deadline of **Monday, Aug 31**.
- Rollups/formulas (completed-only touchpoint counting), record comments, and cross-table links throughout.

### CRITICAL constraints — read before proposing anything
1. **The live links must not break before Aug 31.** The personalized intake links are mid-campaign. Any path that changes the base ID (duplication) kills every link. Therefore: **do not execute any duplication path before Sep 1** unless Desiree explicitly accepts re-issuing links mid-campaign.
2. **A workspace MOVE preserves everything** (base ID, record IDs, share links, forms, interface, comments). A **duplicate/copy does not** (new base ID → new share links; comments and revision history do not copy; interfaces do not copy).
3. **Time & Invoice Log is VGP-internal.** It contains VGP's rate and billing mechanics. Before any transfer, EXPORT this table (CSV + a copy into a VGP-private base) and then DELETE it from the base being handed over, unless Dana explicitly says BIT should keep visibility. Invoices themselves are BIT-facing; the working time ledger is not.
4. **Confidentiality check before handover**: scan Founders notes, Sessions notes, Opportunities, and record comments for anything private to a founder or to VGP that BIT staff shouldn't see. (Known-clean: the base was deliberately kept free of one founder's confidential funding news — verify nothing has crept in since.)
5. Dana's post-migration access target: **editor or higher as an external collaborator on the base (or member of BIT's workspace if they offer)** — he must be able to run records, views, forms, and the interface daily. Billing for BIT's workspace/seats is BIT's responsibility.

### PHASE 1 — Inventory + options memo (do now)
1. Verify the inventory above against the live base (tables, views, forms, interface pages, automations if any, collaborator list).
2. Export a full backup: every table to CSV (all fields, including linked-record IDs), plus a schema dump (field IDs/types/options per table). Store under `BIT_Executive_Coaching/Airtable_Migration_Backup_<date>/`.
3. Produce a one-page options memo for Dana to bring to the Desiree meeting:
   - **Option A (recommended): workspace transfer.** BIT invites Dana to their workspace (or accepts a base-ownership transfer); the base is MOVED intact into BIT's workspace; Dana is retained as collaborator; VGP leaves the old workspace unchanged. Zero link breakage, zero data loss, ~15 minutes. Note who bears the Airtable plan cost after the move (BIT) and confirm their plan tier supports the interface (Team or above).
   - **Option B: duplicate into BIT workspace after Aug 31.** New base ID; requires re-minting all share links + 39 personalized links + re-pointing HubSpot `bit_airtable_founder_url` values; interface and forms rebuilt by hand; comments/history lost. Use only if BIT refuses a move.
   - **Option C: CSV export handover.** BIT gets the data package; VGP keeps operating the live base. Note this does NOT satisfy "BIT systems as system of record" long-term — call that out honestly.
4. List exactly what breaks in each option and the re-work hours.

### PHASE 2 — Pre-transfer hygiene (after Dana approves the option)
1. Export + remove the Time & Invoice Log (per constraint 3), unless Dana overrides.
2. Run the confidentiality scan (constraint 4) and report anything found before touching it.
3. Snapshot the 39 personalized links CSV and the HubSpot URL mappings so they can be re-issued if the path requires it.

### PHASE 3 — Execute (only after Desiree confirms, target: after Aug 31 unless Option A)
- Option A: coordinate the move with Desiree (she initiates the workspace invite/transfer from the BIT side), verify base ID unchanged, verify all 5 forms + interface + share links live, verify Dana's edit access, verify Desiree/Ashli access, then update every place the base is referenced (memory files, prompts, HubSpot URLs only if changed — under Option A they don't change).
- Option B: rebuild sequence — duplicate base → rebuild 5 forms → re-mint share links → regenerate 39 personalized links CSV → update HubSpot `bit_airtable_founder_url` for all founders → rebuild interface pages → side-by-side record-count verification per table → freeze the old base (read-only) with a banner note.
- Either way: final verification report to Dana — record counts per table old vs new, working form test submission (then delete the test), interface loads, and a list of every artifact updated.

### Deliverables
1. Phase 1 backup + options memo (before the Desiree meeting).
2. Phase 2 hygiene report.
3. Phase 3 execution log + verification report.
Do not execute Phase 3 without explicit go-ahead naming the chosen option.
