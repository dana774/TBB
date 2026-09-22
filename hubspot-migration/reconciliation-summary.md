# Reconciliation summary (no PII)

Master records (102, from 4 legacy exports) matched live against the 163 existing HubSpot
contacts in account 246956537 on 2026-08-04.

| Outcome | Count | Action |
|---|---|---|
| Primary-email match to existing contact | 19 | Update / enrich existing (add taxonomy, no blank-overwrite) |
| Match via secondary email | 2 | Merge into existing; confirm primary email |
| New (no HubSpot match) | 81 | Create new contact |
| Existing HubSpot contacts not in the 4 files | 141 | Leave as-is (incl. 2 HubSpot sample contacts) |

Existing contacts: 163 total, 100% lifecycle = Lead, source = null (bulk-imported, pre-taxonomy).

## Data-quality flags carried into import
- 11 records missing first/last name → manual review before or at import
- 16 records with multiple emails → primary kept, extras to "Additional email addresses"
- 9 records with multiple phones → primary kept, extras preserved
- 75 records missing organization → import person-only, enrich company later
- 1 record with a Wix placeholder email (`…@crm.wix.com`) → replace before import
