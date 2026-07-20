# 13 — Shopify Prototype Status (the-brand-blueprint.myshopify.com)

Store confirmed 2026-07-20: **"The Brand Blueprint"**, `the-brand-blueprint.myshopify.com`, Dana's account (dana@valugrowthpartners.com), Basic plan, USD.

## Verified store state
| Layer | State |
|---|---|
| Pages | 12 built: start, founder-intake, intake-next-steps, founders, podcast, about, membership, member-dashboard, retail-readiness-checklist, buyer-pitch-deck-template, contact, privacy choices |
| Metaobject definitions | 7 built: episode, founder_chapter, signal, resource, event, funding_opportunity, dana_profile — field schemas verified and aligned with the Wix collections |
| Metaobject entries | **0 — content migration is the outstanding work** |
| Blog | Default "News" only (content strategy uses metaobjects + pages, so no blog migration needed) |
| Products | 0 (membership product waits on Appstle install + Dana's launch approval) |
| Apps | Appstle Memberships **not installed** (manual App Store install required) |

## Done this session
- `episode.publish_date` (date) field added to the episode definition — original publish dates from thebrandblueprint.biz are preserved in migration, protecting search equity and archive ordering.
- Shopify staging URL recorded in the VGP internal RestrictedRoutes record (admin-only), replacing the `{{SHOPIFY_BRAND_BLUEPRINT_URL}}` placeholder. Still **not** linked from any public page — Dana approves public linking.
- Complete migration package staged in [`shopify-migration/`](../shopify-migration/README.md): all 47 episodes, 3 Founder Chapters (with rich-text content and consent gates), 3 signals, 3 resources, 3 events, 2 verified funding opportunities, and the Dana profile — every payload schema-validated against the Admin API.

## Blocked and why
Shopify Admin **mutations require host-app approval** that this non-interactive session cannot grant (the publish_date change went through before the approval gate appeared; every subsequent mutation attempt returned "requires approval"). Reads work. The migration is therefore staged, not executed.

## To execute the migration (next interactive session, ~30 minutes)
1. Open the session where Shopify tool approvals can be granted (or run the payloads via any Admin API client with `write_metaobjects`).
2. Run `metaobjectCreate` for `shopify-migration/episodes.json` (47), then `founders.json` (3) + link `related_episode` GIDs, then `signals-resources-events-funding.json`, then `dana-profile.json` — order and the exact mutation are in the package README.
3. Bulk-export transcripts from the parked Wix Episodes collection and attach via `metaobjectUpdate`.
4. Install **Appstle Memberships** from the App Store (manual) — then, on Dana's launch approval only, create the $99 Founder Network membership product.

## Standing guardrails
- Live thebrandblueprint.biz untouched; no DNS/redirect work until the approved cutover plan exists.
- Wix Bb Staging 2026 remains the parked fallback; nothing on it altered post-parking (the only Wix change this session was the VGP internal route record).
- Dana is final publisher; the myshopify.com store stays password-protected until launch approval.
