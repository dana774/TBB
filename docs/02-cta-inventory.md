# 02 — CTA Inventory and Destination Map

Rule of the architecture: **websites and forms qualify and route; Calendly only schedules an approved next conversation.** No homepage CTA goes directly to Calendly. The general Calendly landing page is never linked.

## Brand Blueprint (thebrandblueprint.biz staging)

| # | Location | CTA label | Destination | Notes |
|---|---|---|---|---|
| 1 | Navigation (persistent) | Complete the Founder Intake | `/start` → `/founder-intake` | Primary sitewide CTA |
| 2 | Hero (primary) | Complete the Founder Intake | `/founder-intake` | |
| 3 | Hero (secondary) | Explore Founder Chapters | `/founders` | Ghost/secondary style |
| 4 | Choose Your Path — Founders | Start the Founder Intake | `/founder-intake` | |
| 5 | Choose Your Path — Investors/partners | Explore partnership pathways | `/partners` | |
| 6 | Choose Your Path — Institutions/ESOs | See institutional programs | VGP `/institutional-inquiry` (cross-domain) | Fires `cross_domain_route` |
| 7 | Choose Your Path — Podcast/media | Apply to be a guest | `/guest-application` | |
| 8 | Framework section | See the eight stages in action | `/founders` | |
| 9 | Featured Founder Chapters | Read the chapter | `/founders/{slug}` | Dynamic |
| 10 | Signals Hub preview | Visit the Signals Hub | `/signals` | |
| 11 | Resource Library preview | Browse the Resource Library | `/resources` | Member-access items route to `/members/sign-in` |
| 12 | Founder Network | Join the Founder Network — starts at $99/month | `/founder-network` | Staging language; pricing plan checkout only after approval |
| 13 | Podcast preview | Listen to the latest episode | `/podcast` | |
| 14 | Events preview | See events and opportunities | `/events` | |
| 15 | Dana authority section | About Dana Ammons | `/about` | |
| 16 | VGP cross-brand pathway | Explore Value Growth Partners | `https://www.valugrowthpartners.com` (staging: VGP staging home) | Endorsement block, one brand leads |
| 17 | Final section | Complete the Founder Intake | `/founder-intake` | Intake-first close |
| 18 | Founder Chapter template | Complete the Founder Intake | `/founder-intake` | Contextual, after story |
| 19 | Podcast page | Apply to Be a Guest | `/guest-application` | Public path; booking link is invitation-only by email |
| 20 | Intake results — **qualified first-time founder only** | Schedule Your Brand Blueprint Fit Call | `https://calendly.com/valugrowthpartners/vgp-insight-session` | The ONLY public Calendly destination. 30-minute fit, pathway and initial-scoping conversation. Never called a free consultation/strategy session. Fires `brand_blueprint_fit_call_click` |
| 21 | Intake results — prior Dana relationship | Sign in / existing-client contact | `/members/sign-in` + human review | No Calendly |
| 22 | Intake results — non-founder | Partner / institutional / sponsor / media pathway | Matching route pages | No Calendly |
| 23 | Intake results — ambiguous | Acknowledgement | Human review within 2 business days | No Calendly |

## Value Growth Partners (valugrowthpartners.com staging)

| # | Location | CTA label | Destination | Notes |
|---|---|---|---|---|
| 1 | Navigation (persistent) | Start the Advisory Pathway | `/advisory-pathway` | Intake → Diagnose → Map → Select → Execute |
| 2 | Hero (primary) | Start the Advisory Pathway | `/advisory-pathway` | |
| 3 | Hero (secondary) | Institutional programs | `/institutional-inquiry` | |
| 4 | Audience router — prospective clients | Start the Advisory Pathway | `/advisory-pathway` | |
| 5 | Audience router — active clients | Client sign-in | `/members/sign-in` | Private scheduling links delivered by direct communication only |
| 6 | Audience router — institutions/ESOs | Submit an Institutional Inquiry | `/institutional-inquiry` | Fires `institutional_inquiry_submit` on form submit |
| 7 | Audience router — partners | Partner & Contributor | `/partner-contributor` | |
| 8 | Audience router — BB founders | The Brand Blueprint ecosystem | BB staging home (cross-domain) | Fires `cross_domain_route` |
| 9 | Capabilities pages | Start the Advisory Pathway | `/advisory-pathway` | |
| 10 | Programs pages | Institutional Inquiry | `/institutional-inquiry` | |
| 11 | Speaking page | Book Dana to speak | `/speaking` inquiry form route | Human review; no public Calendly |
| 12 | Advisory pathway — qualified result | Schedule Your VGP Insight Session | `https://calendly.com/valugrowthpartners/vgp-insight-session` | Same single approved Calendly event; post-qualification only |

## Prohibited destinations (both sites)
- General Calendly landing page — never linked.
- Private active-client scheduling URLs — never on-site.
- Build in Tulsa / W.E. Build / JumpStart program scheduling URLs — never on-site, in source, CMS, sitemaps, metadata or analytics.
- Podcast interview-booking Calendly — invitation-only, sent by email to approved guests.
