# 16 — Consolidated Launch-Readiness Package (Brand Blueprint + VGP)

Single source of truth for launch. Covers both platforms. **Nothing here authorizes publication.** All work is staging/repository-side; publication, DNS, redirects, live payments, live subscription activation and domain cutover are explicitly out of scope until Dana authorizes each.

Store: `the-brand-blueprint.myshopify.com` · Unpublished theme `BB Preview (Phase 1-2) - DO NOT PUBLISH` (`154677215286`) · Storefront password `ucleax` (keep ON). VGP: Wix `Vgp Staging 2026` (`6b5d8f63-fc66-449d-8c07-2d826ef21d2d`).

---

## 1. Executive status summary
The Brand Blueprint is fully built on Shopify (Phases 1–2) and deployed to an unpublished, password-protected preview. The VGP institutional site (Phase 3) has complete build specifications and Studio implementation instructions, **but the Wix Studio pages have not yet been composed** (Wix Studio has no composition API; that step is a human editor session). Remaining work is browser QA, content/claim approval, Flow configuration, membership-billing decisions, and launch settings — all requiring account-owner, legal, financial, browser, or publication authority. **No part of the program is "live," and the three-phase program is not "fully complete."**

## 2. Completed vs outstanding, by platform

**Shopify — Brand Blueprint**
| Area | Status |
|---|---|
| Design system, 26 sections, all page templates | ✅ Complete, Theme Check zero errors |
| 7 metaobject definitions + seed content (editorial-review) | ✅ Complete |
| ~30 pages incl. all Phase 1–2 routes | ✅ Complete |
| Theme deployed unpublished; live theme (Horizon) untouched | ✅ Complete |
| Theme-settings URLs (fit-call, VGP) | ✅ Set in repo settings; pushed to theme (§5) |
| Browser QA / responsive screenshots | ⛔ Outstanding — Dana browser-side (sandbox network-blocked) |
| Homepage SEO title/meta | ⛔ Outstanding — Dana manual (not API-exposed) |
| Flow workflows (16) | ⛔ Outstanding — build + test in Flow editor, INACTIVE (doc 12) |
| Membership billing (Appstle) | ⛔ Outstanding — Dana approval; no billing activated |
| Content/claim/consent approvals | ⛔ Outstanding — Dana (doc 07, §11–12) |

**Wix — VGP**
| Area | Status |
|---|---|
| CMS collections, forms, routes, CRM labels | ✅ Complete (doc 03). Forms verified 2026-08-04: 3 intake forms enabled (Advisory Pathway Intake, Institutional Inquiry, Partner & Contributor Inquiry); 4 contact labels present. Label-on-submit application via Wix Automations — see doc 18 Part H |
| Phase 3 build spec + section-by-section Studio build | ✅ **Specification complete** (docs 13–14) |
| VGP Studio page composition + testing | ⛔ **Not implemented in Wix Studio** — pending editor session |
| VGP data-layer re-verification read | ✅ Done 2026-07-24 — 10 collections verified; drift logged (doc 03 addendum): +Capabilities, +ClientResources, +DanaProfile; RestrictedRoutes 4→5; **Velo disabled** (enable before advisory-pathway backend) |

> **Status language rule:** "specification complete" ≠ "implemented in Wix Studio." Unbuilt Wix pages are outstanding.

## 3. Dana-only manual actions
See the standalone **doc 17 — Dana Final Actions**. Summary: SEO paste; browser QA/screenshots + visual approval; content/claim/consent approvals; membership pricing + billing go/no-go; Flow build+activation; VGP Studio composition; and every publication/DNS/redirect/cutover step.

## 4. Browser QA & screenshot checklist (Dana or authorized browser)
Open each URL with `?preview_theme_id=154677215286`, enter password `ucleax`, capture at **390 / 768 / 1024 / 1440 px**. Absence of screenshots is **not** design approval.

| # | View | Preview path | Notes to verify |
|---|---|---|---|
| 1 | Homepage | `/` | Section order (doc 08 §2); no Calendly anywhere |
| 2 | Founder directory | `/pages/founders` | Filter chips; editorial-review flags on seeded founders |
| 3 | Founder Chapter | `/founders/sruti-baz` * | Consent gates; `[EDITORIAL REVIEW]` watermark |
| 4 | Start gateway | `/pages/start` | 3-way router |
| 5 | Founder Intake | `/pages/founder-intake` | Form + two qualifying questions |
| 6a | Intake result — qualified | `/pages/intake-next-steps?branch=qualified_first_time_founder` | Fit-call CTA visible (only here) |
| 6b | Intake result — prior relationship | `?branch=prior_dana_relationship` | Sign-in; **no Calendly** |
| 6c | Intake result — non-founder | `?branch=non_founder_pathway` | Pathways; **no Calendly** |
| 6d | Intake result — review | `?branch=dana_review` | 2-business-day ack; **no Calendly** |
| 7 | Membership comparison | `/pages/membership` (+ `/pages/founder-network`) | Staging price language; join disabled |
| 8 | Membership checkout entry | `/pages/membership` join CTA | Shows "Joining opens soon" (disabled) in staging |
| 9 | Member sign-in | `/account/login` | Login form |
| 10a | Protected resource — denied | `/pages/buyer-pitch-deck-template` (logged out) | Sign-in/compare prompt (denial state) |
| 10b | Protected resource — approved | same, as a `member`-tagged test customer | Content visible |
| 11 | About Dana | `/pages/about` | Sole founder/host; no $115M claim |
| 12 | Podcast | `/pages/podcast` | Dana sole host; guest CTA (no booking link) |
| 13 | VGP cross-brand route | homepage VGP band + `/pages/ecosystem` | Link → `https://www.valugrowthpartners.com/`, label "Explore Value Growth Partners" |
| 14 | Header / footer / mobile nav | any page; expand mobile nav at 390 | Persistent "Complete the Founder Intake"; footer legal links |

\* **Confirmed 2026-07-24:** founder-chapter pages resolve at **`/founders/<handle>`** (e.g. `/founders/sruti-baz`) — the metaobject `urlHandle` is `founders`.

**Member-QA account (for states 10b / member views):** a labeled test customer `bb-qa-member@example.com` exists, tagged `member` + `qa-test` (Customer `8871364788278`). To use it in browser QA: pass the storefront password (`ucleax`), open the account **activation link** (provided to Dana in chat — deliberately not committed to Git), set a password, then visit `/pages/buyer-pitch-deck-template` and `/pages/member-dashboard` to see the approved member state. Safe to delete after QA.

## 5. Shopify theme-settings table (exact values)
Theme editor → Theme settings → **Brand Blueprint** (values also version-controlled in `theme/config/settings_data.json`).
| Setting | ID | Value | Rendered where |
|---|---|---|---|
| Fit-call scheduling URL | `bb_fit_call_url` | `https://calendly.com/valugrowthpartners/vgp-insight-session` | **Only** the qualified intake result container |
| VGP cross-brand URL | `bb_vgp_url` | `https://www.valugrowthpartners.com/` | VGP band, ecosystem, about (label "Explore Value Growth Partners") |
| Member customer tag | `bb_member_tag` | `member` | Gate logic (protected resources, dashboard) |
| Emit dataLayer events | `bb_analytics_events` | `true` | Analytics (doc 08 §8) |
| Intake results page | `bb_intake_results_page` | the `intake-next-steps` page | Intake redirect |
Sitewide public CTA remains **"Complete the Founder Intake."** The general Calendly landing page is never linked or published.

## 6. Shopify Flow implementation & testing matrix
Full sheet in **doc 12** — 16 workflows with trigger, conditions, actions, tags, tier, notification, failure handling, test record, expected result, activation status. **All INACTIVE** until each is individually tested. Membership-lifecycle workflows are BB-plan-scoped and never touch VGP/Wix subscriptions.

## 7. CTA & destination inventory (Shopify)
Authoritative map in doc 02; as-built confirmation:
| CTA | Destination | Guardrail |
|---|---|---|
| Sitewide primary | `/founder-intake` (via `/start`) | Never Calendly |
| Hero secondary | `/founders` | — |
| Choose Your Path (4) | `/founder-intake`, `/partners`, VGP (cross-domain), `/guest-application` | Institutions fire `cross_domain_route` |
| Founder Network / Membership | `/founder-network`, `/membership` | Staging price; no live checkout |
| Podcast guest | `/guest-application` | Booking link invitation-only by email |
| VGP band | `https://www.valugrowthpartners.com/` | Single endorsement link |
| Intake — qualified only | `vgp-insight-session` Calendly | The ONLY public Calendly, post-qualification |
| Intake — other 3 branches | pathways / sign-in / ack | No Calendly |

## 8. Public/private Calendly exposure test
- **Approved public link** (`vgp-insight-session`): appears **only** inside the qualified-result container on `/pages/intake-next-steps`, revealed after both qualifying answers (founder=Yes AND met-Dana=No). Absent from nav, footer, homepage, sitemap, CMS, and all other CTAs.
- **Transparency note:** because Shopify storefronts render client-side, that container's markup exists in the intake-results page HTML source (visually gated, not server-gated). Since this is the *approved public* link, that is acceptable; fully removing it from source pre-qualification would require a server-side/app component (candidate hardening, later phase).
- **Private/program links** (private client scheduling, Build in Tulsa, W.E. Build, JumpStart): **zero** occurrences in theme source, settings, CMS, sitemap, metadata, or analytics — verified by repo-wide grep (only the single approved link + doc references exist).
- **General Calendly landing page:** never linked, never published.
- **VGP side verified 2026-07-24** (Wix RestrictedRoutes, ADMIN-read only): the approved `vgp-insight-session` link is stored on exactly one route ("VGP Insight Session (approved public fit call)"); the private routes ("Active client scheduling", "Sponsored program …") store **no** scheduling URL; no banned scheduling URL is stored anywhere. Minor hardening option: one private route's descriptive **title** names the sponsored programs (Build in Tulsa / W.E. Build / JumpStart) — ADMIN-only, no URL — genericize the label if zero CMS mention is desired.
- **Re-run at launch:** grep the published theme + rendered sitemap for `calendly`, `buildintulsa`, `webuild`, `jumpstart`; expect only the one approved link inside the qualified result.

## 9. CRM & system-of-record map
| Domain | System of record | CRM labels / tags |
|---|---|---|
| New BB memberships (billing + access) | **Shopify + Appstle** | `member`, tier tags, `founder-intake`, `route-*` |
| VGP relationships + existing VGP subscriptions | **Wix** | `custom.institutional-inquiry`, `custom.partner-contributor` (Wix CRM) |
| Newsletter | Shopify customers | `newsletter`, `signal-subscriber` |
| Intake outcomes | Shopify (Flow tags) | `route-fit-call/-prior-relationship/-non-founder/-human-review` |
Calendly = scheduling of approved conversations only; **not** the qualification layer.

## 10. Existing-client & new-member billing boundaries
- Existing VGP subscription clients **remain in Wix** with existing billing/access. **Never** import, cancel, rebill, or recreate them in Shopify.
- New **standardized** Brand Blueprint memberships begin in **Shopify/Appstle** after launch approval.
- New **custom** VGP advisory / institutional / speaking / project clients continue through **VGP/Wix**.
- No cross-system billing writes. Flow workflows are BB-plan-scoped (doc 12 guardrail).

## 11. Content & claim approval register (all PENDING Dana)
| Item | Location | Status |
|---|---|---|
| Founder chapters (3) — story/consent | `founder_chapter` seeds | PENDING consent; `[EDITORIAL REVIEW]`, unpublished-gated |
| Dana's Insight blocks, pull quotes | chapters | PENDING (needs founder stories / episode audio) |
| $115M PepsiCo claim | `dana_profile` | EXCLUDED until `pepsico_claim_status=approved` |
| Founder metrics / traction | chapters | Render only if `consent_metrics` true |
| Membership pricing benefits ("$99/mo") | membership pages | Staging language, PENDING |
| Testimonials | none built | None to date; add only verified |
| Legal copy (Privacy/Terms/Accessibility) | legal pages | PENDING legal review |
| Co-host (Cataanda James) historical media | 4 episodes (doc 07 §1) | Flagged separately; **current** metadata shows Dana as sole creator/founder/host — do not restore co-host language |
| Sponsor/media audience metrics | sponsor-media | `[EDITORIAL REVIEW]` until verified |
| VGP Speaking/Partner records | Wix collections | `[PLACEHOLDER]`; hide until verified |
**Dana Ammons is presented as sole creator, founder and host** across current descriptions, metadata and structured data. No blanket content/visual approval is granted.

## 12. Image, rights & consent register (PENDING)
| Asset | Status |
|---|---|
| Founder photography / logos / galleries | Not supplied (doc 05); chapters gated on `consent_image` |
| Dana portrait | Missing; placeholders in use |
| Social sharing image (1200×628) | Not supplied |
| Per-episode OG art | Unset; needs approved template |
| Founder consent records (story/image/metrics) | Not recorded for the 3 seeds |
Every image field carries alt/focal/caption/source/rights/credit governance (doc 03). No production customer data in fixtures.

## 13. SEO & redirect checklist
- Per-page: one H1, unique title/description, canonical, OG, JSON-LD (Organization+Person sitewide, PodcastSeries on podcast, Breadcrumb on chapters) — ✅ in theme.
- Homepage title/meta — ⛔ Dana paste (doc 15).
- Store stays **noindex** via password page while staging — ✅.
- Redirects (doc 04): **NOT activated**; apply at cutover only, after diffing live sitemaps. Legacy booking pages → `/advisory-pathway` (route through qualification, never straight to Calendly).
- Capsule → Founder Chapter mapping: PENDING Dana (doc 07 §5).

## 14. Accessibility & responsive QA
- Targets: WCAG 2.2 AA; no gold-on-white text; keyboard nav + visible focus; labeled forms + inline errors; `prefers-reduced-motion`; skip link — ✅ built into theme.
- Responsive breakpoints 390/768/1024/1440 — ⛔ browser verification pending (§4).
- Manual keyboard pass + screen-reader spot check — ⛔ pending browser QA.

## 15. Analytics event verification
Events emit to `window.dataLayer` behind `bb_analytics_events` (doc 08 §8): `founder_intake_start/submit`, `brand_blueprint_fit_call_click`, `route_select`, `cross_domain_route`, `institutional_inquiry_submit`, `podcast_application_submit`, plus application submits. **No analytics on any private/scheduling context.** Verify in-browser (dataLayer inspector) during QA; wire to GA4/GTM at launch only.

## 16. Domain-cutover & rollback checklist (DO NOT EXECUTE until authorized)
- **Do not** connect or redirect `TheBrandBlueprint.biz`; **do not** touch live `valugrowthpartners.com`.
- Pre-cutover: publish theme to a final review → Dana approves → export live sitemaps → diff vs doc 04 → stage redirects (unactivated).
- Cutover (authorized only): publish theme; point domain; activate redirects; flip store out of password; confirm noindex removed intentionally.
- Rollback: keep Horizon (or prior theme) as the revert target; redirect matrix (doc 04) is the rollback record; DNS TTL lowered pre-cutover; password can be re-enabled instantly.

## 17. Launch-day sequence (authorized only)
1. Final content/claim/consent sign-off (doc 17).
2. Membership billing go-live decision (Appstle) — or launch memberships disabled.
3. Activate tested Flow workflows one by one (doc 12).
4. Paste homepage SEO; add social image.
5. Publish theme (replaces Horizon) — **explicit Dana authorization**.
6. Remove storefront password; confirm intended index state.
7. Connect domain + activate redirects (doc 04).
8. Re-run the Calendly exposure grep on production (§8).
9. Smoke-test the four intake branches + a membership signup (if billing live).

## 18. Post-launch monitoring plan
- First 48h: watch intake submissions + Flow tag application; confirm qualified branch is the only Calendly surface; monitor failed-payment/dunning if billing live.
- Weekly: 404/redirect report vs doc 04; analytics event sanity; membership churn/dunning.
- Ongoing: content approval register burn-down; VGP Studio build progress; quarterly accessibility re-check.
- Alerts: payment-failure spikes, form-spam (hCaptcha), and any appearance of a non-approved scheduling URL.

---
**Companion:** doc 17 (Dana Final Actions). **Guardrail reminder:** stop before publication, DNS, redirects, live payments, live subscription activation, or public-domain cutover.
