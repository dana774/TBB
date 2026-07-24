# 14 — VGP Studio Editor Build (section-by-section)

> **STATUS: SPECIFICATION COMPLETE — NOT YET IMPLEMENTED IN WIX STUDIO.** This document is the build instruction set. The actual `Vgp Staging 2026` pages must still be composed and tested in the Wix Studio editor (no composition API exists). Do not treat this spec as a built site.

> **DATA-LAYER VERIFIED 2026-07-24** (doc 03 addendum). Corrections applied below: capability pages bind to the dedicated **`Capabilities`** collection (6 items), not `Programs`; the members area uses the protected **`ClientResources`** collection (ADMIN read, 1 item); `DanaProfile` confirmed on VGP. **Velo is currently DISABLED on the site — it must be enabled before the `/advisory-pathway` server-side qualification backend can be built.**

The executable companion to doc 13. This is the click-level build for the **Vgp Staging 2026** Studio editor (`6b5d8f63-fc66-449d-8c07-2d826ef21d2d`), at the granularity of doc 08 §2 for BB. Build in Studio; **do not publish**; do not touch live `valugrowthpartners.com`. Copy marked `[EDITORIAL REVIEW]` is placeholder for Dana's sign-off; verified language is used where doc 02/08/13 established it.

Design tokens: identical to doc 08 §1. VGP rhythm: 2-up cards max, section padding 112–136px desktop, gold on ≤1 element per view.

## Homepage — build these sections in order

1. **Announcement bar** — Soft Gray-Blue bg, one line: "[EDITORIAL REVIEW] New institutional programs and the latest Insight are live." One text link. Dismissible.

2. **Navigation** — white, sticky. Logo left; Capabilities, Programs, Case Studies, Insights, Speaking, About; persistent primary button **"Start the Advisory Pathway"** → `/advisory-pathway`.

3. **Audience router hero (the Intake stage)** — full-width, generous whitespace. Gold eyebrow "STRATEGIC ADVISORY"; serif H1 "[EDITORIAL REVIEW] Move founders from access to commercial readiness."; one-sentence subhead. Below, a 5-card router (2-up on desktop wrapping, 1-up mobile), each fires `route_select`:
   | Card title | Body | CTA → destination |
   |---|---|---|
   | Prospective clients | Advisory for founders and teams ready to scale. | Start the Advisory Pathway → `/advisory-pathway` |
   | Active clients | Pick up where we left off. | Client sign-in → `/members/sign-in` |
   | Institutions & ESOs | Programs that move cohorts to commercial readiness. | Submit an Institutional Inquiry → `/institutional-inquiry` |
   | Partners | Build alongside the advisory practice. | Partner & Contributor → `/partner-contributor` |
   | Brand Blueprint founders | The founder ecosystem. | The Brand Blueprint → BB staging home (cross-domain; fires `cross_domain_route`) |

4. **Positioning band** — Navy background, centered, serif: **"VGP helps entrepreneurship support organizations move founders from access to commercial readiness."** No CTA; this is the thesis.

5. **Diagnose** — Pale Blue section. Eyebrow "DIAGNOSE". H2 "[EDITORIAL REVIEW] Start with a clear read on where the business actually is." 3-item prose list (not cards) of what a VGP diagnostic covers (commercial readiness, operating systems, growth constraints — [EDITORIAL REVIEW]). Link "See the advisory pathway" → `/advisory-pathway`.

6. **Map the Growth Path** — white. Eyebrow "MAP THE GROWTH PATH". H2. Repeater on **`Programs`** (2-up), each: capability name, one-line outcome, link → `/capabilities/{slug}`. Link "See all capabilities" → `/capabilities`.

7. **Select the Engagement** — Soft Gray-Blue. Eyebrow "SELECT THE ENGAGEMENT". Three engagement models as prose blocks: Advisory retainer → `/advisory-pathway`; Institutional program → `/institutional-inquiry`; Speaking & workshops → `/speaking`. No pricing.

8. **Execute and Measure** — white. Eyebrow "EXECUTE AND MEASURE". H2. Repeater on **`CaseStudies`** (2-up, approved records only): client/context, the growth outcome, link → `/case-studies/{slug}`. If empty, hide the grid and show a single "[EDITORIAL REVIEW] Case studies in preparation" line.

9. **Insights preview** — Pale Blue. Eyebrow "INSIGHTS". Repeater on **`Insights`** (2-up, latest 2–4): title, summary, link → `/insights/{slug}`. Link "Read all insights" → `/insights`.

10. **Speaking teaser** — white, 2-col: left copy "Book Dana to speak"; right single CTA → `/speaking`. No public Calendly.

11. **Brand Blueprint endorsement band** — Navy, VGP leads: "[EDITORIAL REVIEW] Working with founders directly? The Brand Blueprint is the founder ecosystem side of this partnership." Single link → BB staging home (`cross_domain_route`). No dual-logo competition.

12. **Newsletter** — Pale Blue, native Wix form → CRM; institutional framing ("[EDITORIAL REVIEW] Field notes for people who build founder ecosystems.").

13. **Final CTA + footer** — serif close "[EDITORIAL REVIEW] Ready to map the growth path?" → **"Start the Advisory Pathway"** `/advisory-pathway`. Footer: sitemap, Privacy/Terms/Accessibility. **Never link a Calendly from the homepage.**

## `/advisory-pathway` (qualification — mirrors doc 08 §5)
- Intro; embedded Wix advisory-intake form; results page backed by Velo `.jsw` (server-side evaluation, never client-only, so RestrictedRoutes URLs stay unqueryable).
- Qualified prospective-client result → button **"Schedule Your VGP Insight Session"** → `https://calendly.com/valugrowthpartners/vgp-insight-session` (fires `vgp_insight_session_click`). All other results → pathway links / two-business-day acknowledgement. Never the general Calendly page; never a private/active-client or program scheduling URL.

## `/institutional-inquiry`
Intro on institutional programs; Wix form → CRM label `custom.institutional-inquiry`; submit fires `institutional_inquiry_submit`; two-business-day human-review acknowledgement. No Calendly.

## `/partner-contributor`
Wix form → CRM label `custom.partner-contributor`; human review. No Calendly.

## `/capabilities` + `/capabilities/{slug}` (dynamic on **`Capabilities`**, 6 items)
Index: intro + 2-up capability grid. Detail: H1 capability; overview; who it's for; outcomes; related programs/case studies (bound); contextual CTA → `/advisory-pathway`; SEO fields bound. Render only approved records; final slugs feed doc 04 redirect matrix.

## `/programs` + `/programs/{slug}` (dynamic on `Programs`)
Institutional program pages: program summary, audience/eligibility, format, outcomes; CTA → `/institutional-inquiry`.

## `/case-studies` + `/case-studies/{slug}` (dynamic on `CaseStudies`)
Approved records only. Detail: context, challenge, approach, measured outcome (no invented numbers), related capability; CTA → `/advisory-pathway`.

## `/insights` + `/insights/{slug}` (dynamic on `Insights`)
Editorial index + article template: H1, body, author (Dana), related insights; Article schema; CTA to newsletter + `/advisory-pathway`.

## `/speaking`
Dana as institutional speaker. Topics; formats; **verified** past engagements only (Speaking records are `[PLACEHOLDER]` — hide the list until verified, doc 07 §6). "Book Dana to speak" → inquiry form (human review). No public Calendly. PepsiCo $115M figure excluded until approved.

## `/about`
Institutional framing of DanaProfile (shared narrative); operating philosophy; roles; pathway links to `/advisory-pathway` and BB cross-domain. PepsiCo claim gated on `pepsicoClaimStatus = approved`.

## `/members/sign-in` + member area
Wix Members active-client area. Protected content binds to the **`ClientResources`** collection (ADMIN read — only served to signed-in members via Velo/dynamic dataset permissions, never public). Private scheduling links delivered by direct communication only — never rendered on-site.

## Legal
Privacy / Terms / Accessibility — same set and standard as BB.

## Per-page gate (every page)
One H1; unique title/description; canonical; OG; schema Organization + Person sitewide, Article on insights, BreadcrumbList on dynamic pages; WCAG 2.2 AA (no gold-on-white text); keyboard nav + visible focus; reduced-motion; responsive images; analytics per doc 13 §7. Test at 390/768/1024/1440. **Nothing published.**
