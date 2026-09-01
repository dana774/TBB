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
| [docs/09-shopify-phase1-plan.md](docs/09-shopify-phase1-plan.md) | Shopify Phase 1 build plan (BB moves to Shopify; theme in [`theme/`](theme/)) |
| [docs/10-vgp-change-list-and-cta-map.md](docs/10-vgp-change-list-and-cta-map.md) | VGP change list, final CTA map, cross-domain route spec (Shopify placeholder, internal only) |
| [docs/10-phase1-wrapup.md](docs/10-phase1-wrapup.md) | Phase 1 wrap-up: Flow workflow specs, acceptance-test report, handoff items |
| [docs/11-crm-billing-ownership-and-handoff-spec.md](docs/11-crm-billing-ownership-and-handoff-spec.md) | CRM/billing systems of record, cross-brand handoff fields, duplicate-billing prevention |
| [docs/11-phase2-deployment.md](docs/11-phase2-deployment.md) | Phase 2 deployment record: remaining BB pages, templates, and `partner` metaobject |
| [docs/12-vgp-qa-and-approvals.md](docs/12-vgp-qa-and-approvals.md) | Post-handoff exposure audit, QA state, items requiring Dana's approval |
| [docs/12-flow-workflow-runbook.md](docs/12-flow-workflow-runbook.md) | Click-by-click operator guide to build the three (disabled) Shopify Flow workflows |
| [docs/13-shopify-prototype-status.md](docs/13-shopify-prototype-status.md) | Shopify store state, what's done/blocked, execution runbook |
| [docs/13-vgp-phase3-build-spec.md](docs/13-vgp-phase3-build-spec.md) | Phase 3: VGP institutional site Studio build spec (Wix), the doc 08 analog for VGP |
| [docs/14-round1-decisions-log.md](docs/14-round1-decisions-log.md) | Round 1 editorial decisions (withheld episodes, claim reframe, lineup swap, consent) |
| [docs/14-vgp-studio-build-detailed.md](docs/14-vgp-studio-build-detailed.md) | Phase 3: section-by-section VGP Studio editor build (executable companion to doc 13) |
| [docs/15-migration-execution-log.md](docs/15-migration-execution-log.md) | **Shopify migration EXECUTED** — 41 episodes + rest created; skeletons updated in place |
| [docs/15-store-preferences-checklist.md](docs/15-store-preferences-checklist.md) | Shopify Preferences review + approved homepage SEO values |
| [docs/16-launch-readiness-package.md](docs/16-launch-readiness-package.md) | **Consolidated launch-readiness package** (18 sections, both platforms) |
| [docs/17-dana-final-actions.md](docs/17-dana-final-actions.md) | Short list: only items needing Dana's owner/legal/financial/browser/publish authority |
| [docs/18-vgp-velo-enablement-and-backend.md](docs/18-vgp-velo-enablement-and-backend.md) | Velo backend + Advisory Pathway Intake form (created via API) for VGP advisory-pathway |
| [docs/19-vgp-studio-design-system-setup.md](docs/19-vgp-studio-design-system-setup.md) | VGP Wix Studio Global Styles input sheet (colors, text themes, buttons, spacing) |
| [docs/20-vgp-headless-build.md](docs/20-vgp-headless-build.md) | **VGP headless build** — decision, status, guardrail proof (code in [`vgp-headless/`](vgp-headless/)) |
| [docs/21-vgp-go-forward-architecture.md](docs/21-vgp-go-forward-architecture.md) | **Wix-free / HubSpot-centric plan** — stack, HubSpot lead capture (built), Dana's migration steps |
| [docs/34-founder-resource-directory-exposure.md](docs/34-founder-resource-directory-exposure.md) | **Founder Resource Directory exposure decision** — stays gated on Brand Blueprint (Shopify); not public on VGP; verification + data-preservation record |
| [docs/35-founder-network-shopify-launch-audit.md](docs/35-founder-network-shopify-launch-audit.md) | **Founder Network Shopify member-delivery audit + launch checklist** — gating verified, 6 collections still to populate, Dana's test list |
| [shopify-migration/](shopify-migration/README.md) | Migration package: episodes + founders + signals/resources/events/funding + Dana profile payloads |

> **Note:** the `docs/` index above carries two overlapping numbering schemes (09–21 appear twice) after consolidating the staging-rebuild and referral-partner branches. All files are preserved; the numbering can be reconciled in a later cleanup pass.

## Platform decision (2026-07-20 handoff)

The Brand Blueprint will be prototyped as a native **Shopify Online Store 2.0** site (membership/protected-resource/merchandise model via Appstle). **`Bb Staging 2026` is PARKED** as a complete unpublished backup — labeled on-site, verified inactive (0 pricing plans, no automations, no redirects), nothing deleted. **VGP remains on Wix** and its staging build continues. Docs 09–12 govern the hybrid architecture.

## What can and cannot be done via API

Wix exposes CMS collections, data items, forms, CRM, apps and SEO settings via its REST APIs — all of that work is **done** and verified on the staging sites. **Page composition in the Studio editor (sections, layout, typography, theme styles) has no public API** and must be assembled in the Studio editor following [docs/08-studio-build-spec.md](docs/08-studio-build-spec.md). Every data source, form and route that the pages bind to is already in place.
