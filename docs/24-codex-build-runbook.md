# 24 — Codex Build Runbook (how we finally build this)

The plan for executing the VGP rebuild with the Codex headless method (same as Brand Blueprint). Data,
copy, images, and governance are all prepared; this is the "press go" sequence.

## Inputs (all ready in this repo + Wix)
- **Build prompt:** `docs/20` (paste into Codex). **Authoritative overrides:** `docs/23` (v3.0
  reconciliation — nav, CTA language, Calendly exposure registry, single-ladder rule).
- **Supporting specs:** `docs/19` (direction), `docs/21` (gated Hot List), `docs/22` (image map).
- **Data source:** VGP Wix CMS — **metaSiteId `6b5d8f63-fc66-449d-8c07-2d826ef21d2d`**. Collections all
  populated (editorial-review): Capabilities (7), Programs (3 + 6 tiers + 4 sub-areas), Case Studies (3),
  Insights (3), Speaking (3), Partners (6), DanaProfile (1), FounderResourceDirectory (20), + gated
  HotListIssues/HotListFeatures (empty), ClientResources, RestrictedRoutes, forms.
- **Assets:** `assets/vgp/` (hero, Dana portrait, funding/ecosystem/members) + the logo suite.

## Build sequence
1. **Init** the Wix Managed Headless repo + a **staging** checkpoint. Do not touch either live site.
2. **Wire the data source:** Wix Headless OAuth app with **read** on the public collections; server-side
   key only for the ADMIN-only ones (ClientResources, RestrictedRoutes, HotList*). Never ship admin tokens.
3. **Paste `docs/20`** as the build prompt; apply `docs/23` as the authoritative overrides.
4. **Build the pages** (VGP): Home → Capabilities (7 incl. Growth OS) → Programs (+ one consolidated
   public ladder) → Case Studies → Insights → Speaking → About → Advisory Pathway → Institutional /
   Partner inquiries → Resources (Founder Resource Directory) → gated Investor Hot List → Contact/legal.
   Render only `status = published`; keep `editorial-review` behind `noindex` for Dana's review.
5. **Scheduling:** implement the Calendly exposure registry (doc 23 §B) — one public event after
   qualification; everything else gated/inactive. One canonical routing page, not duplicated embeds.
6. **Forms + CRM:** the 9 forms with full attribution + consent + SLA; server-side qualification for the
   founder path; write to Wix CRM.
7. **QA gates:** WCAG 2.2 AA, SEO/structured data, Core Web Vitals, and the private-link audit (grep the
   build: `calendly.com` appears only as `vgp-insight-session` in the gated view; no private route in
   source/CMS/sitemap/analytics).
8. **Deploy on Vercel** (the host). Import the Codex-generated Next.js repo into Vercel; set env vars
   `WIX_CLIENT_ID` / `WIX_META_SITE_ID` / `WIX_API_KEY` (server-side) for Preview + Production; review the
   **Preview URL** first. Add `valugrowthpartners.com` under Vercel → Domains only at go-live. **Nothing
   goes to the live domain without Dana's explicit approval.** (Full step-by-step: doc 25.)

## Split of responsibilities
- **VGP** → Wix Managed Headless (this repo/docs).
- **Brand Blueprint** → **Shopify** (already migrated; the `bb-*` images + routing/CTA/governance rules
  from doc 23 apply there too).

## Dana approval gates before any publish
Founder-intake URL + result branches · Founder Network entitlement/billing copy · the single public VGP
naming family + starting ranges · institutional/speaking/sponsor/investor/guest offer copy · case-study /
logo / corporate-experience permissions · forms/CRM/consent/SLA · private-portal timing & roles · W.E.
Build final dates · privacy/terms/accessibility + legal review · analytics/monitoring/rollback owners.
**Dana is the sole publisher and rollback owner.**

## Still-open content inputs (non-blocking for the build scaffold)
Partner logos/headshots + confirmations (6 partners) · Louise/Heloise contact to show publicly ·
real Dana portrait (optional) · Speaking past-engagements list · legal review.
