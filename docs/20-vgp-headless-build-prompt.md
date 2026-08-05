# 20 — VGP Website Build Prompt (Wix Headless / Codex)

**Paste this whole document into the headless build pipeline** (same method used for the Brand
Blueprint site). It is self-contained: tech target, data source, design system, page-by-page specs,
exact CMS field keys, routing, governance guardrails, and acceptance criteria.

---

## 0. Role & goal
You are building the **Value Growth Partners (VGP)** marketing website — the institutional / advisory
brand (distinct from the founder-facing Brand Blueprint). Build a fast, accessible, premium-editorial
site whose content is read at build/runtime from the **existing Wix CMS** on the VGP staging site.
Do **not** invent copy where a CMS field exists — render the field. Where a field is empty or a record
is not approved, follow the placeholder/gate rules in §9.

## 1. Tech target & data source
- **Method:** Wix Headless. Front end in code (the same stack used for the Brand Blueprint build);
  Wix is the data/back end. SSR/SSG with per-collection revalidation.
- **Wix site (data source):** `Vgp Staging 2026` — **metaSiteId `6b5d8f63-fc66-449d-8c07-2d826ef21d2d`**
  (Studio, Velo enabled). Read content via the Wix Headless SDK / Wix Data (`@wix/sdk`, `@wix/data`).
- **Auth:** use a Wix Headless OAuth app (Client ID) with **read** access to the public collections;
  server-side API key only for admin-gated reads (never ship admin tokens to the client).
- **Publicly readable collections:** `Capabilities`, `CaseStudies`, `DanaProfile`, `Insights`,
  `Partners`, `Programs`, `Speaking`.
- **Admin-only (server-side only, never client-exposed):** `ClientResources`, `RestrictedRoutes`,
  `FormSubmissions`.
- **Render filter (all public collections):** only render items whose `status` indicates approved/
  published (`published` / `approved` / `live`). Treat `editorial-review`, `Draft`, empty, or
  `[PLACEHOLDER]` as **not for public render** (see §9).
- **Forms:** submit to the existing Wix Forms —
  Institutional Inquiry `bfeb795f-543c-40a6-8c29-3712031cfc1c`,
  Partner & Contributor `f37ecc59-bf20-4daf-8485-8ec883f13de7`
  (use the Wix Forms submit API, or post to a Velo `.jsw` backend that writes to `FormSubmissions`
  and applies the CRM label — never store full responses client-side).

## 2. Design system (institutional variant of the Brand Blueprint system)
Same tokens as BB, **calmer rhythm**: more whitespace, fewer cards per row, restrained accents.

**Color** — Blueprint Blue `#3978D7` (primary CTA/links), Navy `#071E41` (display headings, footer),
Deep Blue `#0B2D57` (hover/secondary surface), Warm Gold `#C89B2C` (eyebrows only, max one accent per
view), Pale Blue `#EFF5FF` + Soft Gray-Blue `#F5F8FC` (section tints), Body Gray `#4B5563` (body),
White dominant. **Never gold text on white** (contrast).

**Type** — Editorial serif for H1–H3 (Playfair Display / Tiempos-class): H1 desktop 64–76px/1.05,
H2 40–48px, H3 28–32px, Navy. Sans (Inter/Söhne-class) for nav/body/labels/forms: body 17–20px/1.6;
uppercase eyebrow labels 13–14px +5% letter-spacing. Scale −15% at 1024; H1 36–40px at 390.

**Layout** — 12-col grid, max content 1240px, gutters 24px. Section padding 96–120 desktop / 64–80
tablet / 48–56 mobile. Breakpoints 1440 / 1024 / 390.

**Components** — Buttons: square/4px radius; primary = Blueprint Blue fill/white, hover Deep Blue,
focus 2px offset Blueprint Blue outline; secondary = 1px Navy outline/Navy text, hover Pale Blue.
Cards: white, 1px `#E5EAF2` border, hover-only subtle shadow, no gradients, no over-rounded corners.
Motion: fade/rise ≤200ms; honor `prefers-reduced-motion`.

## 3. Global chrome
- **Nav** (white, sticky): VGP wordmark left; links — Capabilities, Programs, Case Studies, Insights,
  Speaking, About; persistent primary button **"Start the Advisory Pathway"** → `/advisory-pathway`.
- **Footer** (Navy): sitemap, contact, Privacy / Terms / Accessibility, one-line positioning, ©.
- **SEO defaults** (per page, §8 gate): one H1, unique title + meta description, canonical, OG,
  JSON-LD `Organization` + `Person` (Dana) sitewide.
- **Analytics** (GTM/custom events, no analytics on private scheduling): `route_select`,
  `advisory_pathway_start`, `vgp_insight_session_click` (qualified button only),
  `institutional_inquiry_submit`, `partner_intro_click`, `speaking_inquiry_submit`,
  `cross_domain_route`, `assisted_conversion`.

## 4. Pages & routes

### `/` Home
Homepage spine: **Intake → Diagnose → Map the Growth Path → Select the Engagement → Execute & Measure.**
1. **Hero** (split, calm): gold eyebrow "STRATEGIC GROWTH ADVISORY"; serif H1 (institutional, e.g.
   "Move founders from access to commercial readiness."); 1–2 sentence subhead; primary **Start the
   Advisory Pathway** → `/advisory-pathway`; secondary **Institutional Programs** → `/institutional-inquiry`.
2. **Audience router (5 cards)** — Prospective advisory clients → `/advisory-pathway`; Active VGP
   clients → `/client-sign-in`; Institutions & ESOs → `/institutional-inquiry`; Partners &
   contributors → `/partner-contributor`; Brand Blueprint founders → cross-brand route (§7 — copy
   only, no live link until Shopify URL approved).
3. **Capabilities preview** — 6 from `Capabilities` (`title`, `summary`, `promise`) → `/capabilities/{slug}`.
4. **The VGP method** — the 5-step spine as a numbered editorial row.
5. **Proof / outcomes** — from `CaseStudies` (approved only): `client` or `anonymousLabel`,
   `engagementType`, `outcomes`; link `/case-studies`.
6. **Insights preview** — 3 from `Insights` (`title`, `summary`, `category`) → `/insights/{slug}`.
7. **About Dana strip** — from `DanaProfile` (`profileName`, `role`, short bio) → `/about`.
8. **Institutional band** (Navy): positioning line *"VGP helps entrepreneurship support organizations
   move founders from access to commercial readiness."* → `/institutional-inquiry`.
9. **Final CTA** — Start the Advisory Pathway.
**Never link Calendly from the homepage.**

### `/capabilities` (index) + `/capabilities/{slug}` (dynamic on `Capabilities`, 6 records)
Index: editorial list of 6 (`title`, `summary`, `whoItsFor`). Detail: H1 `title`; `promise`; `whoItsFor`;
`approach` (rich text); `outcomes` (rich text); related program (`relatedProgramSlug`→`Programs`),
related insight (`relatedInsightSlug`→`Insights`); CTA **Start the Advisory Pathway** → `/advisory-pathway`.
Slugs: `strategic-growth-architecture`, `growth-os`, `funding-and-forecast-readiness`,
`retail-and-distribution`, `digital-growth-and-ai`, `operations-and-sourcing`.

### `/programs` (dynamic on `Programs`, 3)
`title`, `programType`, `audience`, `modules`, `outcomes`, `format`, `duration`, `institution`,
`offerStatus`. CTA → `/institutional-inquiry`.

### `/case-studies` + `/case-studies/{slug}` (dynamic on `CaseStudies`, 3)
Render approved only. `client` **or** `anonymousLabel` (use anonymousLabel when consent not cleared),
`engagementType`, `challenge`, `strategy`, `work`, `outcomes`, `evidence`, `pullQuote`,
`relatedCapability`. Only show metrics/evidence when `proofPermissionRef` present.

### `/insights` + `/insights/{slug}` (dynamic on `Insights`, 3)
`title`, `category`, `summary`, `body`, `pullQuote`, `relatedCapability`. CTA: related capability +
Advisory Pathway.

### `/speaking` (dynamic on `Speaking`, 3)
`title`/`topic`, `audienceType`, `promise`, `outcomes`, `format`. `pastEngagements` — render **only**
if populated with a verified list; otherwise omit the section (do not fabricate). CTA **Book Dana to
Speak** → speaking inquiry (human review). **No public Calendly.**

### `/about` (on `DanaProfile`)
`profileName`, `role`, `portrait`, `executiveBio`, `operatingPhilosophy`, `ecosystemRoles`,
`experienceTimeline`, `speakingCredibility`. **Account-figure gate:** render `pepsicoClaim` **only if
`pepsicoClaimStatus` == `approved`**. It is currently NOT approved (documents substantiate ≈$265M, not
">$1B" — see doc 18), so display the defensible line instead: *"Led national retail accounts for P&G,
PepsiCo, Colgate-Palmolive and S.C. Johnson — including Walmart and Sam's Club."* Pathway links to BB
(§7) and VGP advisory.

### `/advisory-pathway` (qualification → scheduling gate)
Short qualification (server-evaluated, mirror BB pattern): collect audience/role/goal, evaluate in a
Velo `.jsw` backend, look up `RestrictedRoutes` by `audience`/`routeType`, and return the outcome.
- **Qualified result only:** reveal button **"Schedule Your VGP Insight Session"** →
  `https://calendly.com/valugrowthpartners/vgp-insight-session`. Copy: *"a 30-minute fit, pathway and
  scoping conversation."* **Never** "free consultation".
- **All other results:** sign-in / institutional / partner routes, or a two-business-day human-review
  acknowledgement. **No Calendly.** Return a `RestrictedRoutes.routeUrl` to the client **only** for
  routes explicitly marked public; otherwise return message text only.

### `/institutional-inquiry` and `/partner-contributor`
Intro copy + embed the corresponding Wix form (§1). On submit: label the contact, show a clear
"what happens next" acknowledgement. No scheduling links.

### `/client-sign-in` → protected client resources
Gated area (Wix Members Area / headless member auth). Behind auth, list `ClientResources`
(`title`, `resourceType`, `fileUrl`, `accessNotes`) filtered to the signed-in client (`clientRef`).
Active clients schedule **only** via their existing private channel — **no scheduling UI here.**

### `/contact`, `/privacy`, `/terms`, `/accessibility`
Static. Contact routes to the correct form; no Calendly.

## 5. CTA map (authoritative — doc 10 / doc 19)
Nav & hero → Advisory Pathway; hero secondary + Programs → Institutional Inquiry; router → the five
destinations; every capability → Advisory Pathway; Speaking → human-review inquiry; Insights → related
capability + Advisory Pathway; **Advisory Pathway qualified → vgp-insight-session Calendly (only here,
only post-qualification)**; other results → routes / human review.

## 6. Governance — HARD RULES (do not violate)
1. **Only** public Calendly = `https://calendly.com/valugrowthpartners/vgp-insight-session`, and **only**
   on a qualified Advisory-Pathway result. No general Calendly landing page anywhere. No other
   scheduling/program/private links rendered anywhere.
2. **Cross-brand BB route:** the Shopify Brand Blueprint store is currently password-protected / no
   approved public URL. Render the BB founder route as **descriptive copy with no live link** until an
   approved URL exists. Never output a dead or placeholder link. Once approved, link with
   `?utm_source=vgp&utm_medium=referral&utm_campaign=cross_brand&utm_content=<section>`.
3. **CRM/billing (doc 11):** Wix owns VGP advisory clients, invoices, subscriptions. Do not build any
   checkout, membership, or recurring-billing UI on VGP. Never duplicate a recurring entitlement across
   Wix and Shopify.
4. **Privacy:** never expose `ClientResources`, `RestrictedRoutes`, `FormSubmissions`, or full form
   responses to the client bundle. Transfer routing outcome + label only, not raw answers.
5. **Identity:** one lead brand per page (VGP); BB appears only as a contextual endorsement route.
6. **Nothing goes to the live `valugrowthpartners.com` domain without Dana's explicit go-ahead.** Build
   to a preview/staging deployment; Dana is final publisher and rollback owner.

## 7. Cross-brand handoff
Reverse route (from BB → VGP) target: `https://www.valugrowthpartners.com/advisory-pathway?utm_source=
brandblueprint&utm_medium=referral&utm_campaign=cross_brand`. Exclude both domains from each other's
GA4 referral lists once cross-domain measurement is enabled.

## 8. Accessibility / SEO / performance gate (every page)
One descriptive H1; unique title + meta description; canonical; OG; JSON-LD (`Organization` + `Person`
sitewide, `Article` on insights, `Service`/`Offer` optional on capabilities, `BreadcrumbList` on
dynamic pages). WCAG 2.2 AA contrast (Body Gray on white passes; never gold text on white). Full
keyboard nav + visible focus; labeled forms with inline errors; captions/alt text on media;
`prefers-reduced-motion`. Performance: LCP < 2.5s on 4G, responsive images with focal points,
lazy-load below the fold.

## 9. Content gates & placeholders (pending Dana — do not fabricate)
- **Speaking `pastEngagements`** — omit the section until a verified list is supplied.
- **Partners** — 6 real partners are seeded, each `editorial-review` pending confirmation + assets:
  **ArkLaTex Financial Consultants** (Referral — Financing & Lending), **Heloise Lanoix** (Creative &
  Digital), **Sengo** (Capital Intelligence Platform), **Nudge** (Commerce Intelligence Platform),
  **Kaylee McFerson** (Paid Media & Digital), **Patrice Malloy / The Affluent CFO** (Referral —
  Financial & Tax Strategy). Render a partner **only** once `status` is `published`.
  Always hide the 3 `[PLACEHOLDER]` archetypes. Until a logo is present, render a clean
  name/type/description card (no broken image). **Do not** surface any Sengo/Nudge internal tier or
  pricing detail — those live only in the internal integration framework, not on the public page. The
  ~20-vendor `partner_shortlist` spreadsheet is a research/prospect list, NOT partner-page content.
- **Insights (3) & Capabilities (6)** — currently `editorial-review`; render on the preview build for
  Dana's sign-off, but keep `noindex` until status flips to approved.
- **DanaProfile account figure** — gated per §`/about`.
- **Case-study client names/metrics** — use `anonymousLabel` and hide metrics unless permission ref present.

## 10. Field reference (exact keys; `MEDIA_IMAGE` → resolve Wix media to URL)
- **Capabilities:** title, slug, status, summary, promise, whoItsFor, approach(rich), outcomes(rich),
  relatedProgramSlug, relatedInsightSlug, relatedRoute, heroImage, imageAltText, seoTitle, seoDescription.
- **Programs:** title, slug, status, programType, audience, modules, outcomes, format, duration,
  institution, offerStatus, pullQuote, heroImage, seoTitle, seoDescription.
- **CaseStudies:** title, slug, status, client, anonymousLabel, engagementType, challenge, strategy,
  work, outcomes, evidence, proofPermissionRef, pullQuote, relatedCapability, heroImage, gallery.
- **Insights:** title, slug, status, category, summary, body, pullQuote, relatedCapability, heroImage,
  seoTitle, seoDescription, legacyUrl.
- **Speaking:** title, slug, status, topic, audienceType, promise, outcomes, format, pastEngagements,
  proofPermissionRef, pullQuote, heroImage.
- **Partners:** title, slug, status, partnerType, contributionFocus, description(rich), partnerLogo,
  websiteUrl, inquiryRoute, seoTitle, seoDescription.
- **DanaProfile:** profileName, role, portrait, imageAltText, executiveBio(rich),
  operatingPhilosophy(rich), ecosystemRoles(obj), experienceTimeline(obj), speakingCredibility(rich),
  pepsicoClaim, pepsicoClaimStatus, brandBlueprintUrl, vgpUrl, seoTitle, seoDescription.
- **ClientResources** (admin): title, slug, status, clientRef, resourceType, fileUrl(url), accessNotes.
- **RestrictedRoutes** (admin): title, slug, status, routeUrl(url), routeType, audience, notes.

## 11. Acceptance criteria / QA
- Every public collection renders live from the VGP CMS (no hard-coded copy where a field exists).
- Calendly appears **only** on a qualified Advisory-Pathway result and nowhere else; grep the built
  output for `calendly.com` → only `valugrowthpartners/vgp-insight-session`, and only in that gated view.
- No `ClientResources` / `RestrictedRoutes` / `FormSubmissions` data in any client bundle.
- No BB/Shopify link rendered while the store is password-protected (copy only).
- Placeholder Partners hidden; unverified Speaking engagements omitted; `pepsicoClaim` hidden.
- All §8 SEO/a11y/perf checks pass at 1440/1024/390.
- Deploys to a preview URL only; live domain untouched.

---
*Source of truth: docs 10 (CTA map), 11 (CRM/billing), 12 (QA/exposure), 18 (account figure), 19
(direction). Design tokens: doc 08.*
