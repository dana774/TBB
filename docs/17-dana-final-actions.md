# 17 — Dana Final Actions

The short list: only items that genuinely require **account-owner, legal, financial, browser, or publication authority**. Everything else is built and in the repo/staging. Full detail: doc 16.

## A. Browser & visual approval (browser authority)
1. Open the preview (`the-brand-blueprint.myshopify.com/?preview_theme_id=154677215286`, password `ucleax`) and capture the screenshot set at 390/768/1024/1440 (doc 16 §4). *The sandbox is network-blocked from the store, so this must be done from a real browser.*
2. Give explicit visual/design approval per view. Absence of screenshots is **not** approval.

## B. Content, claims & consent (owner + legal authority)
3. Approve or revise each item in the content register (doc 16 §11) — pricing language, membership benefits, legal copy.
4. Record founder story/image/metrics **consent** for the 3 seeded founders (or keep them unpublished).
5. Decide the co-host-era historical media (4 episodes, doc 07 §1). Current metadata already shows Dana as **sole creator/founder/host** — do not restore co-host language.
6. Approve the **$115M PepsiCo** claim with proof, or leave it excluded.
7. Supply images/rights: founder photography + logos, Dana portrait, 1200×628 social image, per-episode OG art (doc 16 §12).

## C. SEO paste (owner authority; not API-exposed)
8. Paste homepage title `The Brand Blueprint | Build a Shelf-Ready Brand` and the approved meta description (doc 15) in Online Store → Preferences. *Marked Dana manual action, not a development defect.*

## D. Financial / membership (financial authority)
9. Approve Founder Network pricing + decide membership **billing go-live** (Appstle). Until then, no billing is activated.
10. Confirm the billing boundary: existing VGP subscriptions stay in Wix (never imported/rebilled in Shopify); new BB memberships bill in Shopify/Appstle (doc 16 §10).

## E. Shopify Flow (owner authority; test before activate)
11. Build the 16 workflows in the Flow editor per doc 12; **test each**, then activate one at a time. Leave all inactive until tested.

## F. VGP Phase 3 (owner authority; editor session)
12. Compose the VGP pages in Wix Studio following docs 13–14 (no API for this), then test. **Specification is complete; the Wix pages are not yet built.** Do not modify or publish the live VGP site. Do not present JumpStart as signed/active.

## G. Publication & cutover (publication authority — DO NOT let anyone do these early)
13. Authorize theme publish (replaces Horizon).
14. Remove storefront password; confirm index state.
15. Connect/redirect `TheBrandBlueprint.biz`; activate the redirect matrix (doc 04). *Currently untouched.*
16. Run the launch-day sequence + post-launch monitoring (doc 16 §17–18).

## Standing guardrails (unchanged)
Keep the storefront password ON and noindex while staging · keep hCaptcha ON · do not connect/redirect the live domain · do not publish the theme, activate memberships, start billing, or expose private scheduling links · the only public Calendly is the post-qualification `vgp-insight-session`; the general Calendly page is never published.
