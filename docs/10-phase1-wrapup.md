# 10 — Phase 1 Wrap-Up: Flow Specs, Acceptance Report, Handoff

Status date: 2026-07-20. Theme deployed unpublished (`BB Phase 1 - DO NOT PUBLISH`, id `154677215286`) on `the-brand-blueprint.myshopify.com`. Published theme (Horizon) untouched. Nothing published, no billing active, no scheduling URLs stored.

---

## 1. Shopify Flow workflows (build in Flow, leave DISABLED)

Flow has no public write API, so these are click-together specs for the Flow editor. All three stay **disabled** until Dana approves intake go-live. They assume the intake later migrates from the native contact form to a **Shopify Forms** form named `Founder Intake` (the theme section already reserves the app-block slot); the hidden field `Intake outcome branch` carries the branch key either way.

### WF1 — "BB Intake: outcome tagging"
- **Trigger:** Shopify Forms → *Form submission received* → form = `Founder Intake`.
- **Condition chain** on submission field `Intake outcome branch`:
  - `qualified_first_time_founder` → **Add customer tags:** `founder-intake`, `route-fit-call`
  - `prior_dana_relationship` → tags `founder-intake`, `route-prior-relationship`
  - `non_founder_pathway` → tags `founder-intake`, `route-non-founder`
  - otherwise → tags `founder-intake`, `route-human-review`
- Mirrors the doc 03 CRM label scheme (`custom.route-*`).

### WF2 — "BB Intake: human-review SLA"
- **Trigger:** same as WF1.
- **Condition:** `Intake outcome branch` is `prior_dana_relationship` OR `dana_review`.
- **Actions:** *Send internal email* to `dana@valugrowthpartners.com` — subject `Intake needs your review (2-business-day SLA)`, body includes submission fields; then *Wait 2 days* → condition: customer still has tag `route-human-review` or `route-prior-relationship` and no tag `review-done` → send reminder email.
- Dana closes the loop by adding tag `review-done` (or removing the route tag) after responding.

### WF3 — "BB Newsletter: consent bookkeeping" (optional)
- **Trigger:** *Customer created*.
- **Condition:** customer tags include `newsletter`.
- **Action:** *Send internal email* weekly digest is NOT possible in Flow; instead simply add tag `signal-subscriber` for segmentation. Skip if unwanted.

Guardrail: no Flow action may email visitors any scheduling link. All external email in these workflows is internal-only (to Dana).

## 2. Acceptance-test report (against doc 09 §7)

| # | Test | Result |
|---|---|---|
| 1 | Theme Check zero errors | **PASS** — 0 errors, 8 warnings (all Dawn stock); CI enforces `--fail-level error` |
| 2 | Unpublished-only | **PASS** — theme role UNPUBLISHED; MAIN theme Horizon untouched (verified via API) |
| 3 | Intake branch matrix | **PASS (code-verified)** — branch logic in `bb-intake.js` matches the intake rule; only `qualified_first_time_founder` renders the fit-call CTA; no-JS fallback = human-review branch. Browser walkthrough pending storefront-password access |
| 4 | Prohibited-URL grep | **PASS** — zero scheduling URLs in Git or store; fit-call URL exists only as an (unset) theme setting |
| 5 | Homepage sections/CTAs per docs 08 §2 + 02 | **PASS (template-verified)** — 14 sections in order in `index.json`; no Calendly anywhere |
| 6 | Directory/chapter render gates | **PASS (code-verified)** — consent-gated portrait/metrics; `[EDITORIAL REVIEW]` flags on all 3 seeded founders |
| 7 | Member gating | **PASS (code-verified)** — gate renders sign-in / membership-compare / content by customer tag. Needs a manual test customer tagged `member` for the live check |
| 8 | Newsletter signup | **PASS (code-verified)** — native customer form with consent text; live submit test pending browser access |
| 9 | Responsive 390/768/1024/1440 | **PENDING** — requires storefront password to screenshot the preview |
| 10 | Accessibility gates | **PASS (code-verified)** — semantic landmarks, labeled forms, focus styles, reduced-motion, no gold-on-white text; manual keyboard pass pending browser access |
| 11 | SEO/structured data | **PASS (code-verified)** — Organization+Person sitewide, PodcastSeries on podcast, Breadcrumb on chapters; dev store password page keeps the store out of indexes |
| 12 | Analytics events | **PASS (code-verified)** — dataLayer events behind the theme setting toggle; none on any scheduling context |
| 13 | No-secrets audit | **PASS** — no tokens in Git history; Theme Access token held in env/chat only; fixtures contain no production customer data |

## 3. Items for Dana (Phase 1 close-out)

1. **Storefront password** (admin → Online Store → Preferences) — share it to get the four-breakpoint screenshots and live intake walkthrough, or review the preview directly: `https://the-brand-blueprint.myshopify.com/?preview_theme_id=154677215286`.
2. **Theme settings → Brand Blueprint**: set the fit-call URL (vgp-insight-session) and VGP URL.
3. Click together WF1/WF2 in Flow (specs above), leave disabled.
4. Approvals that unblock content: founder consents + photography, Dana portrait, pull quotes, Dana's Insight drafts, co-host-era episode decision, PepsiCo claim proof.
5. Phase 2 kickoff decision per doc 08 §10.
