# 13 — VGP Phase 3 Studio Build Spec (Value Growth Partners institutional site)

Phase 3 is the institutional counterpart to the Brand Blueprint build. **VGP stays on Wix** (Vgp Staging 2026, `6b5d8f63-fc66-449d-8c07-2d826ef21d2d`) — the hybrid architecture from doc 08 §10. Wix Studio page composition has **no public API**, so this is the editor handoff spec, the VGP analog of doc 08. Every collection, form and route it binds to was seeded and verified in the staging-rebuild session (doc 03). **Build in Studio on Vgp Staging 2026; do not publish; do not touch the live `valugrowthpartners.com` domain.**

## 0. Relationship to the Brand Blueprint build
- **Same design tokens** as doc 08 §1 (Blueprint Blue, Navy, Deep Blue, Warm Gold, the pale/soft neutrals, Body Gray; the serif-display / sans-body pairing; 12-col 1240px grid). VGP is one ecosystem with BB, not a separate brand.
- **Different rhythm.** Institutional, calmer: more whitespace, fewer cards per row (2-up default, never 4-up), longer vertical spacing (section padding +16px over BB), more prose and fewer badges. Gold is used even more sparingly than on BB.
- **One brand leads per cross-link.** Where VGP references BB (and vice-versa) it is a single endorsement link, never dual-logo competition. Cross-domain links fire `cross_domain_route`.

## 1. Positioning and voice
- Institutional positioning line (approved, doc 08 §10): **"VGP helps entrepreneurship support organizations move founders from access to commercial readiness."**
- Audience is ESOs, accelerators, institutions, and prospective/active advisory clients — not founders directly. Founders are routed to BB.
- No invented metrics. The $115M PepsiCo figure stays **excluded** until `pepsicoClaimStatus = approved` (doc 07 §2) — same rule as BB About.

## 2. Homepage spine — the five-stage sequence
The homepage backbone is the engagement arc (doc 08 §10), built as five sections in order:
1. **Intake** — audience router hero (see §3).
2. **Diagnose** — what a VGP diagnostic assessment covers; link to `/advisory-pathway`.
3. **Map the Growth Path** — the capability areas as a path, bound to `Programs` / capability content.
4. **Select the Engagement** — engagement models (advisory, institutional program, speaking); links to `/institutional-inquiry` and `/advisory-pathway`.
5. **Execute and Measure** — outcomes/case-study preview bound to `CaseStudies`; institutional positioning line as the closing band.
Plus: nav (persistent "Start the Advisory Pathway"), Insights preview (bound to `Insights`), a single BB cross-brand endorsement band, newsletter, footer with Privacy/Terms/Accessibility.

## 3. Audience router hero (5 audiences) — doc 02 VGP CTA map
One-screen router; each choice fires `route_select`:
| Audience | Label | Destination |
|---|---|---|
| Prospective clients | Start the Advisory Pathway | `/advisory-pathway` |
| Active clients | Client sign-in | `/members/sign-in` (private scheduling delivered by direct comms only — never on-site) |
| Institutions & ESOs | Submit an Institutional Inquiry | `/institutional-inquiry` (fires `institutional_inquiry_submit` on submit) |
| Partners | Partner & Contributor | `/partner-contributor` |
| Brand Blueprint founders | The Brand Blueprint ecosystem | BB staging home (cross-domain; fires `cross_domain_route`) |

## 4. Page & template map (bind to existing collections — doc 03)
| Route | Source collection | Notes |
|---|---|---|
| `/` | Insights, Programs, CaseStudies (previews) | Homepage spine §2 |
| `/advisory-pathway` | RestrictedRoutes (server-side, like BB intake) | Intake → Diagnose → Map → Select → Execute; qualified result → the single approved `vgp-insight-session` Calendly. See §5. |
| `/institutional-inquiry` | Wix form → CRM `custom.institutional-inquiry` | Institutional/ESO intake; human review |
| `/partner-contributor` | Wix form → CRM `custom.partner-contributor` | Partner intake |
| `/capabilities` + `/capabilities/{slug}` | **Capabilities** (verified 6 items) | Capability/service pages; final slugs feed doc 04 redirect matrix |
| member area (protected) | **ClientResources** (ADMIN read) | Signed-in members only; never public |
| `/programs` + `/programs/{slug}` | Programs (dynamic) | Institutional programs |
| `/case-studies` + `/case-studies/{slug}` | CaseStudies (dynamic) | Approved records only |
| `/insights` + `/insights/{slug}` | Insights (dynamic) | Editorial/thought-leadership |
| `/speaking` | Speaking + inquiry form | "Book Dana to speak" → inquiry form, human review, **no public Calendly** |
| `/members/sign-in` | Wix Members | Active-client area; private scheduling links delivered by direct comms only |
| `/about` | DanaProfile (shared narrative) | Institutional framing; PepsiCo claim gated |
| Privacy / Terms / Accessibility | — | Same legal set as BB |

## 5. `/advisory-pathway` qualification (mirror of BB intake, doc 08 §5)
- Server-backed evaluation (Velo `.jsw`, never client-only) so restricted route URLs stay unqueryable — this is why VGP keeps the server-side rule that BB's Shopify build could relax.
- Only a qualified prospective client reaches **"Schedule Your VGP Insight Session"** → the single approved `https://calendly.com/valugrowthpartners/vgp-insight-session` (same event as BB CTA #20). All other results render pathway links / two-business-day acknowledgement. **Never** the general Calendly page; **never** a private active-client or program (Build in Tulsa / W.E. Build / JumpStart) scheduling URL — anywhere, including source, CMS, sitemaps, metadata, analytics.

## 6. Placeholder honesty (doc 07 §6–7)
- **Speaking** past-engagement records are `[PLACEHOLDER]` — show only verified engagements, or hide the section at launch.
- **Partners** records are `[PLACEHOLDER]` archetypes — replace with real approved partners + logo permissions, or hide.
- Case studies render only approved records; keep the BB-side `CaseStudies`/`Programs`/`Speaking` collections empty (they are VGP page types, doc 03).

## 7. SEO / accessibility / analytics
- Same gate as doc 08 §9: one H1, unique title/description, canonical, OG; schema Organization + Person (Dana) sitewide, Article on Insights, plus BreadcrumbList on dynamic pages; WCAG 2.2 AA (no gold-on-white text); keyboard nav + visible focus; reduced-motion; responsive images.
- Analytics events reuse the doc 08 §8 scheme: `route_select`, `institutional_inquiry_submit`, `partner_intro_click`/`submit`, `cross_domain_route`, `advisory_pathway_start/submit`, `vgp_insight_session_click` (qualified result only). **No analytics on any private client or sponsored-program scheduling.**

## 8. Acceptance tests (Phase 3)
1. Homepage renders the five-stage spine in order; audience router offers exactly the 5 audiences with the doc 02 destinations.
2. `/advisory-pathway` qualifies server-side; only the qualified branch exposes `vgp-insight-session`; no restricted URL is client-queryable.
3. Repo/site-wide search: zero occurrences of private client scheduling URLs or Build in Tulsa / W.E. Build / JumpStart scheduling URLs in source, CMS, sitemap, metadata, or analytics.
4. Capability/program/case-study/insight dynamic pages bind to the seeded collections and render only approved records; placeholders hidden.
5. Design tokens match BB exactly; VGP rhythm is visibly calmer (2-up max, more whitespace).
6. Responsive 390/768/1024/1440; WCAG 2.2 AA; SEO/schema per §7.
7. Nothing published; live domain untouched; DanaProfile PepsiCo claim absent unless approved.

## 9. What is API-ready vs editor-only
- **Already in place via API (doc 03):** all VGP collections (Insights, CaseStudies, Programs, Partners, Speaking), RestrictedRoutes (private URLs deliberately not stored), FormSubmissions sink, CRM label scheme.
- **Editor-only (this spec):** Studio page composition, section layout, theme styles, the `/advisory-pathway` Velo backend, form embeds, redirect activation (doc 04, at cutover only).
- **Blocking inputs from Dana:** verified Speaking engagements; real Partner records + logo permissions; PepsiCo proof; final capability slugs (feed doc 04); approval to build the qualification Velo backend.
