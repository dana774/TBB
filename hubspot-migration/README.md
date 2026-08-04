# HubSpot Migration Package

Non-PII specifications for migrating the VGP + Brand Blueprint relationship model into HubSpot
account **246956537**. Full procedure: [`../docs/21-hubspot-crm-structure-and-integration-runbook.md`](../docs/21-hubspot-crm-structure-and-integration-runbook.md).

The actual contact/company data files (`01`–`05`, containing PII) are delivered directly to Dana
and are **intentionally not committed to this repo**.

| File | Contents |
|---|---|
| `field-map.csv` | Every custom property to create: object, label, internal name, type, options, required |
| `legacy-label-map.csv` | Google label → HubSpot property translation + governance rule |
| `calendly-eventtype-routing.csv` | Live Calendly event types → relationship route + scheduling eligibility |
| `deal-pipeline-spec.md` | VGP Commercial Pipeline stages, deal types, lifecycle governance |
| `contacts-import-TEMPLATE.csv` | Header + synthetic example rows (safe to share/upload as a mapping test) |
| `reconciliation-summary.md` | Counts only (no PII) from matching 102 master records vs 163 existing contacts |

## Status snapshot

- Source rows 137 → 102 unique master records (35 overlaps merged).
- Existing HubSpot contacts: 163 (all lifecycle = Lead).
- Reconciliation: 19 primary-email matches, 2 secondary-email matches, 81 new, 141 existing-only.
- Custom `vgp_*` properties in account: **0** — create in HubSpot UI before taxonomy import.
- HubSpot record-level read/write: available. Schema (property/pipeline) creation: UI-only from here.
