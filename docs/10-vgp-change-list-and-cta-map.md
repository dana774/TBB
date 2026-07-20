# 10 — VGP Change List and Final CTA Map (hybrid architecture)

## Updated VGP page-by-page change list (session 2026-07-20, post-handoff)

### CMS / data layer (done via API on Vgp Staging 2026)
| Page / system | Backing data | State |
|---|---|---|
| Home | Audience router (5 audiences) + capability/insight previews | Data ready; Studio build per doc 08 §10 pattern |
| Capabilities (index) | **Capabilities** collection — NEW, 6 records seeded | ✅ Created this session |
| Strategic Growth Architecture | `strategic-growth-architecture` | ✅ Seeded |
| Growth OS | `growth-os` | ✅ Seeded |
| Funding and Forecast Readiness | `funding-and-forecast-readiness` | ✅ Seeded |
| Retail and Distribution | `retail-and-distribution` | ✅ Seeded |
| Digital Growth and AI | `digital-growth-and-ai` | ✅ Seeded |
| Operations and Sourcing | `operations-and-sourcing` | ✅ Seeded |
| Programs / commercialization | Programs collection (3 records, pre-existing) | ✅ |
| Institutional Inquiry | Wix form `bfeb795f-543c-40a6-8c29-3712031cfc1c` | ✅ |
| Partner and Contributor | Wix form `f37ecc59-bf20-4daf-8485-8ec883f13de7` | ✅ |
| Speaking | Speaking collection (3 records; engagements placeholder) | ✅ |
| Case Studies and Outcomes | CaseStudies (3 records) | ✅ |
| Insights | Insights (3 full articles) | ✅ |
| About Dana | **DanaProfile** — NEW on VGP, mirrored from BB for consistent official identity | ✅ Created this session ($115M claim held pending proof) |
| Advisory Pathway | RestrictedRoutes qualification records + insight-session route | ✅ |
| Contact | Forms + CRM labels | ✅ |
| Privacy / Terms / Accessibility | Static copy — Studio build | Pending editor |
| Protected active-client resources | **ClientResources** — NEW, admin-only; page gating via Members Area in editor | ✅ Collection created; no client materials yet |
| Cross-brand founder route | RestrictedRoutes record `brand-blueprint-founder-route` (admin-only) | ✅ Uses `{{SHOPIFY_BRAND_BLUEPRINT_URL}}` in internal notes ONLY |

### Clarifications honored
- VGP is not the founder-membership checkout; no membership/checkout objects created.
- No placeholder route published anywhere public; the Shopify placeholder token exists only in an admin-read record and this repo.
- No new public VGP property created; all work on the existing Vgp Staging 2026 site.

## Final VGP CTA map

| # | Location | CTA | Destination | Guard |
|---|---|---|---|---|
| 1 | Nav (persistent) | Start the Advisory Pathway | `/advisory-pathway` | |
| 2 | Hero primary | Start the Advisory Pathway | `/advisory-pathway` | |
| 3 | Hero secondary | Institutional Programs | `/institutional-inquiry` | |
| 4 | Router — Prospective advisory clients | Start the Advisory Pathway | `/advisory-pathway` | Qualification before any scheduling |
| 5 | Router — Active VGP clients | Client Sign-In | `/members/sign-in` → protected resources | Private scheduling only via direct communication |
| 6 | Router — Institutions & ESOs | Submit an Institutional Inquiry | `/institutional-inquiry` | `institutional_inquiry_submit` |
| 7 | Router — Partners & contributors | Partner & Contributor | `/partner-contributor` | `partner_intro_click` |
| 8 | Router — Brand Blueprint founders | Enter The Brand Blueprint / Complete the Founder Intake | `{{SHOPIFY_BRAND_BLUEPRINT_URL}}` — **internal doc only; do not build/publish this link until an approved Shopify URL exists** | `cross_domain_route` + UTM |
| 9 | Each capability page | Start the Advisory Pathway | `/advisory-pathway` | |
| 10 | Programs | Institutional Inquiry | `/institutional-inquiry` | |
| 11 | Speaking | Book Dana to Speak | Speaking inquiry (human review) | No public Calendly |
| 12 | Insights articles | Related capability + Advisory Pathway | contextual | |
| 13 | Advisory Pathway — qualified result only | Schedule Your VGP Insight Session | `https://calendly.com/valugrowthpartners/vgp-insight-session` | Post-qualification only; 30-minute fit/pathway/scoping conversation; never "free consultation" |
| 14 | Advisory Pathway — other results | Sign-in / institutional / partner routes or 2-business-day human review | contextual | No Calendly |

Homepage sequence spine: **Intake → Diagnose → Map the Growth Path → Select the Engagement → Execute and Measure.**
Institutional positioning line: *"VGP helps entrepreneurship support organizations move founders from access to commercial readiness."*

## Cross-domain route specification
- Until Shopify approval: the BB-founder route renders as descriptive copy without an active link, or the section is withheld — Dana's choice at page build. Never a dead/placeholder link.
- After approval: replace `{{SHOPIFY_BRAND_BLUEPRINT_URL}}` in the RestrictedRoutes record and page link; append `?utm_source=vgp&utm_medium=referral&utm_campaign=cross_brand&utm_content=<section>`.
- Reverse route (Shopify BB → VGP): `https://www.valugrowthpartners.com/advisory-pathway?utm_source=brandblueprint&utm_medium=referral&utm_campaign=cross_brand`.
- GA4 cross-domain measurement configured only when the Shopify domain is approved; exclude both domains from each other's referral lists to prevent self-referrals.
- One lead brand per page; the other appears as a contextual endorsement route only.
