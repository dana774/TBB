# 27 — Member Hub Population Prompt (for a separate Codex project)

Copy the block below into a **new Codex project that has Google Drive access** (create/copy/search).
It populates the seven "Founder Network — Members" folders with your existing, reusable content.

Companion docs: `26-member-content-access.md` (the gate), this file (the fill).

---

## Destination folder IDs (already created)

- Parent — **Founder Network — Members**: `1ls2sHkPm9f-qtAhEiupuxhLk7TetWE0m`
- START HERE doc: `1N_q6iaK6MX5z38q0rf57fW0rGhJ0lKT4RG1W9EiHDvs`
- 01 · Capital Access: `1WFrZuUXsuLWDBAvB0U6r2te1jEuOFqBF`
- 02 · Retail Readiness: `15A-VpjtR8opTiSfgrI5pgU6J_LT6YhVq`
- 03 · Sales & GTM: `1fr0Rluari1j4JVnJ9VD8qnPIfHK4E2DS`
- 04 · Operations & Forecasting: `1K0deIU9p7UKdpNnTk9ELSvWOYhcVJyVH`
- 05 · Brand & Messaging: `1jKabHTtcCb9EW26LwDlrcnso9EXqECHm`
- 06 · Growth OS & AI: `11eMLoCpiK15pK96rsTV6LfELsh7vpjou`
- 07 · Partner Directory: `1LPsGD9pxjs7qDMsQv7MC9NiebutFgYp_`

---

## Staging folder for freshly-uploaded toolkits

Some member resources were uploaded into this chat as local files (not yet in Drive):
Founder Capital Access Module Toolkit, Retail Buyer Access System v2, Retail Trial Creator
System, Retail Readiness Blueprint Starter Suite, Retail Entry Playbook, Alternative Capital
Playbook, Startup Financial Model, Forecast OS (shell + spec), CPG Cash Flow Management,
Manufacturing/Packaging/Fulfillment Operating Partner Directory, Funding Brief for Founders,
Two-Pager Suite, Sponsor Media Kit, Sponsor Placement Guide, Broker CRM package.

**Dana's manual step (once):** In Google Drive create a folder named
`Founder Network — Uploads to Sort (staging)` and drag those local copies into it. Then paste
its folder ID into the prompt below where marked `STAGING_FOLDER_ID`. The population project
will sort those into folders 01–07 alongside the Drive files already listed.

Do NOT place these in the member hub: the Growth OS Strategic Framework & Operating Manual,
the Tech Stack Operating System, and the Founder Network Resource Library & Operating System
— those are internal "source of truth" docs, not member-facing.

---

## THE PROMPT (copy everything below this line)

```
ROLE
You are populating a members-only resource hub in Google Drive for Value Growth
Partners' "Founder Network" ($99/mo). Work only in the folders and files listed below.
You have Google Drive access (search_files, copy_file, create_file, read_file_content).

GOAL
Fill seven need-based sub-folders with clean, reusable member resources, and build a
short index (README) doc at the top of each folder plus refresh the master START HERE doc.
Members are early-stage founders. Everything here should be a TEMPLATE, PLAYBOOK, GUIDE,
or DIRECTORY they can reuse — never a specific client's confidential file.

DESTINATION FOLDER IDs
- Parent "Founder Network — Members": 1ls2sHkPm9f-qtAhEiupuxhLk7TetWE0m
- START HERE doc:                     1N_q6iaK6MX5z38q0rf57fW0rGhJ0lKT4RG1W9EiHDvs
- 01 Capital Access:                  1WFrZuUXsuLWDBAvB0U6r2te1jEuOFqBF
- 02 Retail Readiness:                15A-VpjtR8opTiSfgrI5pgU6J_LT6YhVq
- 03 Sales & GTM:                     1fr0Rluari1j4JVnJ9VD8qnPIfHK4E2DS
- 04 Operations & Forecasting:        1K0deIU9p7UKdpNnTk9ELSvWOYhcVJyVH
- 05 Brand & Messaging:               1jKabHTtcCb9EW26LwDlrcnso9EXqECHm
- 06 Growth OS & AI:                  11eMLoCpiK15pK96rsTV6LfELsh7vpjou
- 07 Partner Directory:               1LPsGD9pxjs7qDMsQv7MC9NiebutFgYp_

HARD RULES
1. COPY, never move. Originals must stay exactly where they are. Use copy_file with the
   destination folder as parentId. Title each copy with a clean member-facing name
   (e.g. "Template — 90-Day Sales Forecast").
2. Before copying any file, open it (read_file_content) and CONFIRM it is a generic,
   reusable template/guide — NOT a specific client's data. If a file contains a real
   client's financials, tax data, PII, signed agreements, or confidential brand strategy,
   DO NOT copy it. When a good template is "trapped" inside a client-named file, create a
   fresh, blank, generic version instead of copying the client's numbers.
3. NEVER copy anything on the EXCLUDE list below.
4. For very large media (videos > ~50MB) and for living "master" sheets that must stay
   single-source, DO NOT copy — instead add a LINK to the original inside that folder's
   README doc.
5. For every resource, the README entry must state three things: WHO it's for,
   WHEN to use it, and WHAT it produces. (Growth OS manual convention.)
6. If you are unsure whether something is safe/appropriate to share, leave it OUT and add
   it to a "REVIEW WITH DANA" list at the bottom of that folder's README.

STAGING FOLDER (freshly-uploaded toolkits Dana dragged in): STAGING_FOLDER_ID
List its files first (parentId = STAGING_FOLDER_ID) and route each into the right folder
below by topic (capital→01, retail→02, GTM/sales→03, forecast/ops→04, brand/sponsor→05,
growth-os→06, partner directory→07). Same COPY + verify + README rules apply.

CANDIDATE SOURCE FILES (verify each before copying; IDs are Dana's Drive)

01 CAPITAL ACCESS →
- Weekly Hot List Master Template (doc)          1vCTQbmWglm_sz38ILulTY5JwwDq3WTv51vCV37xkp-Y
- VGP Hot List Report (canonical)                1cRZN09GOnLFGBiDB_XDq1cAiPK_1ww8hlewdjQXeC94
- VGP Funding Signal Digest (working template)   1LvcJ9NtTkFNvoIE8jSlcD2fwRinLShOVr8axaSZLkZU
- Founder Funding Signal (Jun22–Jul13) editable  1NBTDpS9oDnVb7LHN4wMuar8xoJRByJLJVxRCeGPz_Vw
- Funding Friday market-signal script (June 4)   1-BNAgG3jwDCz3_QnOoLr99JywWSyz7MtgnMd8NGompc
- VGP Funding Inbox User Guide                    1Yitj3CMLipqigF-tNATsVgk49RC0y_NNkCf6A7uNUI4
- Brand Blueprint Funding Brief (Jun 1)          1DGlaoZ5attJtip8updNjbVRlX-iYAeWvOa8bRbvoVTQ
- grant_budget_workbook_with_team_instructions   1WF5c93Ct_KP5Q4iN2doTIGv3mE44QxV0
- grant_proposal_partnership_table               1Py362yBKU1XN-P4kg5vXi0cORz-Qxw9G
- RED Academy PNC Grant Application Template      10p7RucP3J1v6Kl-p-MvjY1BOg8Pr8vOvLJAY9GonEJA
- Template — Debt Schedule (fillable) PDF        1BB6IXFS1SbSUJiH-TImbDCvlcRkgj-L8
- LINK only (living master): VGP Funding Hotlist Master  1RnXhEMl_Y8mzlKGvvof38_oGrlRfB8NIlVIQQS58rnA
- LINK only (video): "Stop Chasing Open Grants—Chase Fit" 1ZgnVpxTzPGPbqo1jDMp39N6Jw1Y9PnpL

02 RETAIL READINESS →
- Walmart PDP Scorecard — Template (sheet)       1g99V-c73ZWPMIDB3je10LHnLcs8g6MCsuWllZtXMCEI
- Walmart SKUs — Template (sheet)                1ju7fcxnbh0hoyYbVL6QeF9780U1D_Y-qDa5117S9RPs
- Sample Product P&L Worksheet (xlsx)            1na6kdtgkfPeEHDOfsprDThy3hde5tv0w
- (Build fresh from client copy) Physical Inventory Count Worksheet — generic version

03 SALES & GTM →
- Template — 90-Day Sales Forecast Worksheet     1c3hzk-z1XKmQRWFOYd-xgjwIWSbMwJp6
- Template — Product Roadmap                      11NAufRhUhGqScWPb4ntpBOtm3zccJjLD
- Worksheet — How Big Is Your Market (TAM/SAM/SOM) 1kxF4osB-e58p20N1AqPIcVsi-JSBIKHu
- Template — Customer Journey Mapping             1XE9AgSRsLY_10ouVG8s5E-Cv5_oxo7A3
- Template — Competitor Matrix                    1ywBWe68BwfYeoixmhFOZs0q7F8-RJWUw
- Product Pitch Night Readiness Form (template)   1ehbMMeuW8cU9umTqOUbb2IlDv-r72-gOy-hnnXSAGhg

04 OPERATIONS & FORECASTING →
- Template — Operating Budget (xlsx)             1KHKrBryaeJ_aRcjedqrmKX1_SVAyGOs1
- Template — Client/Founder Intake Questionnaire 1rjfv4j77TkYp26sqhPQPHKnpEWo7ob84
- Template — Onboarding Checklist                 1E9A2dS3p1oNfpY6gVAVlEj4X94kyNSnM
- Template — Founder Coaching Roadmap             17_60_6lWAf5URXDmVHveZ8spDyO536uDEAkpoYb_G3U
- Template — Coaching Session Recap               1RsIDOBkb-9CKZGmPCuiMvuIvPg8iTB5V6qcnWSB46AA
- Template — Monthly Executive Coaching Report    1e_MejMePro8NlreDe06QJHiMt1AVCT1WOCq9X9yzcjw
- Template — Program Wrap-Up Report               1PVX-2ONC5MTlRSj7M3o-oc-X4f7qylB93Yusll2du1E

05 BRAND & MESSAGING →
- Template — Purpose Worksheet                    1aVsZaRkPdZ5gcunD2MvIv9Jwe4mvYfT3
- Worksheet — SMART Founders Goal Framework       1ZDCNqIsAtEZJ1t3SPoPYgEU4E26GPkSF
- Brand Blueprint Content Template v2             1pvi7ZENd4VEEKFUppqP8RmYPP3O7ev4A
- Brand Blueprint Week 2 (Director's Cut) guide   1dTSmyrae_EcCk4v8DUQyDVATLxRmpXNU
- LINK only (video): The Brand Blueprint Intro    1J0l2Tjvm6gmc5-bT2FqZEENt_xw8hokh

06 GROWTH OS & AI →
- Brand Blueprint Communications Hub Operating Playbook v1  1OE1tbvsg_IUAKwLVvVgnwporIjFwuaXx2zc3iBRf9Cs
- VGP Funding OS v2 — Activation Runbook          1LgfkST5O8SXYQawAzN8LQNykaJmnVL4zdHv-nXEYE7g
- VGP Investor CRM — Executive Operating Manual v1.0  1xHvWjoIOcDT-Z1CUPSAVuYgQFgih2GvlY3qH1XUQP5o
  (verify it contains no live investor PII before copying; otherwise LINK/skip)

07 PARTNER DIRECTORY →
- Partner Snapshot Template                       1U3wnx-vB17P8nFlh5j6STicGZ2XBGh2yvQH6wKqLCsg
- LINK only (living master): HotList_Partners     1q9lPeKlDmd_c-VxIvGGdv1_8ieNZBM1-C9wIzVoIn9k
- Build the directory: read the individual "— VGP Partner Snapshot" docs in folder
  1gN7CE4t5F60QzOOjaK_xqAD0H8pxSiQe and compile ONE clean "Founder Network Partner
  Directory" doc (partner name, what they do, who they help, how to reach them). Only
  include partners that are OK to list publicly to members; leave the rest for review.

EXCLUDE — never copy into the member hub (client-confidential / not reusable):
- Any client tax returns or financials (e.g. "MJ Retail" returns, GHG/3PG sales mix,
  Hollister operating model, Hippo Harvest / Hippo Farm summaries & LOIs).
- Client brand strategy decks (e.g. all MOODEAUX files, Credo Brand Deck).
- Signed agreements & partner-confidential docs (e.g. C6 Capital referral agreement /
  executive summary).
- Any credit memos, individual client P&Ls with a client's real numbers, or client
  questionnaire responses (the BLANK questionnaire template is fine; filled ones are not).
- Business plans submitted by specific founders (e.g. Scobucha).

DELIVERABLES
- Each of the 7 folders contains its copied templates + a "README — What's in this folder"
  Google Doc at the top (who/when/what for each item; links for the LINK-only items).
- One compiled "Founder Network Partner Directory" doc in folder 07.
- Update the START HERE doc (1N_q6iaK6MX5z38q0rf57fW0rGhJ0lKT4RG1W9EiHDvs) so each of the
  seven sections lists the actual resources now inside it.
- Post a short summary back to Dana: what you added per folder, what you LINKED instead of
  copied, and the "REVIEW WITH DANA" list of anything you left out.

Do not change sharing/permissions on any folder or file. Do not touch anything outside the
seven destination folders and the START HERE doc.
```
