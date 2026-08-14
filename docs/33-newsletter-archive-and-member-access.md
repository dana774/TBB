# 33 — Newsletter archive & member access

The filing system for past issues of *The Founder Signal*, and how paid members reach them. Ties together
the template (`newsletter/template/`, doc 30 Part D), the intelligence database (doc 30 + the
`newsletter-intelligence` branch), and the member hub (docs 26–28).

## What exists now ✅
- **Issue archive (system-of-record):** `newsletter/issues/` — one folder per issue (`issue.pdf` +
  `issue.html`) plus `catalog.json`, the master index. A sample issue is filed to make it operational.
- **Intelligence database:** `newsletter/intelligence-database.csv` (on the `newsletter-intelligence`
  branch) — the opportunity back-catalog the sweeps append to.
- **Locked template:** `newsletter/template/` — the design every issue renders from.

## What this doc sets up
A single, integrated archive that is **filed in the repo** and **mirrored to Google Drive**, then served
to paid members through two gated doors.

```
   Approved issue
        │  render from newsletter/template/
        ▼
  newsletter/issues/<slug>/issue.pdf + issue.html      ← repo system-of-record
        │  + append to catalog.json
        ├───────────────► Google Drive member mirror (view-only, shared to founder-network Group)
        └───────────────► gated /members/newsletter page (VGP site renders catalog.json + PDFs)
```

## Member access (both gated to the Founder Network)
1. **On-site archive — `/members/newsletter`** (VGP site, per doc 28). Renders `catalog.json` and links
   each issue's PDF. Gated behind the member check (Google Group / membership). *Build: pending with the
   member area.*
2. **Google Drive mirror** — a shared, view-only folder members can browse directly. Members are granted
   access via the `founder-network` **Google Group**, which the `$99` join adds them to
   (`/api/member-provision`, doc 28). One membership → both doors.

## Google Drive folders to create
Creating Drive folders from this environment is permission-gated, so **create these once** (Dana, or approve
the connector prompt), then share to the `founder-network` Google Group as **Viewer**:

```
Founder Network/                                  (existing member hub root, if present)
└── The Founder Signal — Newsletter Archive/       ← share to founder-network Group (Viewer)
    ├── 2026/                                       (optional per-year subfolders)
    └── The Founder Signal — Intelligence Database  (the opportunities Sheet, doc 30)
```

Record each issue PDF's Drive `drive_file_id` back into `catalog.json` so the on-site page and the Drive
mirror stay in sync. When the Drive connector is authorized for non-interactive writes, the issue workflow
can upload + share automatically; until then it's a manual drop (or the best-effort mirror flags it).

## Integration with the issue workflow (doc 30, Mode 3)
On every send, the agent/operator: (1) files `issue.pdf` + `issue.html` into `newsletter/issues/<slug>/`,
(2) appends to `catalog.json` (`status: sent`, `sent_date`, `beehiiv_url`), (3) mirrors the PDF to the Drive
archive folder and records `drive_file_id`, (4) marks the database rows used in that issue
(`Used in issue`). The on-site archive and Drive mirror both read from the same catalog — one source of truth.

## Guardrails
- Archive is **member-gated**; do not expose issue PDFs on the public site.
- Keep `catalog.json` append-only for sent issues (edit only to add `drive_file_id`/links).
- No unverified numbers ship in an archived issue — they were signed off before send (doc 30).
