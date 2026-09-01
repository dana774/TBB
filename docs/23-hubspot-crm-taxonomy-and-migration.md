# 23 — HubSpot CRM Taxonomy & Contact Migration

Source of truth: **VGP HubSpot Migration — Rebuilt Master v2** (Dana's upload, 2026-08-06). Consolidated from 6 sources (4 curated Google lists + Founders xlsx + Gmail backfill + prior workbook), deduped by email, taxonomy applied. **206 contacts** total. No HubSpot records were modified in producing this. (Supersedes v1.2's 102-record master.)

This doc is the no-PII control record. The import files contain personal data and are **deliberately not committed to Git** — delivered to Dana directly:
- `vgp-hubspot-pilot-10.csv` — 10 Approved pilot records
- `vgp-hubspot-contacts-approved-94.csv` — the 94 Approved (import-ready) records
- `vgp-hubspot-manual-review-112.csv` — 112 rows that need Dana's vetting **before** import (do not import as-is)

## What's in the 206 (v2)
| Metric | Count |
|---|---|
| Total | 206 (105 Vetted + 101 High-Value Backfill) |
| **Approved (import-ready)** | **94** |
| Manual review (needs vetting) | 112 |
| Org inferred from email domain | 160 (verify) · 16 still missing |

Primary Relationship Type (all 206): 79 Referral Partner · 58 Founder · 27 Investor or Capital Provider · 23 Consulting Prospect · 16 Active Client · 3 Partner. **Excluded / held in source (not imported): 1,256 Gmail "Unknown" + 484 "Friends & Family".** Rule: **only `Data Review Status = Approved` rows get imported.**

## Custom properties to create (HubSpot → Settings → Properties)
Create these before importing so the columns map cleanly. Contact object unless noted.

| Property label | Internal name | Type | Req | Options / notes |
|---|---|---|---|---|
| Primary Relationship Type | `vgp_primary_relationship_type` | Dropdown | ✓ | Active Client; Former Client; Consulting Prospect; Founder; Institutional Partner; Investor or Capital Provider; Retail or Corporate Contact; Referral Partner; Specialist or Service Partner; Podcast or Media Contact; Sponsor Prospect; Speaker or Event Organizer; Program Participant; Professional Peer; Vendor; Personal Network; Automated or Publication Contact; Other |
| Additional Relationship Types | `vgp_additional_relationship_types` | Multi-checkbox | — | Same option set; preserves multi-role relationships |
| Business Unit | `vgp_business_unit` | Multi-checkbox | ✓ | Value Growth Partners; The Brand Blueprint; Podcast; RED Academy; Accelerator or Ecosystem; Speaking and Media |
| Relationship Status | `vgp_relationship_status` | Dropdown | ✓ | New; Warm; Active; Strategic; Dormant; Closed |
| Primary Interest | `vgp_primary_interest` | Dropdown | — | Consulting; Retail; Capital; Founder Resources; Speaking; Partnership; Podcast; Sponsorship |
| Original Relationship Source | `vgp_original_relationship_source` | Dropdown | — | Google Contacts; Gmail; Popl; LinkedIn; Referral; Conference; Website; Podcast; Shopify; Calendly; Program |
| Follow-Up Priority | `vgp_follow_up_priority` | Dropdown | — | Urgent; High; Normal; Low; None |
| Next Follow-Up Date | `vgp_next_follow_up_date` | Date | — | For managed relationships |
| Scheduling Eligibility | `vgp_scheduling_eligibility` | Dropdown | — | Public intake only; Qualified prospect; Active client; Institutional; Podcast guest; Program participant; No scheduling |
| Legacy Source Lists | `vgp_legacy_source_lists` | Multi-checkbox | — | Active Clients; Founder Prospects; All Founders; Inner Circle Investors |
| Data Review Status | `vgp_data_review_status` | Dropdown | ✓ | Unreviewed; Manual review; Approved; Imported; Hold |
| Organization Type | `vgp_organization_type` | Dropdown | — | **Company** object — Founder Brand; Client Company; Accelerator; University; Retailer; Investor or Fund; Government; Nonprofit; Media; Service Partner; Other |
| Strategic Priority | `vgp_strategic_priority` | Dropdown | — | **Company** object — Tier 1; Tier 2; Tier 3; Monitor |
| Opportunity Type | `vgp_opportunity_type` | Dropdown | ✓ | **Deal** object — VGP Advisory; Retainer; Institutional Program; Workshop or Speaking; Brand Blueprint Partnership; Sponsorship; Founder Program; Strategic Project; Other |

> When the HubSpot connector is live in a session, these can be created via the CRM properties API instead of by hand. From this sandbox the HubSpot API host is blocked by egress policy, so creation is a UI (or live-connector) step.

## Legacy label → HubSpot translation (rules)
| Legacy source / label | HubSpot translation | Rule |
|---|---|---|
| VGP Active Clients | Primary = Active Client; Lifecycle = Customer | No deal unless an active commercial engagement is documented |
| VGP Prospect | Primary = Consulting Prospect | Lifecycle = SQL only after current fit is confirmed |
| VGP ALL Founders Group | Additional = Founder | Do not assume commercial opportunity |
| VGP Inner Circle Investors | Additional = Investor or Capital Provider | Ecosystem relationship, not automatically a deal |
| VGP Past Clients | Primary/Additional = Former Client | Lifecycle stays Customer or Other per governance |
| VGP Partners | Additional = Partner | Classify partner subtype during review |
| TBB Guests | Additional = Podcast Guest | Route through controlled podcast scheduling |
| RED Academy Partners | Business Unit = RED Academy | Preserve institutional/ecosystem role |
| CIC Founders | Business Unit = Accelerator or Ecosystem; Additional = Founder | Preserve program affiliation |
| Friends and Family | Additional = Personal Network | Exclude from mass marketing unless consent exists |

## Migration runbook (UI path — works without API)
1. **Create the properties above** (Settings → Properties). Match internal names exactly.
2. **Import the pilot first:** HubSpot → Contacts → Import → File → `vgp-hubspot-pilot-10.csv`. Map columns (standard headers auto-map; the `vgp_*` headers map to the properties from step 1). Import; do **not** create duplicate/list-based automations yet.
3. **Verify the pilot 10** — spot-check relationship type, business unit, lifecycle, review status. Confirm no unwanted workflow fired.
4. **Full import:** repeat with `vgp-hubspot-contacts-approved-94.csv` (the 94 Approved rows). HubSpot dedupes by email, so re-importing the 10 pilot rows updates rather than duplicates.
5. **Vet the 112 "Manual review" rows** (`vgp-hubspot-manual-review-112.csv`): fix any `Org Inferred = Yes` names, then set Data Review Status = Approved and import that batch. Do not import them as-is.
6. **Reconcile** against any contacts already in HubSpot by email (the workbook's phase 4).

## How the website now writes into this taxonomy
New inbound leads from the site are tagged consistently with the migrated records (once the properties exist):
- **Advisory** (`/api/qualify`): `vgp_primary_relationship_type` = Consulting Prospect (or Active Client for the existing-client branch); `vgp_business_unit` = Value Growth Partners; `vgp_primary_interest` = Consulting; `vgp_original_relationship_source` = Website; `vgp_scheduling_eligibility` = Qualified prospect (qualified) / Public intake only; `vgp_data_review_status` = Unreviewed.
- **Institutional inquiry** (`/api/lead`): Primary = Institutional Partner; Interest = Partnership; Scheduling = Institutional.
- **Partner/contributor** (`/api/lead`): Primary = Referral Partner; Interest = Partnership.
- Values match the dropdown option labels above. Until the properties are created, the capture code's standard-property fallback still lands the contact (email/name/company/lifecycle) and simply omits the `vgp_*` fields.

## Property status — VERIFIED LIVE (2026-08-06)
Checked against the live HubSpot connector: **all 14 properties already exist** (Contact, Company, and Deal), and their dropdown option values **exactly match** what the website writes. Confirmed present: `vgp_primary_relationship_type`, `vgp_additional_relationship_types`, `vgp_business_unit`, `vgp_relationship_status`, `vgp_primary_interest`, `vgp_original_relationship_source`, `vgp_scheduling_eligibility`, `vgp_follow_up_priority`, `vgp_next_follow_up_date`, `vgp_data_review_status` (Contact); `vgp_organization_type`, `vgp_strategic_priority` (Company); `vgp_opportunity_type` (Deal) — plus extras (consent status, attribution, program affiliation). No creation needed; import CSVs map cleanly and live capture populates correctly.

## Open items for Dana
- ~~Create the 14 properties~~ — done (verified live above).
- Approve the pilot 10, then run the full import.
- Resolve the 11 manual-review records and the 1 missing-email source row.
- Company/Deal properties (`vgp_organization_type`, `vgp_strategic_priority`, `vgp_opportunity_type`) apply when you start populating Companies and Deals.
