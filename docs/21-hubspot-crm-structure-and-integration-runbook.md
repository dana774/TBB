# 21 — HubSpot CRM Structure + Ecosystem Integration Runbook

**Prepared from:** `VGP_HubSpot_Migration_Control_Workbook_v1.xlsx` (four legacy Google Contacts exports) and the live state of the connected VGP / Brand Blueprint apps.

**Author:** Claude (migration prep). **Publisher / approver:** Dana Ammons.

---

## 0. Session status — read first

**No changes were written to HubSpot in this session.** This was deliberate (per the migration brief: reconcile and test before any import), not a blocker.

**What is reachable:** HubSpot account **246956537** (Dana Ammons, `dana@valugrowthpartners.com`, US/Eastern, USD, STANDARD tier, created 2026-08-04 — the new account). Record-level **read + write** are available for Contacts, Companies, Deals, Tasks, Notes, Calls, Emails, Meetings, Line Items, Products. So contacts/companies/deals/tasks **can** be created and updated once approved.

**What is NOT reachable from here:** custom **property definitions** and **deal pipelines** are schema/settings objects — the available HubSpot tools manage *records*, not *schema*. Confirmed live: **none** of the `vgp_*` custom properties exist in the account yet. Therefore the taxonomy in §3–§4 must be created **in the HubSpot UI** (Settings → Properties / Pipelines) — or via a HubSpot Private App token with schema scope in a future session — **before** any record write can carry the relationship taxonomy. Writing records first would reproduce the "everything is a generic Lead" problem the brief warns against.

**Execution order that follows from this:** (1) create properties + pipeline in the UI → (2) approve the reconciliation plan → (3) this session (or a future one) writes the pilot, then the full set, via the HubSpot record tools.

This session produced the **ready-to-execute package**: import-formatted files, a completed reconciliation against the 163 existing records, the exact property/pipeline spec, and integration steps grounded against the real Calendly / Wix / Shopify / Gmail accounts.

---

## 1. Migration snapshot

| Metric | Value |
|---|---|
| Source rows (4 files: 16 Active Clients + 23 Prospects + 81 Founders + 17 Investors) | 137 |
| Duplicate rows merged (multi-list membership) | 35 |
| **Unique email-based master records** | **102** |
| Records flagged for review (any issue) | 99 |
| Records ready to import as-is | 91 |
| Records needing manual review before import (missing name) | 11 |
| Derived companies (from Organization field) | 26 |
| Pilot records selected | 10 |

Issue tallies across the 102 master records: missing organization 75 · multi-list relationship 32 · multiple email addresses 16 · missing name 11 · multiple phone numbers 9.

> Note: an earlier estimate put the unique count near 134. The actual email-key dedup produced **102 unique records** (137 − 35 overlaps). Use 102.

---

## 2. Deliverable files

Import-ready data (contains contact PII — delivered directly to Dana, **not** committed to git):

| File | Contents | Use |
|---|---|---|
| `01_hubspot_contacts_ALL.csv` | All 102 master contacts, HubSpot column headers | Full import (after pilot passes) |
| `02_hubspot_contacts_PILOT_10.csv` | 10 high-confidence pilot records | **Import first** |
| `03_exceptions_review.csv` | 99 flagged records with issue reasons | Manual review queue |
| `04_hubspot_companies_import.csv` | 26 derived companies | Company import + association |

Non-PII specs (committed to this repo under `hubspot-migration/`):

| File | Contents |
|---|---|
| `hubspot-migration/field-map.csv` | Every custom property: object, label, internal name, type, options, required |
| `hubspot-migration/legacy-label-map.csv` | Google label → HubSpot property translation + rule |
| `hubspot-migration/calendly-eventtype-routing.csv` | Live Calendly event types → relationship route + scheduling eligibility |
| `hubspot-migration/deal-pipeline-spec.md` | Pipeline stages, deal types, lifecycle governance |
| `hubspot-migration/contacts-import-TEMPLATE.csv` | Header + synthetic example rows (safe to share) |

---

## 3. HubSpot object model — properties to create

Create these under **Settings → Properties** before any import. Group them in a new property group **"VGP Relationship Model"** on each object. Full machine-readable list: `hubspot-migration/field-map.csv`.

### 3.1 Contact properties

| Label | Internal name | Type | Req | Options |
|---|---|---|---|---|
| Primary Relationship Type | `vgp_primary_relationship_type` | Dropdown | Yes | Active Client; Former Client; Consulting Prospect; Founder; Institutional Partner; Investor or Capital Provider; Retail or Corporate Contact; Referral Partner; Specialist or Service Partner; Podcast or Media Contact; Sponsor Prospect; Speaker or Event Organizer; Program Participant; Professional Peer; Vendor; Personal Network; Automated or Publication Contact; Other |
| Additional Relationship Types | `vgp_additional_relationship_types` | Multi-checkbox | No | *(same option set as above — the multi-role layer)* |
| Business Unit | `vgp_business_unit` | Multi-checkbox | Yes | Value Growth Partners; The Brand Blueprint; Podcast; RED Academy; Accelerator or Ecosystem; Speaking and Media |
| Relationship Status | `vgp_relationship_status` | Dropdown | Yes | New; Warm; Active; Strategic; Dormant; Closed |
| Primary Interest | `vgp_primary_interest` | Dropdown | No | Consulting; Retail; Capital; Founder Resources; Speaking; Partnership; Podcast; Sponsorship |
| Program or Ecosystem Affiliation | `vgp_program_affiliation` | Multi-checkbox | No | RED Academy; CIC; Build in Tulsa; SEED SPOT; W.E. Build; Black Ambition; JumpStart; Other |
| Original Relationship Source | `vgp_original_relationship_source` | Dropdown | No | Google Contacts; Gmail; Popl; LinkedIn; Referral; Conference; Website; Podcast; Shopify; Calendly; Program |
| Latest Relationship Source | `vgp_latest_relationship_source` | Dropdown | No | *(same option set as Original)* |
| Follow-Up Priority | `vgp_follow_up_priority` | Dropdown | No | Urgent; High; Normal; Low; None |
| Next Follow-Up Date | `vgp_next_follow_up_date` | Date | No | — |
| Last Meaningful Interaction | `vgp_last_meaningful_interaction` | Date | No | — |
| Scheduling Eligibility | `vgp_scheduling_eligibility` | Dropdown | No | Public intake only; Qualified prospect; Active client; Institutional; Podcast guest; Program participant; No scheduling |
| Consent Status | `vgp_consent_status` | Dropdown | No | Explicit opt-in; Implied (existing relationship); Unknown; Do not market |
| Legacy Source Lists | `vgp_legacy_source_lists` | Multi-checkbox | No | Active Clients; Founder Prospects; All Founders; Inner Circle Investors; Past Clients; Partners; Friends and Family; TBB Guests |
| Data Review Status | `vgp_data_review_status` | Dropdown | Yes | Unreviewed; Manual review; Approved; Imported; Hold |

HubSpot native fields used directly by the import: Email, First Name, Last Name, Company name, Job Title, Phone Number, **Additional email addresses** (semicolon-delimited secondary emails), Lifecycle Stage.

### 3.2 Company properties

| Label | Internal name | Type | Options |
|---|---|---|---|
| Organization Type | `vgp_organization_type` | Dropdown | Founder Brand; Client Company; Accelerator; University; Retailer; Investor or Fund; Government; Nonprofit; Media; Service Partner; Other |
| Business Unit Relationship | `vgp_business_unit_rel` | Multi-checkbox | Value Growth Partners; The Brand Blueprint; Podcast; RED Academy; Accelerator or Ecosystem; Speaking and Media |
| Strategic Priority | `vgp_strategic_priority` | Dropdown | Tier 1; Tier 2; Tier 3; Monitor |
| Program Affiliation | `vgp_company_program_affiliation` | Multi-checkbox | *(same as contact program set)* |
| Institutional Relationship Status | `vgp_institutional_status` | Dropdown | Prospective; Active; Historical; Dormant |
| Data Review Status | `vgp_company_review_status` | Dropdown | Unreviewed; Manual review; Approved; Imported; Hold |

### 3.3 Deal property

| Label | Internal name | Type | Options |
|---|---|---|---|
| Opportunity Type | `vgp_opportunity_type` | Dropdown | VGP Advisory; Retainer; Institutional Program; Workshop or Speaking; Brand Blueprint Partnership; Sponsorship; Founder Program; Strategic Project; Other |

---

## 4. Deal pipeline

Create **one** pipeline: **"VGP Commercial Pipeline"** (Settings → Objects → Deals → Pipelines). A deal is created **only** for a defined commercial/funded opportunity — never automatically from a relationship, list membership, or meeting.

Stages: New Opportunity → Qualification Required → Discovery Scheduled → Qualified → Scope Development → Proposal Submitted → Decision or Negotiation → Contracting → Closed Won → Closed Lost → Nurture or Deferred.

Later, if volume justifies, split Institutional Program and Sponsorship into their own pipelines. Full spec: `hubspot-migration/deal-pipeline-spec.md`.

---

## 5. Lifecycle stage governance

Lifecycle stage stays **broad**; it does not carry the relationship taxonomy (that's `vgp_primary_relationship_type`).

| Lifecycle stage | Meaning here | Import default |
|---|---|---|
| Subscriber | Newsletter/resource subscriber | Shopify/newsletter only |
| Lead | Known/inbound contact | **Founders, most records** |
| Marketing Qualified Lead | Meets basic fit | after review |
| Sales Qualified Lead | Ready for commercial talk | **Consulting Prospects** |
| Opportunity | A real deal exists | set by deal creation |
| Customer | Active paying client | **Active Clients** |
| Evangelist | Advocate/referral source | manual |
| Other | Noncommercial but relevant | Personal Network etc. |

The import files carry a conservative `Lifecycle Stage` per record (Founder→Lead, Prospect→SQL, Active Client→Customer). Do **not** bulk-promote lifecycle after import; reclassify deliberately once the taxonomy is live and verified.

---

## 6. Legacy label translation

Full table: `hubspot-migration/legacy-label-map.csv`. Summary:

| Legacy Google label | HubSpot translation | Rule |
|---|---|---|
| VGP Active Clients | Primary = Active Client; Lifecycle = Customer | No deal unless active engagement documented |
| VGP Prospect | Primary = Consulting Prospect | Lifecycle = SQL only after fit confirmed |
| VGP ALL Founders Group | Additional = Founder | Do not assume commercial opportunity |
| VGP Inner Circle Investors | Additional = Investor or Capital Provider | Ecosystem relationship, not auto-deal |
| VGP Past Clients | Former Client | Lifecycle Customer/Other per governance |
| VGP Partners | Additional = Referral/Specialist Partner | Classify subtype in review |
| TBB Guests | Additional = Podcast or Media Contact | Route via controlled podcast scheduling |
| RED Academy Partners | Business Unit = RED Academy | Preserve institutional role |
| CIC Founders | Business Unit = Accelerator/Ecosystem; Additional = Founder | Preserve program affiliation |
| Friends and Family | Additional = Personal Network | Exclude from mass marketing unless consent |

---

## 7. Import procedure (pilot-first)

### 7.0 Reconciliation result (completed this session)

The 102 master records were matched live against the **163 existing HubSpot contacts** (all currently lifecycle = Lead). Full per-record output: `05_reconciliation.csv`.

| Outcome | Count | Action |
|---|---|---|
| Primary-email match to an existing contact | 19 | **Update / enrich** existing record (add taxonomy; never blank-overwrite) |
| Match via a secondary email | 2 | **Merge** — `aron_thompson@gspnet.com` ↔ existing `athompson@ulmt.org`; `lisa@braintrustfund.vc` ↔ existing `lisa@thebraintrust.com`. Pick the correct primary email before writing |
| New (no HubSpot match) | 81 | **Create** new contact |
| Existing HubSpot contacts not in the four files | 141 | Leave as-is (includes 2 HubSpot sample contacts + Gmail-sourced records) |

Flag: one new record (`Marrico Simpson`) carries a Wix placeholder address `7e79…@crm.wix.com` — replace with a real email before or during import.

### 7.1 Steps

1. **Create all properties** in §3, the pipeline in §4, and the property group. Nothing carries taxonomy before the target fields exist.
2. Reconciliation baseline is already captured (§7.0) — re-run only if the 163 records change materially before import.
3. Apply the §7.0 plan: the 19 primary matches and 2 secondary matches **update** existing records; the 81 news **create**. Keep "Create and update" mode and **do not** let blank cells overwrite existing values.
4. **Pilot import**: upload `02_hubspot_contacts_PILOT_10.csv`. Map columns to the §3 internal names. Import as Contacts. Verify: multi-role fields populated, secondary emails landed in "Additional email addresses," no duplicates created, lifecycle correct.
5. **Companies**: upload `04_hubspot_companies_import.csv`, then associate contacts to companies (HubSpot auto-associates by email domain where the domain matches; the 75 records with no organization stay person-only).
6. **Full import**: once the pilot validates, import the remaining 92 from `01_hubspot_contacts_ALL.csv`.
7. **Tasks**: create follow-up tasks **only** for active clients, open prospects, strategic institutional/investor relationships, time-sensitive referrals, recent networking contacts, and any record with a promised next action. No blanket task creation.

---

## 8. Exception handling

`03_exceptions_review.csv` is the manual queue. Priorities:

- **11 missing-name records** (`Data Review Status = Manual review`): resolve names from Gmail/organization/domain before import, or import with `vgp_data_review_status = Manual review` and a follow-up task. Do **not** guess names.
- **16 multiple-email records**: primary email kept in `Email`; the rest are in `Additional email addresses` (semicolon-delimited) so HubSpot merges rather than fragments. Confirm the chosen primary is the person's current working address (e.g. prefer a branded domain over yahoo/facebook).
- **9 multiple-phone records**: primary in `Phone Number`; extras preserved in `Additional Phone Numbers` (import to a custom text property or a note).
- **75 missing-organization records**: import as person-only; enrich company later. Not a blocker.
- **32 multi-list records**: these are the multi-role relationships — verify `Primary` vs `Additional` relationship split is correct (e.g. an Active Client who is also Personal Network).

---

## 9. Integration runbooks (grounded to live accounts)

Every integration below **feeds HubSpot**; none replaces the source system. All require HubSpot connected first.

### 9.1 Gmail — inbox `dana@valugrowthpartners.com`

Install the **HubSpot Sales Gmail extension** + connect the inbox (Settings → Integrations → Email → Connect inbox → Google).

- Log 1:1 VGP email to contacts/companies; enable "log" but keep "track" selective.
- **Exclude from logging & from auto-contact-creation** (never-log list + block auto-create): `Google Alerts` (1,305 msgs), newsletters, and automated senders. The account's existing labels confirm these bulk/automation sources.
- Turn **off** "create contact for everyone I email" — use manual/selective contact creation to avoid importing automated and one-off addresses.
- Existing lead-source labels to preserve as context (map to `Original Relationship Source`/notes, not auto-import): `VGP Info/Arkla Finance/ALTFC - Broker` (18), `... Manufacturing Conference Leads` (16), `... Alabama Business Expansion Leads` (5), `Brand Blueprint Invites` (1).
- Preserve the controlled email-signature architecture (per the Signature & Calendly Invite Deployment Guide): signature links point to owned intake, not raw private Calendly URLs.

### 9.2 Google Calendar

Connect calendar (Settings → Integrations → Calendar) for meeting sync + the HubSpot meetings tool. Two-way sync so booked meetings log to the contact timeline and update `Last Meaningful Interaction`. This is the Google Calendar layer beneath Calendly.

### 9.3 Wix forms → HubSpot (VGP + Brand Blueprint)

Live Wix sites in the account:

| Site | Wix Site ID |
|---|---|
| Value Growth Partners (live) | `0ffc3e07-f518-4e90-b064-9e4541a51f3f` |
| The Brand Blueprint (live) | `792a4d99-cea8-477e-8870-6e65dc0a9ce8` |
| Vgp Staging 2026 | `6b5d8f63-fc66-449d-8c07-2d826ef21d2d` |
| Bb Staging 2026 | `a7642a66-cb39-4be6-9517-9ebf10b70906` |

Wix has no first-party HubSpot form sync on all plans; use HubSpot's native Wix integration where available, otherwise a Wix Automation → HubSpot Forms API / Zapier bridge per form. Map the nine existing intake routes:

| Website pathway | HubSpot outcome | Property writes |
|---|---|---|
| BB Start Here | Founder prospect + founder-intake | Primary = Founder; Business Unit = The Brand Blueprint; Scheduling Eligibility = Qualified prospect |
| BB Founder Network | Founder-network lead/subscriber | Additional = Founder; Lifecycle = Subscriber/Lead |
| BB Investor Pipeline | Investor/capital relationship | Additional = Investor or Capital Provider |
| BB Partner Application | Specialist/referral partner review | Additional = Referral/Specialist Partner; Review = Manual review |
| BB Guest Pitch | Podcast/media relationship | Additional = Podcast or Media Contact; Scheduling Eligibility = Podcast guest |
| BB Sponsor | Sponsorship opportunity | Primary = Sponsor Prospect; may create Deal (Sponsorship) |
| VGP Diagnostic | Consulting lead + possible deal | Primary = Consulting Prospect; Lifecycle = SQL |
| VGP Program Inquiry | Institutional lead + possible deal | Primary = Institutional Partner |
| VGP Speaking Inquiry | Speaking lead + possible deal | Primary = Speaker or Event Organizer |

Every submission also stores the attribution fields already defined in the source system: **Site, Page, Campaign, Source, Audience, Route, Offer, Referral, Consent** — create these as contact properties (or use HubSpot's native traffic-analytics + hidden form fields) and preserve `Consent` for §5/§3.1 consent governance.

### 9.4 Shopify → HubSpot

Store: **The Brand Blueprint** — `the-brand-blueprint.myshopify.com` (Basic plan, USD, EDT).

Install HubSpot's **Shopify** app (HubSpot App Marketplace). Sync customers → Contacts, orders → Deals (or a custom "Founder Subscription/Program" object), products for context. Rules:
- Shopify customers import as Lifecycle = **Customer** (paid) or **Subscriber**, Business Unit = The Brand Blueprint, Original Source = Shopify.
- De-dupe on email against the CRM so a founder who is already a contact is enriched, not duplicated.
- Founder subscriptions/purchases remain **system-of-record in Shopify**; HubSpot holds the relationship + attribution mirror.

### 9.5 Calendly → HubSpot (scheduling governance)

Connected Calendly: **Value Growth Partners** — `calendly.com/valugrowthpartners`, tz America/New_York. Install HubSpot's **Calendly** integration so bookings create/update contacts, log the event, and stamp the meeting category. Map each **live** event type to a relationship route + scheduling-eligibility value. Full CSV: `hubspot-migration/calendly-eventtype-routing.csv`.

| Calendly event type (slug) | Active | Audience / route | Scheduling Eligibility | Relationship write / deal |
|---|---|---|---|---|
| Brand Blueprint \| Fit & Reconnect Call (`vgp-insight-session`) | ✅ | **Public owned qualification** — new founders & returning clients | Qualified prospect | Primary = Consulting Prospect (new) |
| VGP \| Active Client Strategy Session (`vgp-active-client-strategy-session`) | ✅ | **Protected** — active clients only | Active client | Client Status = Active; no new deal |
| VGP \| Partner & Institutional Introduction (`vgp-partner-contributor-intro`) | ✅ | Accelerators, capital, platform, service partners | Institutional | Primary = Institutional Partner / Investor |
| The Brand Blueprint \| Guest Interview (`the-brand-blueprint-interview-invite`) | ✅ | **Protected** — confirmed podcast guests | Podcast guest | Additional = Podcast or Media Contact |
| Build in Tulsa \| Founder Diagnostic (`bit-founder-diagnostic-2026`) | ✅ | Program (BIT 2026) | Program participant | Program Affiliation = Build in Tulsa |
| Build in Tulsa \| Executive Coaching (`bit-executive-coaching-2026`) | ✅ | Program (BIT 2026) | Program participant | Program Affiliation = Build in Tulsa |
| SEED SPOT \| Founder Office Hours (`seed-spot-open-office-hours...`) | ✅ | Program (SEED SPOT), group | Program participant | Program Affiliation = SEED SPOT |
| W.E. Build Cohort 4 \| Office Hours (`w-e-build-cohort-4-office-hours`) | ✅ | Program (W.E. Build C4) | Program participant | Program Affiliation = W.E. Build |
| Black Ambition Open Office Hours (`black-ambition-office-hours`) | ⛔ inactive | Program (Black Ambition), group | Program participant | Program Affiliation = Black Ambition |
| JumpStart \| Founder Commercialization (`jumpstart-founder-commercialization-session`) | ⛔ pilot template | Program (JumpStart), gated | Program participant | activate after eligibility confirmed |
| COECP 1:1 (`new-meeting`) | ⛔ inactive/legacy | generic | No scheduling | retire or repurpose |

**Governance rule preserved:** public networking paths lead to the owned **Fit & Reconnect** qualification link — never directly to the protected Active Client, program, guest, or institutional links. HubSpot pages/automated emails must **not** expose the protected links; keep separate scheduling actions per audience (do not collapse into one universal scheduler).

### 9.6 Popl → HubSpot

Connect Popl (native HubSpot integration or Zapier) so networking-card captures create/update contacts with Original Source = Popl, plus event/campaign attribution. Route captured contacts through the same qualification path (Fit & Reconnect), not straight to a protected scheduler. Create controlled follow-up tasks only for high-priority captures.

---

## 10. Dashboards (build after data lands)

Active client relationship health · Open consulting opportunities · Founder prospect pipeline · Institutional partnership pipeline · Investor & capital relationships · Networking contacts needing follow-up · Form conversion by source & audience · Calendly meetings by event type · Shopify subscriber & customer growth · Contacts missing classification or next action.

---

## 11. Sequenced execution checklist

- [ ] Connect HubSpot to workspace (or provide Private App token) — unblocks everything
- [ ] Create the property group + all Contact/Company/Deal properties (§3)
- [ ] Create the VGP Commercial Pipeline (§4)
- [ ] Set lifecycle governance defaults (§5)
- [ ] Export existing ~163 HubSpot contacts; reconcile vs `01_...ALL.csv` by email (§7.2–7.3)
- [ ] Import `02_...PILOT_10.csv`; validate multi-role, secondary emails, no dupes (§7.4)
- [ ] Import `04_...companies...csv`; associate (§7.5)
- [ ] Full import remaining 92 (§7.6)
- [ ] Resolve `03_exceptions_review.csv` queue (§8)
- [ ] Create priority follow-up tasks only (§7.7)
- [ ] Gmail + Calendar connect & exclusion rules (§9.1–9.2)
- [ ] Wix nine-route mapping + attribution fields (§9.3)
- [ ] Shopify app + customer/order sync (§9.4)
- [ ] Calendly integration + event-type routing (§9.5)
- [ ] Popl capture (§9.6)
- [ ] Dashboards (§10)
