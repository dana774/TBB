# 35 — Founder Network (Shopify) member-delivery audit + launch checklist (2026-08-14)

Store: **the-brand-blueprint.myshopify.com** — still password-protected staging.
Scope: the gated Founder Network Resource Library on the Brand Blueprint Shopify
store (the member-facing delivery of the doc-27 handoff). Companion: doc 27
(`27-shopify-gating-handoff-prompt`).

## System status — verified working
| Component | State |
|---|---|
| Membership product | "Founder Network Membership" — ACTIVE, **$99**, published (real storefront URL) |
| Subscription/membership plan | Appstle plan attached to the product |
| Appstle Memberships app embed | Installed + **enabled** on the live Horizon theme (gating engine active) |
| Gating rule | Appstle Exclusive Access Control, URL-Path / Contains, set by Dana and tested on one page |
| Access/landing pages | `founder-network` (public hub), `membership` (public join + $99 CTA), `member-dashboard`, `resources` (library index) — **built 2026-08-14** with the seven-collection nav, access statement, and notices |
| Main navigation | Updated 2026-08-14 — added **Membership** and **Members' Library** entries |

## Gating map (what's public vs. locked)
- **Public:** `/pages/founder-network`, `/pages/membership`
- **Gated (member-only):** `/pages/member-capital-access`, `/pages/member-retail-readiness`,
  `/pages/member-sales-gtm`, `/pages/member-operations-forecasting`,
  `/pages/member-brand-messaging`, `/pages/member-growth-os-ai`,
  `/pages/member-partner-directory`, `/pages/member-dashboard`, `/pages/resources`
- Appstle method: URL Path · Match type: Contains · element hidden: `main` · Get-Membership button → `/pages/membership`.

## ⚠️ Biggest gap — 6 of 7 collections are empty (delivery agent action)
Only **Capital Access** (`member-capital-access`) is fully populated: 11 resources
(CAP-01…CAP-11) with format badges, journey callout, per-resource who/when/what
copy, download/watch buttons, notices, and footer. **It is the template.**

These **six collections still contain only a one-line intro + "New resources are
added here as they're published"** — no actual resources yet:

| Collection | Handle | Drive source folder (per doc 27) |
|---|---|---|
| Retail Readiness | `member-retail-readiness` | 02 · Retail Readiness |
| Sales & GTM | `member-sales-gtm` | 03 · Sales & GTM |
| Operations & Forecasting | `member-operations-forecasting` | 04 · Operations & Forecasting |
| Brand & Messaging | `member-brand-messaging` | 05 · Brand & Messaging |
| Growth OS & AI | `member-growth-os-ai` | 06 · Growth OS & AI |
| Partner Directory | `member-partner-directory` | 07 · Partner Directory |

**Delivery agent:** populate each of these six exactly as Capital Access was done —
pull the `BB_` files + the collection README ("What's in this collection") from the
Drive "Founder Network — Members" folder (`1ls2sHkPm9f-qtAhEiupuxhLk7TetWE0m`), keep
resource IDs (RET-/GTM-/OPS-/BRD-/GOS-/PTR-), use README copy verbatim, keep every
notice/disclaimer and the footer. A member paying $99 today finds only 1 of 7
collections filled — this is the launch blocker.

## Launch checklist — Dana's manual verification (browser + Appstle)
1. **Gating holds across all 9 handles** — open each gated page logged-out (incognito) and confirm the "members only" block + Get-Membership button (you tested one; finish the set).
2. **Public pages stay public** — `founder-network` and `membership` load for everyone.
3. **Members actually SEE content** — log in as an active member and confirm the resources render (not just that non-members are blocked). This is the half that's easy to miss.
4. **End-to-end purchase test** — buy the $99 plan (test mode or refunded card); confirm the buyer is tagged/granted membership and the gate unlocks. This is the true proof of the full chain (Appstle billing → membership → access).
5. **Resource-link integrity** — Capital Access downloads use Shopify CDN (good); **CAP-10 is a Google Drive video link** — confirm sharing so members can watch. Per doc 27, the 3 Market Signal videos should move to real site video hosting, not Drive.
6. **Keep the store password ON** until 1–5 pass and launch is approved.

## What I cannot verify from here (boundary)
Appstle's gating rules live inside the Appstle app, not the Shopify Admin API — so
items 1–4 above must be confirmed in-browser/in-Appstle by Dana; I can only confirm
the store-side substrate (pages, product, plan, theme embed, navigation).
