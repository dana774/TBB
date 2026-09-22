# HubSpot build scripts (token / REST API path)

These run the full CRM build against HubSpot account **246956537** via the REST API using a
Private App / Service Key token. They exist because the HubSpot **MCP connector cannot create
property definitions or pipelines** — only these API calls can.

## Prerequisite: network access

The scripts call `api.hubapi.com`. The Claude-Code-on-the-web environment must allow that host in
its **network policy** (this is the only blocker — the token itself works). If a run fails with a
proxy `403 / Tunnel connection failed`, the domain isn't allowed yet: add `api.hubapi.com` to the
environment's allowed domains (or use a policy that permits it), then start a session in that
environment. See https://code.claude.com/docs/en/claude-code-on-the-web.

## Run order

```bash
export HUBSPOT_TOKEN=pat-na2-********            # never commit this
# 1) schema — property group, 30 properties, VGP Commercial Pipeline (idempotent)
python3 01_create_schema.py --dry-run           # preview
python3 01_create_schema.py                     # apply

# 2) data — put the delivered CSVs in ./data (01_..ALL, 02_..PILOT_10, 04_..companies)
python3 02_import_data.py --data-dir ./data --pilot --dry-run   # preview the 10-record pilot
python3 02_import_data.py --data-dir ./data --pilot             # write the pilot, verify in HubSpot
python3 02_import_data.py --data-dir ./data --dry-run           # preview the full import
python3 02_import_data.py --data-dir ./data                     # full import + companies + tasks
```

## What each script does

- **01_create_schema.py** — creates the `VGP Relationship Model` group and every custom property
  from `../field-map.csv` (23 contact + 8 attribution + 6 company + 1 deal), plus the 11-stage
  **VGP Commercial Pipeline**. Idempotent — skips anything already present.
- **02_import_data.py** — upserts contacts **by email** (so the 19 existing matches are enriched,
  not duplicated), applies full taxonomy, special-cases the **2 secondary-email merges**
  (Aron Thompson, Lisa) by updating their existing IDs, creates + associates the 26 companies, sets
  conservative lifecycle stages, and creates HIGH-priority follow-up tasks only for Active Clients,
  Consulting Prospects, Institutional Partners, and Investors. `--pilot` runs just the 10-record
  pilot first. `--dry-run` prints the plan without writing.

## Notes

- `hs_api.py` reads the token from `HUBSPOT_TOKEN` and trusts the agent proxy CA bundle if present.
- Enumeration option values equal their labels, so the CSV values map directly.
- The token is never stored in this repo. Rotate/delete the Private App in HubSpot when done.
