#!/usr/bin/env python3
"""
file-issue.py — file a sent issue of The Founder Signal into the archive.

Codifies the "file the issue + update catalog" step so it can't be forgotten or drift
(docs 30 Mode 3, doc 33). Copies the rendered PDF (and optional HTML) into
newsletter/issues/<slug>/ and appends/updates the entry in newsletter/issues/catalog.json.

Idempotent: re-running with the same --slug (or same date+title) updates that entry in place
instead of duplicating it. Stdlib only.

Usage:
    python3 newsletter/file-issue.py \
        --pdf /path/to/The-Founder-Signal.pdf \
        --html /path/to/issue.html \
        --title "Funding, capital moves & founder news" \
        --market-signal "Your barcode is becoming a data system (GS1 Sunrise 2027)" \
        --date 2026-08-13 \
        --status sent \
        --beehiiv-url https://the-founder-signal.beehiiv.com/p/...   # optional
        --drive-file-id 1AbC...                                       # optional

Only --pdf and --title are required; --date defaults to today.
"""
import argparse
import datetime as dt
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent          # newsletter/
ISSUES = ROOT / "issues"
CATALOG = ISSUES / "catalog.json"


def slugify(date: str, title: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:48].strip("-")
    return f"{date}-founder-signal-{base}" if base else f"{date}-founder-signal"


def load_catalog() -> dict:
    if CATALOG.exists():
        return json.loads(CATALOG.read_text(encoding="utf-8"))
    return {
        "publication": "The Founder Signal",
        "notes": "Master catalog of newsletter issues. Feeds the gated /members/newsletter archive "
                 "and the Google Drive member mirror. One object per issue; append on each send.",
        "issues": [],
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="File a sent issue into the archive + catalog.")
    ap.add_argument("--pdf", required=True, help="Path to the rendered issue PDF")
    ap.add_argument("--html", help="Path to the issue HTML source (optional but recommended)")
    ap.add_argument("--title", required=True, help="Issue title")
    ap.add_argument("--market-signal", default="", help="This issue's Market Signal headline")
    ap.add_argument("--date", default=dt.date.today().isoformat(), help="Issue date YYYY-MM-DD")
    ap.add_argument("--slug", help="Override the auto-generated slug")
    ap.add_argument("--status", default="sent", choices=["sent", "draft", "sample"])
    ap.add_argument("--sent-date", help="Send date YYYY-MM-DD (defaults to --date when status=sent)")
    ap.add_argument("--beehiiv-url", default=None)
    ap.add_argument("--drive-file-id", default=None)
    args = ap.parse_args()

    pdf_src = Path(args.pdf)
    if not pdf_src.is_file():
        sys.exit(f"ERROR: PDF not found: {pdf_src}")

    slug = args.slug or slugify(args.date, args.title)
    issue_dir = ISSUES / slug
    issue_dir.mkdir(parents=True, exist_ok=True)

    def safe_copy(src: Path, dst: Path):
        if src.resolve() != dst.resolve():
            shutil.copyfile(src, dst)

    safe_copy(pdf_src, issue_dir / "issue.pdf")
    if args.html:
        html_src = Path(args.html)
        if not html_src.is_file():
            sys.exit(f"ERROR: HTML not found: {html_src}")
        safe_copy(html_src, issue_dir / "issue.html")

    sent_date = args.sent_date or (args.date if args.status == "sent" else None)
    entry = {
        "issue": args.status if args.status == "sample" else None,  # numbering assigned below for sent
        "date": args.date,
        "title": args.title,
        "market_signal": args.market_signal,
        "slug": slug,
        "pdf": f"newsletter/issues/{slug}/issue.pdf",
        "html": f"newsletter/issues/{slug}/issue.html" if args.html else None,
        "status": args.status,
        "sent_date": sent_date,
        "beehiiv_url": args.beehiiv_url,
        "drive_file_id": args.drive_file_id,
    }

    catalog = load_catalog()
    issues = catalog.setdefault("issues", [])
    # Upsert by slug (idempotent).
    existing = next((i for i, it in enumerate(issues) if it.get("slug") == slug), None)
    if existing is not None:
        # preserve a previously assigned issue number
        entry["issue"] = issues[existing].get("issue", entry["issue"])
        issues[existing] = entry
        action = "updated"
    else:
        # assign the next sequential number for real sent issues
        if args.status == "sent":
            nums = [it.get("issue") for it in issues if isinstance(it.get("issue"), int)]
            entry["issue"] = (max(nums) + 1) if nums else 1
        issues.append(entry)
        action = "added"

    # keep newest first by date
    issues.sort(key=lambda it: (it.get("date") or ""), reverse=True)
    CATALOG.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Filed issue '{slug}' ({action}). Catalog now lists {len(issues)} issue(s).")
    print(f"  → {issue_dir}/issue.pdf")
    if args.drive_file_id is None:
        print("  ! drive_file_id not set — mirror the PDF to the Drive archive folder and re-run "
              "with --drive-file-id (doc 33).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
