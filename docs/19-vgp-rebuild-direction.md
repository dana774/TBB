# 19 — VGP Rebuild: Refreshed Direction & Build Plan (2026-08-04)

Consolidated, current direction for completing the **Value Growth Partners (VGP)** rebuild.
Supersedes nothing in docs 10–12 — it refreshes and operationalizes them now that the Brand
Blueprint side has moved to Shopify. **Live VGP site (`valugrowthpartners.com`) stays untouched.**

## 1. What VGP is
Institutional / advisory brand (distinct from the founder-facing Brand Blueprint).
**Positioning line:** *"VGP helps entrepreneurship support organizations move founders from
access to commercial readiness."*
**Homepage spine:** Intake → Diagnose → Map the Growth Path → Select the Engagement → Execute & Measure.

## 2. Audiences (homepage router — 5)
1. **Prospective advisory clients** → Advisory Pathway (qualify first)
2. **Active VGP clients** → Client Sign-In → protected resources (private scheduling only)
3. **Institutions & ESOs** → Institutional Inquiry
4. **Partners & contributors** → Partner & Contributor
5. **Brand Blueprint founders** → cross-brand route to the Shopify BB site

## 3. Site map & data bindings (all CMS data BUILT ✅)
| Page | Backing collection (records) | Notes |
|---|---|---|
| Home | Audience router + capability/insight previews | Static + previews |
| Capabilities index + 6 detail pages | `Capabilities` (6) ✅ | strategic-growth-architecture, growth-os, funding-and-forecast-readiness, retail-and-distribution, digital-growth-and-ai, operations-and-sourcing |
| Programs | `Programs` (3) ✅ | commercialization/accelerator |
| Case Studies & Outcomes | `CaseStudies` (3) ✅ | approved metrics only |
| Insights | `Insights` (3) ✅ | editorial-review |
| Speaking | `Speaking` (3) ✅ | past engagements = placeholder until Dana supplies verified list |
| About Dana | `DanaProfile` (1) ✅ | $115M/>$1B claim gated pending-proof (see doc 18) |
| Advisory Pathway | `RestrictedRoutes` (5) ✅ | qualification → approved Calendly only |
| Institutional Inquiry | Wix form `bfeb795f-543c-40a6-8c29-3712031cfc1c` ✅ | |
| Partner & Contributor | Wix form `f37ecc59-bf20-4daf-8485-8ec883f13de7` ✅ | |
| Partners (display) | `Partners` (3) ✅ | `[PLACEHOLDER]` archetypes — replace or hide at launch |
| Client resources (protected) | `ClientResources` (1) ✅ | admin-only; Members Area gating at build |
| Contact / Privacy / Terms / Accessibility | static | |

## 4. Final CTA map (from doc 10 — authoritative)
1 Nav → Start the Advisory Pathway · 2 Hero primary → Advisory Pathway · 3 Hero secondary →
Institutional Inquiry · 4 Router (prospects) → Advisory Pathway (qualify first) · 5 Router (active
clients) → Client Sign-In (private scheduling only) · 6 Router (institutions) → Institutional
Inquiry · 7 Router (partners) → Partner & Contributor · 8 Router (BB founders) → Shopify BB
(**only once an approved Shopify URL exists**; else descriptive copy, never a dead link) · 9 Each
capability page → Advisory Pathway · 10 Programs → Institutional Inquiry · 11 Speaking → Book Dana
to Speak (human review, no public Calendly) · 12 Insights → related capability + Advisory Pathway ·
13 Advisory Pathway *qualified result only* → **Schedule Your VGP Insight Session**
(`https://calendly.com/valugrowthpartners/vgp-insight-session`, 30-min fit/scoping, never "free
consultation") · 14 Advisory Pathway other results → sign-in / institutional / partner or 2-business-day human review.

## 5. Governance guards (hard rules)
- **Only** public Calendly = `calendly.com/valugrowthpartners/vgp-insight-session`, and **only**
  after qualification. No general Calendly landing page anywhere. No private/program links on-site.
- Cross-brand BB route: no live link until an approved Shopify BB URL exists; then append
  `?utm_source=vgp&utm_medium=referral&utm_campaign=cross_brand`.
- CRM/billing ownership (doc 11): Wix owns VGP advisory clients, invoices, subscriptions; never
  duplicate a recurring entitlement across Wix/Shopify. Existing clients untouched.
- One lead brand per page; the other appears only as a contextual endorsement route.
- Nothing published without Dana; live site + domain untouched; Dana is final publisher/rollback owner.
- Design: premium editorial system + tokens per doc 08 (page-level WCAG 2.2 AA, one-H1, OG/canonical/schema).

## 6. Current status — the real gap
- **Data layer: 100% built and verified** on `Vgp Staging 2026` (Studio, Draft): Capabilities 6,
  Insights 3, Case Studies 3, Programs 3, Speaking 3, Partners 3, DanaProfile 1, ClientResources 1,
  RestrictedRoutes 5, plus both forms. Calendly exposure audit PASS (doc 12).
- **Pages: not built.** That is why the site looks empty. Wix **Studio page layouts cannot be
  authored through the REST API** (unlike Shopify theme files) — they require the visual editor or a
  design import.

## 7. Build-path options (Dana chooses)
- **A — Design + import (fastest to a visible site via available tools).** Design the full VGP site
  as a premium editorial, self-contained HTML bundle (all pages/sections, using the built content +
  CTA map + governance), review it as a private Artifact, then use Wix `import-claude-design-from-url`
  to stand up a **live Wix-hosted preview site**. Note: this creates a *new* Wix site with content
  baked into the design (the existing Studio draft keeps the live CMS collections); the live VGP
  domain is untouched — it's a review preview, not a cutover.
- **B — Studio build package.** Produce a complete page-by-page build spec + copy deck bound to the
  existing CMS collections; Dana or a designer assembles it in the existing `Vgp Staging 2026` editor.
  Keeps live CMS data-binding, needs editor time.

## 8. Still needs Dana (content gates, unchanged)
Speaking past engagements (verified list) · Partner records (real partners + logo permission, or hide) ·
Insights + Capabilities editorial sign-off · Members Area install approval for protected client
resources · $115M/>$1B claim resolution (doc 18) · cross-brand BB route behavior until Shopify URL is public.
