# 08 — Studio Editor Build Spec (Phase 1: Brand Blueprint templates)

Wix has no public API for Studio page composition, so this spec is the handoff for the editor session. Every data source, form and route it binds to already exists on the staging sites. Build in Studio on **Bb Staging 2026**; do not publish.

## 1. Design tokens (set as global site styles — no per-element formatting)

**Color styles**
| Token | Hex | Use |
|---|---|---|
| Blueprint Blue | `#3978D7` | Primary CTAs, links, active states |
| Navy | `#071E41` | Display headings, footer background |
| Deep Blue | `#0B2D57` | Secondary surfaces, hover on primary |
| Warm Gold | `#C89B2C` | Sparingly: eyebrow labels, one accent per view max |
| Pale Blue | `#EFF5FF` | Tinted section backgrounds, placeholder blocks |
| Soft Gray-Blue | `#F5F8FC` | Alternate section background |
| Body Gray | `#4B5563` | Body copy |
| White | `#FFFFFF` | Dominant canvas |

**Typography (global text styles)**
- Display serif for H1–H3: use a refined editorial serif from the Studio library (Playfair Display or Freight/Tiempos-class equivalent). H1 desktop 64–76px / 1.05 line height; H2 40–48px; H3 28–32px. Navy.
- Sans serif for everything else (nav, body, labels, forms): Inter/Söhne-class. Body 17–20px / 1.6; labels 13–14px, +5% letter-spacing, uppercase eyebrows.
- Scale down ~15% at 1024px; H1 36–40px at 390px.

**Layout**
- 12-column grid, max content width 1240px, gutters 24px.
- Desktop section padding 96–120px vertical; 64–80px tablet; 48–56px mobile.
- Breakpoints to design/test: 1440 / 1024 / 390.

**Components**
- Buttons: square or 4px radius. Primary = Blueprint Blue fill, white text; hover Deep Blue; focus 2px offset outline Blueprint Blue; active pressed shade. Secondary = 1px Navy outline, Navy text, hover Pale Blue fill.
- Cards: white, 1px `#E5EAF2` border, shadow only on hover (subtle), no decorative gradients, no over-rounded corners.
- Motion: fade/rise ≤200ms only; honor `prefers-reduced-motion`.

## 2. Homepage (BB) — build all 13 sections in order

1. **Announcement bar** — Pale Blue bg, one line, e.g. "New Founder Chapters and the latest Market Signal are live." One text link. Dismissible.
2. **Navigation** — white, sticky. Logo left; Founders, Resources, Signals, Podcast, Ecosystem, About; persistent primary button "Complete the Founder Intake" → `/founder-intake`.
3. **Split editorial hero** — 7/5 columns. Left: gold eyebrow "THE FOUNDER ECOSYSTEM"; serif H1 (e.g. "Build a brand that earns its place on the shelf."); 1–2 sentence subhead; primary CTA "Complete the Founder Intake", secondary "Explore Founder Chapters". Right: premium photograph (placeholder per doc 05) with offset **Founder Signal insight card** overlapping the image bottom-left: small card, gold label "FOUNDER SIGNAL", one stat/insight line, link to Signals Hub.
4. **Proof / outcome strip** — single row, 3–4 concise ecosystem outcomes (no invented numbers; use verified counts: "47 podcast episodes", "8-stage framework", "Founder Chapters + Signals + Resources").
5. **Choose Your Path** — 4 equal cards: Founders → `/founder-intake`; Investors, partners & contributors → `/partners`; Institutions & ESOs → VGP institutional inquiry (cross-domain); Podcast guests, sponsors & media → `/guest-application`.
6. **The eight-stage framework** — Vision, Research, Identity, Development, Marketing, Distribution, Funding, Scaling. Numbered editorial list or 4×2 grid, minimal iconography, link "See the stages in action" → `/founders`.
7. **Featured Founder Chapters** — CMS repeater on `Founders` (status filter), 3 cards: portrait, name, company, stage tag, one-line lesson → `/founders/{slug}`.
8. **Signals Hub preview** — repeater on `Signals`: Market Signal, Funding Friday, current opportunities; link to `/signals`.
9. **Resource Library preview** — repeater on `Resources` with visible Public / Member badges (from `accessLevel`); link `/resources`.
10. **Founder Network** — overview + staging language "starts at $99/month"; CTA to `/founder-network`. No checkout until approved.
11. **Podcast & Capsule archive preview** — latest episode (largest card) + 2 recent from `Episodes`; link `/podcast`.
12. **Events & opportunities** — repeater on `Events` + `Funding` highlights.
13. **Dana Ammons authority section** — portrait placeholder, 2–3 sentence positioning from `DanaProfile` (no $115M claim), link `/about`.
14. **VGP cross-brand pathway** — Navy band, BB leads: "Need hands-on advisory or operating systems? Value Growth Partners is the strategic advisory side of this ecosystem." Single link. No dual-logo competition.
15. **Final CTA** — intake-first close: serif line + "Complete the Founder Intake". Footer with sitemap, Privacy/Terms/Accessibility.

Never link Calendly from the homepage.

## 3. Founder directory `/founders`
Header + filter chips (stage, industry) bound to `Founders`; editorial card grid (max 3-up, generous whitespace); each card → dynamic chapter page.

## 4. Founder Chapter template `/founders/{slug}` (dynamic page on `Founders`)
Order: breadcrumb; company logo + name/role; serif H1 (chapter title); portrait + snapshot sidebar (industry, location, stage from fields); origin story (`founderNarrative`); market problem; strategic turning points; milestones & approved traction (render only if `consentMetrics`); founder pull quote (large serif, Blueprint Blue rule); **Dana's Insight** callout (Pale Blue card, gold label); related episode embed (`relatedEpisodeSlug` → `Episodes`: video/audio player, chapter list when available, transcript/accessible summary in collapsible); product & lifestyle gallery; related resources/signals; approved website + social links (only non-empty fields); previous/next chapter nav; contextual CTA "Complete the Founder Intake"; SEO fields bound (`seoTitle`, `seoDescription`, canonical, `socialPreviewImage`).
Render gate: only `status = Published` AND story/image consent true reach the live collection view.

## 5. `/start` gateway and `/founder-intake`
- `/start`: one-screen router — headline "Start here", three large choices: I'm a founder → `/founder-intake`; I'm an institution/partner → paths; I want to be on the podcast → `/guest-application`.
- `/founder-intake`: embed Wix form **Founder Intake** (`ce3bdc89-a89d-4bda-9c36-484810e99c40`), intro copy stating what happens next.
- **Results page `/founder-intake/next-steps`** (Velo, server-backed):

```js
// Page code sketch — evaluation server-side (backend .jsw), never client-only
// backend/intake.jsw
import wixData from 'wix-data';
import { contacts } from 'wix-crm-backend';

export async function evaluateIntake(submission) {
  const founder = submission.is_founder_fi === 'Yes';
  const metDana = submission.met_dana_fi === 'Yes';
  let routeKey = 'human_review_required';
  if (founder && !metDana) routeKey = 'qualified_first_time_founder';
  else if (founder && metDana) routeKey = 'prior_dana_relationship';
  else if (!founder) routeKey = 'non_founder_pathway';
  const route = await wixData.query('RestrictedRoutes')
    .eq('routeKey', routeKey).find({ suppressAuth: true }); // admin-read collection
  const r = route.items[0];
  // label the contact with the outcome; assign owner; SLA for review routes
  return {
    routeKey,
    message: r.resultMessage,
    // destinationUrl returned ONLY for publicExposureAllowed routes
    destination: r.publicExposureAllowed ? r.destinationUrl : null
  };
}
```
- Qualified result renders button **"Schedule Your Brand Blueprint Fit Call"** → the returned URL (vgp-insight-session). Copy: "a 30-minute fit, pathway and initial-scoping conversation." Never "free consultation".
- Other results render sign-in / pathway links / two-business-day acknowledgement. No Calendly.
- Report the real staging URL of `/founder-intake` only after this page previews correctly.

## 6. About Dana `/about`
Bound to `DanaProfile`: portrait (placeholder), executive bio, operating philosophy, roles, verified P&G / PepsiCo / Colgate-Palmolive experience, résumé-style timeline (`experienceTimeline`), speaking/coaching/institutional credibility, pathway links to BB intake and VGP. **Exclude the $115M figure until `pepsicoClaimStatus` is set to approved.**

## 7. Podcast `/podcast`
Dana presented as sole creator, founder and host. Latest episode hero; Capsule archive grid on `Episodes` (repeater with stage/topic filters); founder-interview badge; transcript/chapters on the episode dynamic page; **Guest application CTA → `/guest-application`** — no public booking link anywhere; approved guests get the invitation-only Calendly by email.

## 8. Analytics events (wire when pages exist; via site custom events/GTM)
`founder_intake_start` (form first interaction) · `founder_intake_submit` · `brand_blueprint_fit_call_click` (qualified result button) · `institutional_inquiry_submit` · `partner_intro_click` · `podcast_application_submit` · `podcast_booking_click` (email-link click-throughs only, if trackable) · `route_select` (/start + Choose Your Path) · `cross_domain_route` (BB↔VGP links) · `assisted_conversion`. **No marketing analytics on private client or sponsored-program scheduling.**

## 9. SEO / accessibility gate (every page)
One descriptive H1 · unique title + meta description · canonical · OG data · schema: Organization + Person (Dana) sitewide, PodcastSeries on /podcast, PodcastEpisode on episode pages, Article on signals/insights, Event on events, Breadcrumb on dynamic pages · WCAG 2.2 AA contrast (Body Gray on white passes; never gold on white for text) · full keyboard nav + visible focus · labeled forms with inline errors · reduced-motion support · captions/transcripts on media · responsive images with focal points · performance budget: LCP < 2.5s on 4G, image lazy-loading below the fold.

## 10. Phases 2–3
- **Phase 2** (after Dana approves Phase 1 visuals): propagate the system to remaining BB pages (list in the master scope: Choose Your Path, Founder Network, Resource Library ×9 collections, Signals Hub, Market Signal, Funding Friday, Founder Stories/Hot List, Events, Ecosystem Hub, Investors, Partners, Accelerators & Alumni, Guest Application, Sponsor/Media Kit, Member Sign In, Resource Request, Contact, Privacy, Terms, Accessibility).
- **Phase 3**: coordinated institutional variation on Vgp Staging 2026 — same tokens, calmer rhythm (more whitespace, fewer cards), audience router hero (5 audiences), the Intake → Diagnose → Map the Growth Path → Select the Engagement → Execute and Measure sequence as the homepage spine, capability/program/speaking/case-study pages bound to the seeded VGP collections, institutional positioning line: *"VGP helps entrepreneurship support organizations move founders from access to commercial readiness."*
