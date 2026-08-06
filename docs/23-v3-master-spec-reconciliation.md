# 23 — Reconciliation to the v3.0 Master Spec (2026-08-06)

Reconciles the working docs (19–22) with Dana's **Consolidated Wix Rebuild Master Prompt v3.0**
(+ Architecture/CTA/Scheduling Matrix v3.0), supplied 2026-08-06. **The v3.0 package is authoritative
for architecture, audience routing, CTA language, the Calendly exposure registry, forms, governance,
privacy, and QA.** Docs 19–22 are aligned to it below.

## A. One material conflict — resolved
**v3.0 assumes Brand Blueprint stays on Wix Managed Headless** (Wix Members + Wix Pricing Plans,
Founder Network $99 / Builder $249 / LaunchPad $499). **Dana's later Hybrid Handoff moved BB to
Shopify** (Online Store 2.0 + Appstle). The later decision **supersedes** v3.0 for BB commerce /
membership / checkout. **What carries over unchanged to BB-on-Shopify:** the /start gateway, the
rules-based /founder-intake, the CTA language, the Calendly exposure registry, private-link security,
and all governance. VGP remains on Wix exactly as v3.0 describes. (v3.0's "third free VGP-named Wix
site" = our `Bb Staging 2026`, parked.)

## B. Authoritative Calendly routing registry (exposure classes)
Only ONE public event; everything else is gated. Never the general `calendly.com/valugrowthpartners`.

| Event | URL key | Exposure | Rule |
|---|---|---|---|
| BB \| New Client Fit Call (30m) | `vgp-insight-session` | **Public AFTER intake** | Only the qualified first-time-founder branch of /founder-intake may book. Not a free consult. |
| VGP \| Active Client Strategy Session (30/60m) | `vgp-active-client-strategy-session` | **Private** | Client portal / protected pages / direct comms only. Never public. |
| Build in Tulsa \| Founder Diagnostic (60m) | `bit-founder-diagnostic-2026` | **Private program** | Password-protected program pages / sponsor comms only. |
| Build in Tulsa \| Executive Coaching (60m) | `bit-executive-coaching-2026` | **Private program** | Same. |
| W.E. Build Cohort 4 \| Office Hours (30m) | `w-e-build-cohort-4-office-hours` | **Private program** | Cohort 4 only; dates Sep 10/17/24, Oct 1/8/15/22/29, Nov 12 (Nov 5 unavailable); confirm before activation. |
| JumpStart \| Founder Commercialization | `jumpstart-founder-commercialization-session` | **Inactive** | Do NOT publish/embed/link anywhere. May describe JumpStart-style programs, not as a signed engagement. |
| Build with VGP \| Partner & Contributor Intro (30m) | `vgp-partner-contributor-intro` | **Conditional** | Qualified partners/institutions only; never the default founder CTA. |
| The Brand Blueprint Interview Invite (75m) | `the-brand-blueprint-interview-invite` | **Invitation only** | Only after Guest Application + Dana editorial approval. |

## C. Alignments applied to the working docs
- **VGP nav (doc 20):** `Capabilities | Growth OS | Programs | Speaking | Insights | About`. Persistent
  CTA relabeled **"Explore a VGP Advisory Engagement"** → `/advisory-pathway`.
- **CTA language:** Prefer — Complete the Founder Intake · Find Your Brand Blueprint Pathway · Schedule
  Your Fit Call · Explore a VGP Advisory Engagement · Discuss an Institutional Partnership · Access Your
  Client Scheduling Page · Schedule Your Program Session. **Avoid** — Book a Call, Book Time With Dana,
  Free Consultation, Free Strategy Session, Schedule an Appointment, Let Us Chat.
- **Capabilities = 7** (added **Partner + Investor Orchestration** this pass): Strategic Growth
  Architecture, **Growth OS**, Funding + Forecast Readiness, Retail + Distribution Strategy, Digital
  Growth + AI, Operations + Sourcing, Partner + Investor Orchestration. **Growth OS** is also a top-nav
  item / dedicated page — the only public implementation architecture; VGP's internal agents/prompts/
  Google systems stay internal.
- **Programs** organize into: Commercialization Programs · Curriculum + Cohort Support · Mentorship +
  Office Hours · Workshops + Seminars (the 6 accelerator tiers stay backstage under the single-ladder rule).
- **Investor routing (doc 21):** the **public investor entry is the Brand Blueprint _Investor Pipeline_
  form** (BB owns investor lead capture). The **VGP Hot List** is the separate **investor-gated digest**
  served only to vetted/approved investors — not a public page. Both coexist; doc 21's gating stands.
- **Six canonical operating portfolios** (backstage organizing model): Founder Network + Resource
  Experience · Signal, Media + Opportunity Engine · Readiness + Market Access Platform · VGP Advisory +
  Growth OS Delivery · Institutional Programs + Learning Products · Partner, Investor + Expert Ecosystem.
- **Endorsement / contact:** "The Brand Blueprint Ecosystem | Powered by Value Growth Partners |
  Strategic Advisory & Operating Firm"; public phone **+1 229-663-1684** (never the 480 personal number).

## D. Governance carried in from v3.0 (applies to both brands)
- **Private-link security:** private/inactive event URLs never in nav, footers, booking/contact pages,
  public CMS, page source, hidden elements, sitemaps, structured data, social previews, or public
  analytics. Store only in authenticated member data / protected pages / transactional email / direct comms.
- **No public analytics** on private client, Build in Tulsa, W.E. Build, or JumpStart routes.
- **Analytics events:** founder_intake_start/submit, brand_blueprint_fit_call_click,
  institutional_inquiry_submit, partner_intro_click, podcast_application_submit, podcast_booking_click,
  route_select, cross_domain_route, assisted_conversion.
- **Privacy/retention:** minimize public collection; privacy acceptance required, marketing consent
  separate/optional; inactive-lead retention 24 months; financial/transaction records 7 years; legal
  approval before production. Do not accept sensitive financial documents through public forms.
- **Forms (9):** BB Founder Intake, BB Founder Network, BB Investor Pipeline, VGP Hot List Resource
  Partner Application (supplied form), BB Guest Contact Application, BB Sponsor, VGP Advisory Inquiry,
  VGP Institutional Inquiry, VGP Speaking Inquiry — each preserving full attribution + consent + SLA.
- **Migration:** inventory → classify → build → verify → approve redirect → cut over. Dedup blogs
  (known near-dupes: Trish Lindo, Aisha Crump, Natalie Weakly); descriptive slugs + approved 301s;
  nothing deleted/redirected before staging acceptance. Dana is sole publisher / rollback owner.

## E. Gaps still open (tracked)
- ✅ **Program sub-areas seeded** (2026-08-06): Commercialization Programs · Curriculum + Cohort Support ·
  Mentorship + Office Hours · Workshops + Seminars (`programType = Institutional Program`,
  editorial-review). Programs collection now = 3 institutional + 6 accelerator tiers + these 4 sub-areas.
- BB-side v3.0 pages (/start, Investor Pipeline, Sponsor, Signals Hub, etc.) live in the **Shopify** BB
  build, not this VGP repo scope — route/CTA/governance rules from §B–D apply there too.
- Legal/privacy review, W.E. Build final dates, and the public naming family remain Dana approval gates.
