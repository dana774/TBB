# 23 — HubSpot CRM Taxonomy & Contact Migration

Source of truth: **VGP + Brand Blueprint HubSpot Migration Control Workbook v1.2** (Dana's upload, 2026-08-05). Built from four legacy Google Contacts exports. 137 source rows → **102 unique email-based contacts**. No HubSpot records were modified in producing this.

This doc is the no-PII control record. The two import files that contain personal data were delivered to Dana directly and are **deliberately not committed to Git**:
- `vgp-hubspot-pilot-10.csv` — the 10 pilot records
- `vgp-hubspot-contacts-full-102.csv` — the full set

## What's in the 102
| Primary Relationship Type | Count |
|---|---|
| Founder | 49 |
| Consulting Prospect | 23 |
| Active Client | 16 |
| Investor or Capital Provider | 11 |
| Partner | 3 |

Business Unit: all 102 = **Value Growth Partners**. Data review status: **91 ready for pilot, 11 manual review**. Lifecycle recommendation: 63 Lead · 23 Sales Qualified Lead · 16 Customer.

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
4. **Full import:** repeat with `vgp-hubspot-contacts-full-102.csv`. HubSpot dedupes by email, so re-importing the 10 pilot rows updates rather than duplicates.
5. **Work the 11 "Manual review" rows** (flagged in `vgp_data_review_status`) before treating them as clean.
6. **Reconcile** against any contacts already in HubSpot by email (the workbook's phase 4).

## How the website now writes into this taxonomy
New inbound leads from the site are tagged consistently with the migrated records (once the properties exist):
- **Advisory** (`/api/qualify`): `vgp_primary_relationship_type` = Consulting Prospect (or Active Client for the existing-client branch); `vgp_business_unit` = Value Growth Partners; `vgp_primary_interest` = Consulting; `vgp_original_relationship_source` = Website; `vgp_scheduling_eligibility` = Qualified prospect (qualified) / Public intake only; `vgp_data_review_status` = Unreviewed.
- **Institutional inquiry** (`/api/lead`): Primary = Institutional Partner; Interest = Partnership; Scheduling = Institutional.
- **Partner/contributor** (`/api/lead`): Primary = Referral Partner; Interest = Partnership.
- Values match the dropdown option labels above. Until the properties are created, the capture code's standard-property fallback still lands the contact (email/name/company/lifecycle) and simply omits the `vgp_*` fields.

## Open items for Dana
- Create the 14 properties (or hand me a live HubSpot connector session and I'll create them via API).
- Approve the pilot 10, then run the full import.
- Resolve the 11 manual-review records and the 1 missing-email source row.
- Company/Deal properties (`vgp_organization_type`, `vgp_strategic_priority`, `vgp_opportunity_type`) apply when you start populating Companies and Deals.
