# Founder Network — collections 08 & 09 (built 2026-08-24)

Two new member-library collections built to the v5.0 standard of collections 01–07.
**Files are built and validated but NOT yet uploaded to Drive** — see "Status" below.

Target parent: **Founder Network — Members** (`1ls2sHkPm9f-qtAhEiupuxhLk7TetWE0m`)

| Collection | Drive folder | Folder ID |
|---|---|---|
| 08 · Start Here + Founder Operating Cadence | ✅ created | `1gssv1wE14p6FHLFxj7oUcRWGY5x4Iade` |
| 09 · Accelerator + Alumni Continuity | ❌ not created | — |

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
