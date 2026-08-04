# Transcript Export → Import Pipeline (Wix → Shopify)

Faithful, local, no-model-in-the-loop migration of the **29 clean episode transcripts**
onto their Shopify `episode` metaobjects. The transcript text is passed through
**byte-for-byte** — the pipeline only wraps it in Shopify rich-text JSON and enforces the
podcast-host governance allowlist. Runs on plain Python 3 stdlib; no pip installs.

## Why this path (not the chat bridge)
Moving transcript prose through the AI assistant risks (a) subtle rewording of Dana's
published copy and (b) large, slow round-trips. This pipeline keeps the words in files the
whole way, so what's on Wix is exactly what lands on Shopify.

## Governance (baked into the tooling)
- **Allowlist:** only the 29 `historical_flag=false` slugs are emitted.
- **Hard exclude:** the 6 co-host-era slugs are dropped even if a CSV flag says otherwise.
- Anything not on the clean allowlist is skipped and reported, never written.
The 6 withheld transcripts remain quarantined in `../transcripts-HISTORICAL-HOLD.json`
pending Dana's Round-1 / Q1 decision — do **not** import them with this pipeline.

## Steps

### 1. Export the Episodes collection from Wix
Wix dashboard → **CMS → Episodes → More Actions → Export to CSV**. Save as `Episodes.csv`.
(The export includes the `slug` and `transcript` columns, which is all this pipeline needs.)

### 2. Transform → import JSONL
```bash
python3 transform_transcripts.py --in Episodes.csv --out transcripts_import.jsonl
```
Expected: `Emitted : 29 / 29 clean episodes`. Review any WARNING lines before continuing
(empty transcript in CSV, or a clean slug missing from the export).

### 3. Validate (no writes)
```bash
python3 import_transcripts.py --in transcripts_import.jsonl --dry-run
```
Confirms every rich-text payload parses.

### 4. Import to Shopify
Create a custom app in Shopify admin → **Settings → Apps and sales channels → Develop apps**,
grant it **`write_metaobjects`**, install it, and copy the Admin API access token.
```bash
export SHOPIFY_STORE=the-brand-blueprint.myshopify.com
export SHOPIFY_ADMIN_TOKEN=shpat_xxxxx
python3 import_transcripts.py --in transcripts_import.jsonl
```
`metaobjectUpsert` matches each episode by `{type:"episode", handle:<slug>}` and writes
**only** the `transcript` field — every other field (title, guest, image, etc.) is left
untouched. The script is idempotent; safe to re-run.

### 5. Verify
Spot-check a few episodes in Shopify admin → **Content → Metaobjects → Episode**, or query
`metaobjectByHandle`.

## Notes
- **One episode already carries a validation placeholder.** During pipeline testing, the
  `...natalie-weakly` episode was written with a *lightly condensed* transcript. This import
  **overwrites it by handle** with the faithful text, so step 4 self-corrects it. (The store
  is password-protected, so nothing was ever public.)
- **Rich-text shape:** transcript is split into paragraphs on blank lines only; no character
  edits. If the Wix CSV collapses blank lines, it falls back to single-newline paragraphs,
  then to one paragraph — still byte-faithful to the words.
- **The other 12 of 47 episodes** have no substantive transcript; they're simply absent from
  the allowlist and left empty (attach summaries later if desired).

## Files
| File | Role |
|---|---|
| `transform_transcripts.py` | Wix `Episodes.csv` → `transcripts_import.jsonl` (governance-enforced) |
| `import_transcripts.py` | `transcripts_import.jsonl` → Shopify `episode` metaobjects (upsert by handle) |
| `README-import.md` | This runbook |
