# 22 — Handoff prompts: website + Shopify agents ↔ HubSpot alignment

Context: VGP is moving off Wix to a new front-end host. That host will wire intake forms + CMS
contact capture **directly to HubSpot** (not Wix). Payments/invoicing move to the **Shopify**
"The Brand Blueprint" store. This doc (a) records the updated system ownership and (b) contains two
copy-paste prompts to align the website-build agent and the Shopify agent with the HubSpot setup
defined in `docs/21-hubspot-crm-structure-and-integration-runbook.md` and `hubspot-migration/`.

## Shared HubSpot facts (both agents need these)

- HubSpot portal / account ID: **246956537**
- Region / API host: **na2** → UI `app-na2.hubspot.com`, API `https://api.hubapi.com`
- Owner: Dana Ammons, `dana@valugrowthpartners.com`
- Contact de-dupe key: **email** (HubSpot forms + API upsert on email automatically)
- Relationship taxonomy + property internal names: `hubspot-migration/field-map.csv`
- Form-route → outcome map: runbook §9.3; Calendly routing: `hubspot-migration/calendly-eventtype-routing.csv`

## Updated system ownership

| Function | System of record | Notes |
|---|---|---|
| People + relationship history | **HubSpot** | one contact per person, multi-role via taxonomy |
| Companies / institutional relationships | **HubSpot** | |
| Commercial **pipeline** (qualification → forecast) | **HubSpot Deals** | no payment processing in HubSpot |
| Intake forms + attribution | **New VGP host → HubSpot** (direct) | was Wix; now direct API/native forms |
| CMS / founder + ecosystem content | New VGP host (+ Brand Blueprint Shopify content) | content stays on the front ends |
| **Payments, invoicing, receipts** | **Shopify (Brand Blueprint)** | productized checkout + invoices |
| Subscriptions / paid programs | **Shopify** | mirror to HubSpot as relationship + deal |
| Scheduling | Calendly (governed by audience/eligibility) | synced to HubSpot |
| Email + meetings | Gmail + Google Calendar | logged to HubSpot |
| Files / client docs | Google Drive | |

### Money boundary (important)

- **Self-serve / productized** offers (founder subscriptions, Brand Blueprint paid access, workshop
  tickets, sponsorship packages, program fees) → **Shopify checkout**. Shopify issues the invoice/receipt.
- **Bespoke** engagements (advisory, retainer, institutional, scoped projects) → tracked as a
  **HubSpot Deal** through the pipeline; on **Closed Won**, the invoice is issued in **Shopify**
  (draft order / invoice) and the Shopify order is associated back to the HubSpot deal/contact.
- HubSpot never processes payment. Shopify never owns the relationship record.

---

## PROMPT A — for the website-build agent (VGP new front-end host)

> Paste everything in this block to the agent building the new VGP site.

You are building the new Value Growth Partners front-end (migrating off Wix). All lead capture,
intake, and contact data must flow **directly into HubSpot** — do not persist contacts in the host's
own database as the source of truth, and do not route through Wix. HubSpot is the system of record
for people, companies, attribution, qualification, and the commercial pipeline. Payments/invoicing
are handled by a separate Shopify store, not by you.

### HubSpot target
- Portal/account ID: **246956537**, region **na2** (API base `https://api.hubapi.com`, forms
  region `na2`). Install the **HubSpot tracking code** on every page of the new site so all sessions
  are attributed to this portal.
- Integration method — pick the one native to the host:
  1. If the host has a first-party HubSpot integration (e.g. Webflow) → use HubSpot native forms/embed.
  2. Otherwise → POST submissions to the **HubSpot Forms API** (`/submissions/v3/integration/submit/246956537/{formGuid}`) or the **CRM API** (`/crm/v3/objects/contacts` upsert by email) using a server-side call with a private-app token (never expose the token client-side).
- **De-dupe on email.** Every submission upserts by email — create-or-update, never blind-create.
  Never invent placeholder emails (no `…@crm.wix.com`-style values); if a form has no email, do not
  create a contact.

### The nine intake routes — set these HubSpot contact properties on submit
Use these **exact internal names** (from `hubspot-migration/field-map.csv`). Multi-checkbox values are
semicolon-delimited.

| Form / route | `vgp_primary_relationship_type` | `vgp_business_unit` | `vgp_scheduling_eligibility` | lifecycle (`lifecyclestage`) | also set |
|---|---|---|---|---|---|
| BB Start Here | Founder | The Brand Blueprint | Qualified prospect | lead | `vgp_program_affiliation` if named |
| BB Founder Network | Founder *(as Additional)* | The Brand Blueprint | Public intake only | subscriber | — |
| BB Investor Pipeline | Investor or Capital Provider | The Brand Blueprint | Institutional | lead | — |
| BB Partner Application | Referral Partner | The Brand Blueprint | Institutional | lead | `vgp_data_review_status=Manual review` |
| BB Guest Pitch | Podcast or Media Contact | Podcast | Podcast guest | lead | — |
| BB Sponsor | Sponsor Prospect | The Brand Blueprint | Institutional | lead | create Deal type Sponsorship (see below) |
| VGP Diagnostic | Consulting Prospect | Value Growth Partners | Qualified prospect | salesqualifiedlead | may create Deal (VGP Advisory) |
| VGP Program Inquiry | Institutional Partner | Value Growth Partners | Institutional | lead | may create Deal (Institutional Program) |
| VGP Speaking Inquiry | Speaker or Event Organizer | Speaking and Media | Qualified prospect | lead | may create Deal (Workshop or Speaking) |

For any commercial route that may become a deal, do **not** auto-create the deal on submit; set the
contact properties and let HubSpot qualification decide. (Sponsor/Diagnostic/Program/Speaking are the
only deal-eligible routes.)

### Attribution — write on EVERY submission
Create/populate these HubSpot contact properties (create them if missing; string type unless noted):
`vgp_attr_site`, `vgp_attr_page`, `vgp_attr_campaign`, `vgp_attr_source`, `vgp_attr_audience`,
`vgp_attr_route`, `vgp_attr_offer`, `vgp_attr_referral`, and consent → `vgp_consent_status`
(values: `Explicit opt-in` / `Implied (existing relationship)` / `Unknown` / `Do not market`).
Also set `vgp_original_relationship_source = Website` on first touch and
`vgp_latest_relationship_source = Website` on every touch. Capture UTM params into the campaign/source
fields and the referring URL into `vgp_attr_referral`.

### Scheduling governance (do not violate)
- Public pages and post-submit screens link only to the **owned qualification** scheduler:
  **Brand Blueprint | Fit & Reconnect Call** (`calendly.com/valugrowthpartners/vgp-insight-session`).
- **Never** expose these protected links publicly or in automated pages/emails: Active Client
  Strategy Session, program links (Build in Tulsa, SEED SPOT, W.E. Build, Black Ambition, JumpStart),
  the podcast Guest Interview link, or the Partner/Institutional intro link. Those are sent manually
  to qualified/approved people only. Full map: `hubspot-migration/calendly-eventtype-routing.csv`.

### Payments
You do **not** build checkout, payment, or invoicing. Any "buy / subscribe / pay / register-paid"
CTA must link out to the **Shopify (Brand Blueprint)** store (the Shopify agent owns those product
URLs). Pass `utm_source`/`utm_campaign` on those outbound links so Shopify → HubSpot attribution ties
back to the originating VGP page.

### Acceptance criteria
- A test submission on each of the 9 forms creates/updates exactly one HubSpot contact (no dupes),
  with the correct `vgp_primary_relationship_type`, `vgp_business_unit`, `vgp_scheduling_eligibility`,
  lifecycle, and the full attribution set populated.
- HubSpot tracking code fires on all pages; the contact's original/latest source = Website.
- No placeholder emails created; no protected Calendly links exposed.
- All paid CTAs point to Shopify with UTMs attached.

---

## PROMPT B — for the Shopify agent (The Brand Blueprint store)

> Paste everything in this block to the agent managing the Shopify store.

The Shopify "The Brand Blueprint" store (`the-brand-blueprint.myshopify.com`, Basic plan) is becoming
the **payments, invoicing, and subscription system of record** for the VGP + Brand Blueprint
ecosystem. HubSpot (portal **246956537**, region na2) remains the system of record for people,
companies, relationships, and the commercial pipeline. Your job: run commerce, and sync commerce data
into HubSpot cleanly — never duplicate or overwrite the relationship record.

### Connect Shopify ↔ HubSpot
- Install the official **HubSpot ⇄ Shopify** integration and connect it to portal **246956537**.
- Sync: **customers → HubSpot contacts** (upsert by email — never create a duplicate for someone who
  already exists as a CRM contact), **orders → HubSpot deals** (or the ecosystem's order-sync object),
  **products** for context. Enable HubSpot's Shopify tracking so checkout sessions attribute to the
  portal.

### Product / offer structure → HubSpot mapping
Productize these as Shopify products/collections; each maps to a HubSpot deal `vgp_opportunity_type`:

| Shopify offer (checkout) | HubSpot `vgp_opportunity_type` | HubSpot `vgp_business_unit` |
|---|---|---|
| Founder subscription / paid program | Founder Program | The Brand Blueprint |
| Brand Blueprint paid partnership / membership | Brand Blueprint Partnership | The Brand Blueprint |
| Workshop / event ticket | Workshop or Speaking | Speaking and Media |
| Sponsorship package | Sponsorship | The Brand Blueprint |
| Productized advisory (fixed-scope) | VGP Advisory | Value Growth Partners |

For **bespoke** engagements (custom advisory, retainer, institutional, scoped projects), HubSpot owns
the pipeline; when the HubSpot deal reaches **Closed Won**, generate the invoice here (Shopify draft
order / invoice) and associate the resulting Shopify order back to the HubSpot contact/deal. Do not
create pipeline deals for bespoke work yourself — only issue the invoice on request.

### Contact / consent hygiene
- On customer creation, set (via the HubSpot sync/mapping) `vgp_original_relationship_source = Shopify`
  (first touch) and `vgp_latest_relationship_source = Shopify`; set `vgp_business_unit = The Brand Blueprint`.
- Map Shopify marketing consent → HubSpot `vgp_consent_status` (`Explicit opt-in` when the customer
  opted in at checkout; otherwise `Implied (existing relationship)`).
- A Shopify customer who buys is Lifecycle = **Customer**; a newsletter-only signup is **Subscriber**.
  Do not downgrade an existing HubSpot Customer/relationship because of a Shopify record.

### Attribution
Preserve incoming UTMs from the VGP site on checkout and pass `source`/`campaign` into the HubSpot
contact's `vgp_attr_source` / `vgp_attr_campaign` so a purchase ties back to the originating page.

### Boundaries (do not cross)
- Shopify processes all payments/invoices; HubSpot never does.
- Shopify never becomes the relationship system of record — always upsert into the existing HubSpot
  contact by email; flag conflicts rather than overwrite.
- Do not expose Calendly scheduling links from Shopify pages; scheduling lives on the VGP site /
  HubSpot per the governance in `calendly-eventtype-routing.csv`.

### Acceptance criteria
- A test purchase creates/updates one HubSpot contact (no dupe), lifecycle = Customer, business unit =
  The Brand Blueprint, source = Shopify, consent mapped, and an associated deal/order with the right
  `vgp_opportunity_type`.
- A Closed-Won HubSpot deal can be invoiced in Shopify and the order associates back to the contact/deal.
- Existing CRM relationships are enriched, never overwritten or duplicated.
