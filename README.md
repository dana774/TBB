# Brand Blueprint + VGP — Staging Rebuild Working Repository

Working documentation for the revision of the two Wix Studio staging sites:

| Site | Wix Site ID | Dashboard |
|---|---|---|
| **Bb Staging 2026** | `a7642a66-cb39-4be6-9517-9ebf10b70906` | https://manage.wix.com/dashboard/a7642a66-cb39-4be6-9517-9ebf10b70906/home |
| **Vgp Staging 2026** | `6b5d8f63-fc66-449d-8c07-2d826ef21d2d` | https://manage.wix.com/dashboard/6b5d8f63-fc66-449d-8c07-2d826ef21d2d/home |

Live domains (`thebrandblueprint.biz`, `valugrowthpartners.com`) were **not modified**. No redirects were activated. Nothing was published. Dana Ammons is the final publisher and rollback owner.

## Contents

| Doc | Purpose |
|---|---|
| [docs/01-change-list.md](docs/01-change-list.md) | Page-by-page / collection-by-collection change list from this work session |
| [docs/02-cta-inventory.md](docs/02-cta-inventory.md) | CTA inventory and destination map for both sites |
| [docs/03-cms-schema-permissions.md](docs/03-cms-schema-permissions.md) | CMS schema and permission report |
| [docs/04-redirect-matrix.md](docs/04-redirect-matrix.md) | Proposed redirect matrix — **NOT activated** |
| [docs/05-asset-request-list.md](docs/05-asset-request-list.md) | Image/asset request list with crop ratios |
| [docs/06-qa-and-exposure-report.md](docs/06-qa-and-exposure-report.md) | Data QA results and private-link exposure test |
| [docs/07-unresolved-and-approvals.md](docs/07-unresolved-and-approvals.md) | Unresolved placeholders and items requiring Dana's approval |
| [docs/08-studio-build-spec.md](docs/08-studio-build-spec.md) | Design contract + section-by-section Studio editor build spec (Phase 1 templates) |
| [docs/09-bb-parking-handoff.md](docs/09-bb-parking-handoff.md) | **BB parking handoff** — parked-state verification, full inventories, Shopify migration map |
| [docs/10-vgp-change-list-and-cta-map.md](docs/10-vgp-change-list-and-cta-map.md) | VGP change list, final CTA map, cross-domain route spec (Shopify placeholder, internal only) |
| [docs/11-crm-billing-ownership-and-handoff-spec.md](docs/11-crm-billing-ownership-and-handoff-spec.md) | CRM/billing systems of record, cross-brand handoff fields, duplicate-billing prevention |
| [docs/12-vgp-qa-and-approvals.md](docs/12-vgp-qa-and-approvals.md) | Post-handoff exposure audit, QA state, items requiring Dana's approval |
| [docs/13-shopify-prototype-status.md](docs/13-shopify-prototype-status.md) | Shopify store state, what's done/blocked, execution runbook |
| [shopify-migration/](shopify-migration/README.md) | Migration package: episodes + founders + signals/resources/events/funding + Dana profile payloads |
| [docs/14-round1-decisions-log.md](docs/14-round1-decisions-log.md) | Round 1 editorial decisions (withheld episodes, claim reframe, lineup swap, consent) |
| [docs/15-migration-execution-log.md](docs/15-migration-execution-log.md) | **Shopify migration EXECUTED** — 41 episodes + rest created; skeletons updated in place |
| [docs/16-hubspot-marketing-stack-and-tracking.md](docs/16-hubspot-marketing-stack-and-tracking.md) | HubSpot role & boundary, email ownership (Klaviyo=BB / HubSpot=VGP), tracking-code install + headless (Vercel/Next.js) pageview spec |

## Platform decision (2026-07-20 handoff)

The Brand Blueprint will be prototyped as a native **Shopify Online Store 2.0** site (membership/protected-resource/merchandise model via Appstle). **`Bb Staging 2026` is PARKED** as a complete unpublished backup — labeled on-site, verified inactive (0 pricing plans, no automations, no redirects), nothing deleted. **VGP remains on Wix** and its staging build continues. Docs 09–12 govern the hybrid architecture.

## What can and cannot be done via API

Wix exposes CMS collections, data items, forms, CRM, apps and SEO settings via its REST APIs — all of that work is **done** and verified on the staging sites. **Page composition in the Studio editor (sections, layout, typography, theme styles) has no public API** and must be assembled in the Studio editor following [docs/08-studio-build-spec.md](docs/08-studio-build-spec.md). Every data source, form and route that the pages bind to is already in place.
