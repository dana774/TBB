#!/usr/bin/env python3
"""
import_transcripts.py
=====================
Push transcript rich-text onto Shopify `episode` metaobjects, keyed by handle.

Reads the JSONL produced by transform_transcripts.py and calls the Shopify Admin
GraphQL `metaobjectUpsert` mutation once per episode. Upsert = it matches the existing
episode metaobject by {type:"episode", handle:<slug>} and only writes the transcript
field, leaving every other field untouched. Safe to re-run (idempotent); re-running
also OVERWRITES any earlier placeholder transcript with the faithful text.

Auth (never hard-code secrets — read from the environment):
    export SHOPIFY_STORE=the-brand-blueprint.myshopify.com
    export SHOPIFY_ADMIN_TOKEN=shpat_xxxxx        # Admin API access token
    # Token needs write_metaobjects scope. Create a custom app in
    # Shopify admin -> Settings -> Apps and sales channels -> Develop apps.

Usage:
    python3 import_transcripts.py --in transcripts_import.jsonl            # live
    python3 import_transcripts.py --in transcripts_import.jsonl --dry-run  # validate only

Only the standard library is used, so no pip install is required.
"""
import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error

API_VERSION = "2025-01"

MUTATION = """
mutation Up($handle: MetaobjectHandleInput!, $fields: [MetaobjectFieldInput!]!) {
  metaobjectUpsert(handle: $handle, metaobject: { fields: $fields }) {
    metaobject { handle }
    userErrors { field message code }
  }
}
"""


def post(store, token, query, variables):
    url = f"https://{store}/admin/api/{API_VERSION}/graphql.json"
    body = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("X-Shopify-Access-Token", token)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    ap = argparse.ArgumentParser(description="Import transcripts onto Shopify episode metaobjects")
    ap.add_argument("--in", dest="infile", required=True, help="JSONL from transform_transcripts.py")
    ap.add_argument("--dry-run", action="store_true", help="Parse + validate, do not write")
    args = ap.parse_args()

    store = os.environ.get("SHOPIFY_STORE")
    token = os.environ.get("SHOPIFY_ADMIN_TOKEN")
    if not args.dry_run and (not store or not token):
        sys.exit("ERROR: set SHOPIFY_STORE and SHOPIFY_ADMIN_TOKEN environment variables.")

    records = []
    with open(args.infile, encoding="utf-8") as fh:
        for i, line in enumerate(fh, 1):
            line = line.strip()
            if not line:
                continue
            rec = json.loads(line)
            if "handle" not in rec or "transcript" not in rec:
                sys.exit(f"ERROR line {i}: missing handle/transcript.")
            json.loads(rec["transcript"])  # rich-text must be valid JSON
            records.append(rec)

    print(f"Loaded {len(records)} records from {args.infile}.")
    if args.dry_run:
        print("Dry run OK — every rich-text payload parses. No writes performed.")
        return

    ok, failed = 0, []
    for rec in records:
        variables = {
            "handle": {"type": "episode", "handle": rec["handle"]},
            "fields": [{"key": "transcript", "value": rec["transcript"]}],
        }
        try:
            data = post(store, token, MUTATION, variables)
        except urllib.error.HTTPError as e:
            failed.append((rec["handle"], f"HTTP {e.code}: {e.read()[:200]}"))
            continue
        errs = (data.get("errors")
                or data.get("data", {}).get("metaobjectUpsert", {}).get("userErrors"))
        if errs:
            failed.append((rec["handle"], json.dumps(errs)))
        else:
            ok += 1
            print(f"  ok  {rec['handle']}")
        time.sleep(0.3)  # gentle on the 2 req/s REST-equivalent bucket

    print(f"\nDone. {ok} succeeded, {len(failed)} failed.")
    for h, msg in failed:
        print(f"  FAIL {h}: {msg}")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
