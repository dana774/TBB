# 11 — Phase 2 Deployment Record

Status date: 2026-07-22. Phase 2 propagates the Brand Blueprint design system to the remaining BB pages (doc 08 §10). Deployed into the **same** unpublished preview theme as Phase 1 (now renamed `BB Preview (Phase 1-2) - DO NOT PUBLISH`, id `154677215286`). Published theme (Horizon) untouched; nothing published.

## What deployed

**Theme files (21) — pushed via `themeFilesUpsert` from raw GitHub URLs on `claude/new-session-q4or1d`:**
- 7 sections: `bb-signals-hub`, `bb-resource-library`, `bb-events-index`, `bb-application-form`, `bb-partners`, `bb-ecosystem`, `bb-sponsor-media`
- 14 page templates: signals, market-signal, funding-friday, resources, events, guest-application, resource-request, partner-intro, partners, accelerators-alumni, hot-list, ecosystem, sponsor-media, founder-network

**Pages (14):**
- Updated to their Phase 2 template (were Phase 1 stubs): `partners`, `guest-application`, `signals`, `resources`, `events`
- Created new: `market-signal`, `funding-friday`, `resource-request`, `partner-intro`, `accelerators-alumni`, `hot-list`, `ecosystem`, `sponsor-media`, `founder-network`

**Metaobject definition:** `partner` created (doc 03 Partners collection; only `status=published` records render, placeholders stay hidden per doc 07 §7).

## Page → template map (Phase 2)

| Route | Template | Section |
|---|---|---|
| `/pages/signals` | page.signals | bb-signals-hub (all) |
| `/pages/market-signal` | page.market-signal | bb-signals-hub (Market Signal) |
| `/pages/funding-friday` | page.funding-friday | bb-signals-hub (Funding Friday) |
| `/pages/resources` | page.resources | bb-resource-library |
| `/pages/events` | page.events | bb-events-index |
| `/pages/guest-application` | page.guest-application | bb-application-form |
| `/pages/resource-request` | page.resource-request | bb-application-form |
| `/pages/partner-intro` | page.partner-intro | bb-application-form |
| `/pages/partners` | page.partners | bb-partners |
| `/pages/accelerators-alumni` | page.accelerators-alumni | bb-founder-grid (filtered) |
| `/pages/hot-list` | page.hot-list | bb-founder-grid |
| `/pages/ecosystem` | page.ecosystem | bb-ecosystem |
| `/pages/sponsor-media` | page.sponsor-media | bb-sponsor-media |
| `/pages/founder-network` | page.founder-network | bb-membership-compare |

## Guardrails held

- No scheduling links anywhere in Phase 2 pages; approved podcast guests still receive the invitation-only link by email (doc 02).
- Application forms are native Shopify contact forms with an internal `Form` identifier field (ready for the Flow tagging workflows in doc 10 §1).
- Sponsor/Media kit uses verified counts only; audience metrics flagged `[EDITORIAL REVIEW]`.
- Partner records hidden unless `status=published`.
- Theme Check: zero errors. Theme remains UNPUBLISHED.

## Preview

`https://the-brand-blueprint.myshopify.com/?preview_theme_id=154677215286` (store password required).

## Remaining (unchanged from doc 10 close-out)

Storefront password for screenshots/walkthrough; theme settings (fit-call + VGP URLs); build the disabled Flow workflows; content approvals (consents, photography, portrait, pull quotes, co-host-era episodes, PepsiCo proof). Phase 3 = VGP institutional variation on Wix (doc 08 §10).
