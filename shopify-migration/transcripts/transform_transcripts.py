#!/usr/bin/env python3
"""
transform_transcripts.py
========================
Wix Episodes CSV export  ->  Shopify episode-metaobject transcript import (JSONL).

FAITHFUL, LOCAL, NO MODEL IN THE PAYLOAD PATH.
The transcript text is passed through byte-for-byte; this script only wraps it in
Shopify's rich-text JSON envelope and enforces the podcast-host governance allowlist.

Governance
----------
Only the 29 CLEAN slugs (historical_flag == false, no co-host references) are emitted.
The 6 WITHHELD co-host-era slugs are hard-excluded here as a second safety net, even if
a stray CSV flag says otherwise. Anything not on the clean allowlist is skipped + reported.

Usage
-----
    python3 transform_transcripts.py --in Episodes.csv --out transcripts_import.jsonl

  --in    Path to the Wix CMS "Episodes" collection CSV export
          (Wix dashboard -> CMS -> Episodes -> More Actions -> Export to CSV).
  --out   Output JSONL. One line per episode:
          {"handle": "<slug>", "transcript": "<rich-text-json-string>"}
          Feed this straight into import_transcripts.py.

The script auto-detects the slug and transcript columns case-insensitively and tolerates
common Wix header variants ("slug"/"Slug"/"link-episodes-slug", "transcript"/"Transcript").
"""
import argparse
import csv
import json
import sys

# --- 29 CLEAN slugs (historical_flag == false). Allowlist = the ONLY things emitted. ---
CLEAN_SLUGS = [
    "the-brand-blueprint-revolutionizing-personal-branding-for-founders-with-natalie-weakly",
    "the-brand-blueprint-blog-power-up-your-brand-with-these-essential-market-research-tools",
    "unleashing-entrepreneurial-success-the-bold-story-of-jacob-guss-and-bold-move-beverages",
    "blog-post-capsule-4-brand-development-and-product-strategy",
    "the-brand-blueprint-mastering-inclusive-marketing-strategies-and-insights-with-devoreaux-walton",
    "vision-persistence-and-pivoting-in-brand-building-insights-from-aisha-crump",
    "the-brand-blueprint-capsule-5-demystifying-marketing-roi-and-strategic-brand-growth",
    "the-brand-blueprint-navigating-product-development-a-deep-dive-into-the-ordinary-s-triumph-and-s",
    "the-brand-blueprint-mastering-product-development-insights-from-desi-the-glam-scientist",
    "innovating-the-beauty-industry-an-in-depth-interview-with-dwan-white",
    "the-importance-of-market-research-and-consumer-insights-in-brand-creation",
    "the-brand-blueprint-leveraging-linkedin-for-brand-success-expert-strategies-with-trish-lindo",
    "from-idea-to-reality-the-inspiring-journey-of-daniel-victor-and-hid-sips",
    "positioning-your-brand-in-a-saturated-market",
    "fashioning-a-cultural-tapestry-the-story-of-mapate-diop-and-diop-clothing",
    "the-brand-blueprint-navigating-tax-season-and-building-wealth-insights-from-patrice-malloy-the",
    "navigating-non-alcoholic-spirits-in-dry-january-with-phil-irvine",
    "the-brand-blueprint-blog-capsule-one-resources-essential-resources-for-crafting-your-brand-vision",
    "the-brand-blueprint-mastering-global-markets-strategic-insights-with-sylvia-lin",
    "revolutionizing-personal-branding-with-ai-insights-from-trish-lindo",
    "the-brand-blueprint-podcast-resource-capsule-market-research-and-analysis",
    "building-brand-identity-and-positioning-insights-from-the-brand-blueprint",
    "the-brand-blueprint-blog-establishing-your-brand-vision-essential-steps-for-aspiring-founders",
    "empowering-athletes-with-nil-the-magic-cleats-story",
    "the-unstoppable-force-kathleen-lanoix-s-journey",
    "happy-new-year-2026-seedspot-special-from-dakar-to-u-s-shelves-with-victorine-sarr-lyvv-maiso",
    "the-brand-blueprint-blog-ai-tools-and-tips-for-crafting-your-brand-vision",
    "mastering-visual-brand-identity-essential-tips-for-entrepreneurs",
    "the-build-a-brand-segment-market-research-tools",
]

# --- 6 WITHHELD co-host-era slugs. Hard-excluded second safety net. ---
WITHHELD_SLUGS = [
    "building-a-strong-brand-identity-insights-from-capsule-3-of-the-brand-blueprint-podcast",
    "unveiling-beauty-brand-secrets-with-ylorie-taylor",
    "the-brand-blueprint-case-study-apple-vs-blackberry-a-tale-of-two-brand-identities",
    "building-your-brand-insights-from-the-build-a-brand-panel",
    "unlocking-the-power-of-market-research-and-consumer-insights-for-your-brand",
    "the-brand-blueprint-build-a-brand-panel-segment-creating-a-standout-brand-in-haircare",
]

CLEAN_SET = set(CLEAN_SLUGS)
WITHHELD_SET = set(WITHHELD_SLUGS)

SLUG_HEADERS = {"slug", "link-episodes-slug", "link-episodes-title", "episode-slug"}
TRANSCRIPT_HEADERS = {"transcript", "transcript_text", "episode-transcript"}


def find_col(fieldnames, candidates):
    lower = {fn.lower().strip(): fn for fn in fieldnames}
    for c in candidates:
        if c in lower:
            return lower[c]
    return None


def to_rich_text(text):
    """Wrap plain transcript text in Shopify rich-text JSON. Byte-faithful: the only
    transformation is paragraph segmentation on blank lines (no character edits)."""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    parts = [p.strip() for p in text.split("\n\n") if p.strip()]
    if len(parts) <= 1:
        parts = [p.strip() for p in text.split("\n") if p.strip()]
    if not parts:
        parts = [text.strip()]
    return json.dumps(
        {"type": "root",
         "children": [{"type": "paragraph",
                       "children": [{"type": "text", "value": p}]} for p in parts]},
        ensure_ascii=False,
    )


def main():
    ap = argparse.ArgumentParser(description="Wix Episodes CSV -> Shopify transcript import JSONL")
    ap.add_argument("--in", dest="infile", required=True, help="Wix Episodes CSV export")
    ap.add_argument("--out", dest="outfile", default="transcripts_import.jsonl")
    args = ap.parse_args()

    with open(args.infile, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        if not reader.fieldnames:
            sys.exit("ERROR: CSV has no header row.")
        slug_col = find_col(reader.fieldnames, SLUG_HEADERS)
        tx_col = find_col(reader.fieldnames, TRANSCRIPT_HEADERS)
        if not slug_col:
            sys.exit(f"ERROR: could not find a slug column. Headers: {reader.fieldnames}")
        if not tx_col:
            sys.exit(f"ERROR: could not find a transcript column. Headers: {reader.fieldnames}")
        rows = list(reader)

    emitted, skipped_withheld, skipped_other, empty = [], [], [], []
    seen = set()
    with open(args.outfile, "w", encoding="utf-8") as out:
        for row in rows:
            slug = (row.get(slug_col) or "").strip()
            if not slug:
                continue
            if slug in WITHHELD_SET:
                skipped_withheld.append(slug)
                continue
            if slug not in CLEAN_SET:
                skipped_other.append(slug)
                continue
            transcript = (row.get(tx_col) or "").strip()
            if not transcript:
                empty.append(slug)
                continue
            out.write(json.dumps({"handle": slug, "transcript": to_rich_text(transcript)},
                                 ensure_ascii=False) + "\n")
            emitted.append(slug)
            seen.add(slug)

    missing = [s for s in CLEAN_SLUGS if s not in seen]
    print(f"Emitted            : {len(emitted)} / {len(CLEAN_SLUGS)} clean episodes -> {args.outfile}")
    print(f"Skipped (withheld) : {len(skipped_withheld)} co-host-era episodes (governance)")
    print(f"Skipped (not clean): {len(skipped_other)} rows not on the clean allowlist")
    if empty:
        print(f"WARNING empty transcript in CSV for {len(empty)}: {empty}")
    if missing:
        print(f"WARNING clean slug NOT found in CSV for {len(missing)}: {missing}")
    if len(emitted) != len(CLEAN_SLUGS):
        print("NOTE: expected 29. Review the warnings above before importing.")


if __name__ == "__main__":
    main()
