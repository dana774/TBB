# 09 — Shopify Phase 1 Build Plan (pre-code, for Dana's approval)

**Status: awaiting Dana's approval. No code written, nothing pushed to the store, nothing published.**

Scope source: `SHOPIFY_CODEX_PHASE_1_PROMPT.md`. Strategy and design grounding: docs 01–08 in this repo (v3.0 blueprint work). Architecture: **Brand Blueprint on Shopify (Basic, Dawn-based OS 2.0); VGP stays on Wix.** All guardrails from the prompt are treated as hard constraints: unpublished theme only, no domain changes, no Shopify Payments activation, no paid apps, no live recurring charges, no private-route exposure.

---

## 1. Repository and theme structure

The theme lives in this repository (`dana774/TBB`) under `theme/`, keeping `docs/` for governance. Version control via Git; pushes to the store use Shopify CLI + Theme Access token as an **unpublished** theme named `BB Phase 1 — DO NOT PUBLISH`.

```
TBB/
├── docs/                          # governance docs (existing 01–08 + this plan)
├── theme/                         # Dawn fork, Online Store 2.0
│   ├── assets/
│   │   ├── bb-tokens.css          # design tokens as CSS custom properties (single source)
│   │   ├── bb-theme.css           # component styles layered over Dawn
│   │   └── bb-intake.js           # intake branching logic (progressive enhancement)
│   ├── config/
│   │   ├── settings_schema.json   # brand settings incl. approved Calendly URL setting
│   │   └── settings_data.json
│   ├── layout/theme.liquid        # semantic landmarks, skip link, JSON-LD injection
│   ├── locales/
│   ├── sections/                  # bb-prefixed custom sections
│   │   ├── bb-announcement.liquid
│   │   ├── bb-hero-editorial.liquid
│   │   ├── bb-choose-path.liquid
│   │   ├── bb-framework.liquid
│   │   ├── bb-founder-grid.liquid
│   │   ├── bb-signals-preview.liquid
│   │   ├── bb-resources-preview.liquid
│   │   ├── bb-podcast-preview.liquid
│   │   ├── bb-dana-authority.liquid
│   │   ├── bb-vgp-pathway.liquid
│   │   ├── bb-newsletter.liquid
│   │   ├── bb-intake-form.liquid
│   │   ├── bb-intake-results.liquid
│   │   └── bb-membership-compare.liquid
│   ├── snippets/
│   │   ├── bb-card-founder.liquid
│   │   ├── bb-card-resource.liquid
│   │   ├── bb-badge-access.liquid     # Public / Member badge
│   │   ├── bb-schema-org.liquid       # structured data per template
│   │   └── bb-member-gate.liquid      # customer-tag gate for protected content
│   └── templates/
│       ├── index.json                     # Homepage
│       ├── page.start.json                # Start gateway
│       ├── page.founder-intake.json       # Intake prototype
│       ├── page.intake-next-steps.json    # 4-branch results
│       ├── page.founders.json             # Founder directory
│       ├── metaobject/founder_chapter.json# Dynamic Founder Chapter
│       ├── page.podcast.json              # Podcast landing
│       ├── page.about.json                # About Dana
│       ├── page.membership.json           # Membership comparison
│       ├── page.member-dashboard.json     # Dashboard shell (login-gated)
│       ├── page.resource-public.json      # Public resource template
│       ├── page.resource-protected.json   # Protected resource template
│       └── customers/*                    # Dawn defaults, restyled tokens only
├── .theme-check.yml               # Theme Check config — zero errors gate
└── .github/workflows/theme-check.yml  # CI: Theme Check on every push
```

Conventions: every custom file is `bb-` prefixed; Dawn core files are modified minimally (tokens override, not rewrites) so Dawn upstream updates stay mergeable. No secrets in Git — Theme Access token lives only in local/CI environment variables; `settings_data.json` carries no private URLs.

## 2. Content / metaobject schema

Wix CMS collections (doc 03) map to Shopify metaobjects. Field standard carried over: `slug/handle`, `status`, SEO title/description, consent and image-governance fields.

| Metaobject | Maps from | Key fields | Storefront access |
|---|---|---|---|
| `founder_chapter` | Founders | name, company, stage, industry, location, narrative, turning_points, milestones, pull_quote, dana_insight, related_episode (ref), gallery, links, consent_story/image/metrics, seo_* | **Web pages enabled** → dynamic template |
| `episode` | Episodes | title, number, media_url, transcript, summary, guest, stage_tags, historical_flag, seo_* | Visible (rendered via podcast page + chapter refs) |
| `signal` | Signals | signal_type, summary, implication, founder_actions, verification_source | Visible |
| `resource` | Resources | title, collection, access_level (public/member), body, file/link | Visible; member items rendered only behind gate |
| `event` | Events | event_date, registration_url, eligibility | Visible |
| `funding_opportunity` | Funding | opportunity_type, amount_range, deadline, verified_by | Visible |
| `dana_profile` | DanaProfile | bio, philosophy, timeline, roles, pepsico_claim_status | Visible (singleton; **$115M claim excluded until approved**) |

**RestrictedRoutes does not migrate.** The only public-exposure-allowed destination (the `vgp-insight-session` Calendly URL, per doc 02 CTA #20) is stored as a **theme setting**, editable by Dana in the customizer. Private/sponsored/program URLs are never stored anywhere in Shopify or Git — matching the doc 06 exposure guarantee. Seed entries (3 founders, small samples of each type) are labeled `[EDITORIAL REVIEW]`, no production customer data.

## 3. Route and template map

| Route | Template | Prompt deliverable |
|---|---|---|
| `/` | `index.json` | 2 — Homepage (doc 08 §2 section order) |
| `/pages/start` | `page.start.json` | 3 — Start gateway (3-way router) |
| `/pages/founder-intake` | `page.founder-intake.json` | 4 — Intake prototype |
| `/pages/intake-next-steps` | `page.intake-next-steps.json` | 4 — four outcome branches |
| `/pages/founders` | `page.founders.json` | 5 — Founder directory (filter chips) |
| `/founder-chapters/<handle>`* | `metaobject/founder_chapter.json` | 6 — Dynamic Founder Chapter |
| `/pages/podcast` | `page.podcast.json` | 7 — Podcast landing |
| `/pages/about` | `page.about.json` | 8 — About Dana |
| `/pages/membership` | `page.membership.json` | 9 — Membership comparison |
| `/pages/member-dashboard` | `page.member-dashboard.json` | 10 — Dashboard shell |
| `/pages/<resource-handle>` | `page.resource-public.json` / `page.resource-protected.json` | 11–12 — Resource templates |
| Newsletter | `bb-newsletter.liquid` section (footer + homepage) | 13 — Signup via `/contact` customer form, marketing-consent tagged |
| VGP route | `bb-vgp-pathway.liquid` → VGP staging URL | 14 — Cross-brand route (fires `cross_domain_route`) |

\* Shopify controls metaobject page URL bases; exact base path is confirmed in admin at build time (Wix-style bare `/founders/{slug}` isn't guaranteed — see Risks). CTA map follows doc 02 verbatim; **no Calendly link anywhere except the qualified intake result**.

## 4. App integration boundaries (all remain draft/test)

| App | Phase 1 use | Boundary |
|---|---|---|
| Theme Access | CLI pushes of the unpublished theme | Token in env only, never in Git |
| Shopify Forms | Intake capture + newsletter fallback; app-block slot in `bb-intake-form` | Form live in preview only; submissions tagged `editorial-review-test` |
| Shopify Flow | On intake submit: tag customer with branch outcome (`route-fit-call`, `route-human-review`, …) + internal notification (doc 03 CRM label scheme) | Workflows built but **disabled** until approval |
| Shopify Messaging | None in Phase 1 UI | No chat widget in theme |
| Appstle Memberships | App-block slots reserved on membership page + dashboard shell; member gating via customer tag `member` | **No plans activated, no billing, no VGP subscription import.** Gate logic tests with a manually tagged test customer |

## 5. Intake implementation decision

**Recommendation: Shopify Forms + Flow + a theme-level branching layer. No custom app in Phase 1.**

How it works: `bb-intake-form` renders the approved question set; `bb-intake.js` evaluates the two qualifying answers (founder? / previously met Dana formally?) and redirects to `/pages/intake-next-steps?branch=<key>`, where `bb-intake-results` renders exactly one of the four approved branches. The submission itself lands in Shopify Forms (hidden field records the branch), and Flow applies the outcome tag and notifies Dana for human-review branches.

Why client-side evaluation is acceptable here, when doc 08 required server-side on Wix: the Wix server-side rule existed to keep *restricted route URLs* unqueryable. In this design **no restricted URL exists in Shopify at all** — the only URL a branch can reveal is the already-public-approved `vgp-insight-session` link. The other three branches render copy and internal pathways only. So client-side branching leaks nothing.

Trade-offs and the custom-app alternative: a small custom app (or Shopify Function/proxy) would give server-verified branching and durable server-side audit, but adds hosting, secrets, and review burden for zero confidentiality gain in Phase 1. Revisit only if Phase 2 adds genuinely private routing destinations. If Shopify Forms' conditional-logic limits fight the four-branch flow in practice, the fallback inside the same decision is: custom Liquid form posting to Shopify's native customer/contact endpoint with Flow doing the tagging — still no custom app.

## 6. Risks, assumptions, blockers

**Blockers (need Dana / environment action):**
1. **Shopify MCP connection expired** — the store connector needs re-authorization in claude.ai connector settings before I can create metaobjects, forms, or push the theme. I also need the dev store's `*.myshopify.com` URL (the prompt has a `{{SHOPIFY_MYSHOPIFY_URL}}` placeholder) and a Theme Access token delivered outside Git.
2. **Visual source of truth unreachable** — `brand-blueprint-vgp.dana51503.chatgpt.site` returns 403 to automated access. Plan is grounded in the doc 08 design contract (tokens, type scale, section order). If the reference site differs from doc 08, tell me which wins.

**Carried-over content gaps (from doc 07, unchanged):** founder consent unrecorded for all 3 seeded founders (chapters stay `editorial-review`); no founder photography or Dana portrait; $115M PepsiCo claim excluded pending proof; pull quotes and Dana's Insight blocks still draft; episode chapter markers require real media timings.

**Risks / assumptions:**
- Metaobject web-page URLs may not support bare `/founders/{slug}`; Shopify may impose a base path. Assumed acceptable for a dev store; final URL/redirect strategy is a Phase 2+ / go-live decision (doc 04 matrix stays the map).
- Shopify Forms conditional logic is less flexible than Wix Forms; mitigation is in §5.
- Member gating in Liquid via customer tags is presentation-level gating; genuinely confidential files would need gated delivery (Appstle or app proxy) — Phase 1 protected-resource template gates page access, and seed content contains nothing confidential.
- Newsletter uses Shopify native customer marketing consent (no email app in scope); sending platform is out of Phase 1 scope.
- Assumption: 47 episodes are *not* bulk-migrated in Phase 1 — the podcast landing ships with 3–5 seed episodes labeled editorial-review; full migration is a follow-on task.

## 7. Phase 1 acceptance tests

1. **Theme Check:** zero errors on `theme check theme/` (CI-enforced).
2. **Unpublished-only:** store's published theme is untouched; work exists solely on the `BB Phase 1 — DO NOT PUBLISH` preview.
3. **Intake branch matrix:** four submissions (founder+never-met → Fit Call CTA to `vgp-insight-session`; founder+met → prior-relationship result, no Calendly; non-founder → pathway result, no Calendly; ambiguous → 2-business-day review acknowledgement, no Calendly). Each applies the correct Flow tag (workflows tested manually while disabled).
4. **Prohibited-URL grep:** repo-wide and theme-settings search for `calendly` returns only the single approved `vgp-insight-session` reference in the theme setting + qualified result; zero matches for Build in Tulsa / W.E. Build / JumpStart / private-client scheduling URLs.
5. **Homepage:** all doc 08 §2 sections present in order; no Calendly link; all CTAs resolve per doc 02 table.
6. **Founder directory & chapter:** directory filters by stage/industry; chapter template renders every populated field, hides empty ones, renders metrics only when `consent_metrics` true; unconsented seeds visibly watermarked `[EDITORIAL REVIEW]`.
7. **Member gating:** protected-resource page and dashboard shell redirect logged-out visitors to sign-in; a `member`-tagged test customer sees content; an untagged logged-in customer sees the membership comparison prompt.
8. **Newsletter:** signup creates/updates a customer with explicit marketing consent captured; duplicate signup handled gracefully.
9. **Responsive:** 390 / 768 / 1024 / 1440 px pass on all 12 templates (screenshots delivered).
10. **Accessibility:** WCAG 2.2 AA contrast (no gold-on-white text), one H1 per page, full keyboard nav with visible focus, labeled forms with inline errors, `prefers-reduced-motion` honored, skip link present.
11. **SEO/structured data:** unique titles/descriptions and canonicals per template; JSON-LD validates (Organization + Person sitewide, PodcastSeries on podcast, Breadcrumb on chapters); dev store remains `noindex` via password page.
12. **Analytics:** doc 08 §8 event names fire from theme (custom events dataLayer-ready); no analytics on any private scheduling context.
13. **No-secrets audit:** Git history contains no tokens; fixtures contain no production customer data.

---

**Next step:** Dana approves or amends this plan (plus resolves blockers §6.1–6.2). Only then does theme code begin.
