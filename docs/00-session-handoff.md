# 00 — Session handoff: VGP HubSpot ecosystem build

Read this first. It's the pickup point for continuing the HubSpot + connected-apps build in a new
Claude Code session. Full detail lives in `docs/21`–`docs/26` and the runnable scripts in
`hubspot-migration/build/`.

## Kickoff prompt (paste into the new session)
> Continue the VGP HubSpot ecosystem build. Repo `dana774/tbb`, branch
> `claude/hubspot-structure-integrations-5ocgxs`. Read `docs/21`–`docs/26` and `hubspot-migration/build/`
> first. HubSpot account 246956537 (na2); I'll paste the Private App token. The CRM schema, the 102
> curated contacts, companies, tasks, and scheduling eligibility are already live; the 1,826
> Google-synced contacts are quarantined as `Unreviewed`. Remaining work is in this doc. Start by
> confirming the token reaches `api.hubapi.com`, then tell me what you can run now.

## Essential facts
- **Environment:** start in the **same cloud environment** that has **Network access = Custom with
  `api.hubapi.com` allowed**. A different/Default environment re-blocks the token path.
- **Repo / branch:** `dana774/tbb` · `claude/hubspot-structure-integrations-5ocgxs`.
- **HubSpot token:** re-paste the same Private App token (Settings → Integrations → Private Apps →
  [app] → "Show token"). Scripts read it from the `HUBSPOT_TOKEN` env var. Never commit it.
- **HubSpot account:** portal **246956537**, region **na2**, Starter plan.
- **Connector note:** the HubSpot token/REST path is reliable; the MCP connectors (Asana, Beehiiv, etc.)
  were flapping — a fresh session usually gets a calmer window for the live syncs.

## Already done — do NOT redo
- Property group **VGP Relationship Model** + **34 custom properties** (contact/company/deal, incl. 8
  attribution, 3 Asana-handoff deal fields, Newsletter source + status).
- **VGP Commercial Pipeline** — 11 stages.
- **102 curated contacts** fully tagged (Founder 49 · Consulting Prospect 23 · Active Client 16 ·
  Investor or Capital Provider 11 · Referral Partner 3) + `vgp_scheduling_eligibility`.
- **26 companies** + 27 contact↔company associations + **50 priority tasks**.
- **1,826 Google-synced contacts** flagged `vgp_data_review_status = Unreviewed`; Google contact sync **off**.

## Remaining work
1. **Segment lists (10)** — add `crm.lists.read` + `crm.lists.write` to the token, then run
   `hubspot-migration/build/03_create_lists.py`. (`docs/24`)
2. **Asana delivery template** — create "VGP Client Delivery — TEMPLATE" (workspace 1200319959281435)
   when the Asana connector is stable. (`docs/25`)
3. **Beehiiv subscriber backfill** — scope subscriber count, confirm scale, upsert into HubSpot. (`docs/26`)
4. **Visual dashboards (10)** — build in the HubSpot UI from the build sheet. (`docs/24`)
5. **Website/new-host + Shopify forms** — hand the two prompts to those agents. (`docs/22`)
6. **Confirm Calendly** end-to-end with one test booking. (`docs/23`)

## Parked on Dana's side
- Add `crm.lists` scopes to the token → then lists can be built.
- Test Calendly booking → confirms that integration end-to-end.

## Doc map
| Doc | Contents |
|---|---|
| `21` | CRM structure + integration runbook (property model, pipeline, reconciliation, import) |
| `22` | Website + Shopify agent handoff prompts (new host → HubSpot; payments → Shopify) |
| `23` | Gmail + Calendly → HubSpot integration setup |
| `24` | Dashboards & segments (10 lists + 10 dashboards) |
| `25` | HubSpot → Asana delivery handoff |
| `26` | Beehiiv → HubSpot subscriber center |
| `hubspot-migration/build/` | Runnable scripts: `01_create_schema`, `02_import_data`, `03_create_lists`, `hs_api` |

## Data / PII note
Contact PII (the master CSVs, workbook) was delivered to Dana directly and is **not** in the repo. If a
re-import is needed, re-provide the workbook or CSVs into `hubspot-migration/build/data/`; the schema and
the 102-contact import are already complete, so this is rarely needed.
