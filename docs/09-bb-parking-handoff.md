# 09 — Bb Staging 2026 Parking Handoff (Shopify prototype in progress)

**Status: PARKED BACKUP - BRAND BLUEPRINT SHOPIFY PROTOTYPE IN PROGRESS - DO NOT PUBLISH**

The label above is stored on the site itself in an admin-only `SiteStatus` collection (record `d539daf8-99c5-4545-a308-0af6f342f6cc`) with the full do-not list and effective date 2026-07-20.
**One manual step for Dana (10 seconds):** the site display name in [My Sites](https://manage.wix.com/account/sites) should also be renamed to carry the label (e.g. `Bb Staging 2026 — PARKED — DO NOT PUBLISH`); the rename endpoint was not reachable from this session.

## Parked-state verification (2026-07-20)
| Guard | State |
|---|---|
| Published | No — site is Draft, never published |
| Domain connection | None — thebrandblueprint.biz still points at the live legacy site |
| Pricing Plans / paid memberships | **0 plans exist**; app installed but inactive |
| Checkout / payments | Not configured |
| Email automations | None created (forms only upsert CRM contacts — no email sends) |
| Redirects | None created |
| Paid apps added | None (only the free Wix Forms app was added, pre-parking, to enable the intake form) |
| Staging URL exposure | Not in any public navigation/search; site is unpublished |
| Content deleted or rewritten post-parking | None — everything preserved as fallback |

## 1. Page inventory
Studio page composition was never built via API (no public API exists); the parked site's page state is whatever exists in the Studio editor. The **intended** page architecture is fully specified in docs/08-studio-build-spec.md and the required-experience list; the CMS/data/forms layer below is complete and is the substance of the backup.

## 2. CTA inventory
See docs/02-cta-inventory.md (Brand Blueprint table) — carried over unchanged as the parked design intent and reusable as the Shopify IA/CTA blueprint.

## 3. CMS collection schemas and permissions
See docs/03-cms-schema-permissions.md, plus this parking addition:
- `SiteStatus` (read ADMIN) — parking label and guard list.
Verified read permissions at parking time: Episodes/Founders/Signals/Resources/Events/Funding/Partners/CaseStudies/Programs/Speaking/DanaProfile = ANYONE; RestrictedRoutes/FormSubmissions/SiteStatus = ADMIN.

## 4. Form and automation inventory
| Form | ID | Automations |
|---|---|---|
| Founder Intake | `ce3bdc89-a89d-4bda-9c36-484810e99c40` | CRM upsert + label `custom.founder-intake` only. No emails. |
| Podcast Guest Application | `56acacdc-33ec-40ab-b218-e854bf843138` | CRM upsert + label `custom.podcast-guest-applicant` only. No emails. |

No other automations exist. Nothing fires founder-facing email.

## 5. Installed-app inventory
Promote SEO · Wix Forms & Payments · Wix Forms (free; added for intake form) · Wix Invoices · Wix Members Area · Wix Pricing Plans (inactive, 0 plans) · Velo enabled.

## 6. Route and redirect proposal
docs/04-redirect-matrix.md — still proposed-only, now **frozen**: any future redirect work belongs to the Shopify cutover plan, which requires its own approved DNS/redirect/analytics/rollback plan.

## 7. Asset and image inventory
- Episode hero images: 43 of 47 records (missing: `the-brand-blueprint-podcast-resource-capsule-market-research-and-analysis`, `sruti-baz-scaling-moumas`, `funding-friday-capital-readiness`, `ai-shopping-moving-to-the-cart`).
- Founder portraits/galleries: 0 of 3 (placeholder-labeled).
- Dana portrait: missing.
- Full request list with crop ratios: docs/05-asset-request-list.md.
- All uploaded media remains in the site's Media Manager untouched.

## 8. SEO title / description / canonical / slug inventory
47 episode slugs with publish dates and flag map (status P=published-ready, R=editorial-review | hero | transcript | seoTitle | seoDescription):

```
funding-friday-3-funding-paths-kiva-sba-shopify-capital        2026-06-12 P 1|0|1|1
dr-j-montana-cain-evaluation-as-strategy                       2026-06-11 P 1|0|1|1
funding-friday-att-famous-amos-founders-first-pride-fund       2026-05-22 P 1|0|1|1
market-signal-discovery-is-becoming-data-infrastructure        2026-05-19 P 1|0|1|1
kanicka-joseph-k-and-k-smiles                                  2026-05-19 P 1|0|1|1
funding-friday-women-founder-opportunities-reward-preparation  2026-05-08 P 1|0|1|1
tariffs-are-a-brand-strategy-problem                           2026-04-27 P 1|0|1|1
funding-friday-3-bigger-window-opportunities-women-founders    2026-04-27 P 1|0|1|1
dr-michelle-cromwell-soeur-du-sol                              2026-04-24 P 1|0|1|1
happy-new-year-2026-seedspot-special-from-dakar-to-u-s-shelves-with-victorine-sarr-lyvv-maiso 2026-01-23 P 1|1|1|1
empowering-athletes-with-nil-the-magic-cleats-story            2025-03-07 P 1|1|1|1
the-brand-blueprint-mastering-global-markets-strategic-insights-with-sylvia-lin 2025-03-02 P 1|1|1|1
the-brand-blueprint-revolutionizing-personal-branding-for-founders-with-natalie-weakly 2025-02-24 P 1|1|1|1
revolutionizing-personal-branding-with-ai-insights-from-trish-lindo 2025-02-19 P 1|1|1|1
the-brand-blueprint-mastering-product-development-insights-from-desi-the-glam-scientist 2025-02-19 P 1|1|1|1
the-brand-blueprint-capsule-5-demystifying-marketing-roi-and-strategic-brand-growth 2025-02-19 P 1|1|1|1
the-brand-blueprint-mastering-inclusive-marketing-strategies-and-insights-with-devoreaux-walton 2025-02-19 P 1|1|1|1
the-brand-blueprint-navigating-tax-season-and-building-wealth-insights-from-patrice-malloy-the 2025-01-28 P 1|1|1|1
the-brand-blueprint-navigating-product-development-a-deep-dive-into-the-ordinary-s-triumph-and-s 2025-01-24 P 1|1|1|1
the-brand-blueprint-leveraging-linkedin-for-brand-success-expert-strategies-with-trish-lindo 2025-01-21 P 1|1|1|1
navigating-non-alcoholic-spirits-in-dry-january-with-phil-irvine 2025-01-14 P 1|1|1|1
blog-post-capsule-4-brand-development-and-product-strategy     2025-01-06 P 1|1|1|1
building-a-strong-brand-identity-insights-from-capsule-3-of-the-brand-blueprint-podcast 2024-12-18 P 1|1|1|1
mastering-visual-brand-identity-essential-tips-for-entrepreneurs 2024-12-03 P 1|1|1|1
unveiling-beauty-brand-secrets-with-ylorie-taylor              2024-11-18 P 1|1|1|1
the-brand-blueprint-case-study-apple-vs-blackberry-a-tale-of-two-brand-identities 2024-11-13 P 1|1|1|1
fashioning-a-cultural-tapestry-the-story-of-mapate-diop-and-diop-clothing 2024-10-26 P 1|1|1|1
building-brand-identity-and-positioning-insights-from-the-brand-blueprint 2024-10-23 P 1|1|1|1
the-brand-blueprint-podcast-resource-capsule-market-research-and-analysis 2024-10-18 P 0|1|1|1
positioning-your-brand-in-a-saturated-market                   2024-10-18 P 1|1|1|1
building-your-brand-insights-from-the-build-a-brand-panel      2024-10-14 P 1|1|1|1
the-brand-blueprint-blog-power-up-your-brand-with-these-essential-market-research-tools 2024-10-11 P 1|1|1|1
the-unstoppable-force-kathleen-lanoix-s-journey                2024-10-01 P 1|1|1|1
unlocking-the-power-of-market-research-and-consumer-insights-for-your-brand 2024-09-27 P 1|1|1|1
the-build-a-brand-segment-market-research-tools                2024-09-23 P 1|1|1|1
unleashing-entrepreneurial-success-the-bold-story-of-jacob-guss-and-bold-move-beverages 2024-09-17 P 1|1|1|1
innovating-the-beauty-industry-an-in-depth-interview-with-dwan-white 2024-09-11 P 1|1|1|1
the-importance-of-market-research-and-consumer-insights-in-brand-creation 2024-08-27 P 1|1|1|1
vision-persistence-and-pivoting-in-brand-building-insights-from-aisha-crump 2024-08-27 P 1|1|1|1
from-idea-to-reality-the-inspiring-journey-of-daniel-victor-and-hid-sips 2024-08-27 P 1|1|1|1
the-brand-blueprint-build-a-brand-panel-segment-creating-a-standout-brand-in-haircare 2024-08-16 P 1|1|1|1
the-brand-blueprint-blog-capsule-one-resources-essential-resources-for-crafting-your-brand-vision 2024-08-02 P 1|1|1|1
the-brand-blueprint-blog-ai-tools-and-tips-for-crafting-your-brand-vision 2024-07-30 P 1|1|1|1
the-brand-blueprint-blog-establishing-your-brand-vision-essential-steps-for-aspiring-founders 2024-07-30 P 1|1|1|1
sruti-baz-scaling-moumas                                       2026-07-08 R 0|0|0|0
funding-friday-capital-readiness                               2026-07-10 R 0|0|0|0
ai-shopping-moving-to-the-cart                                 2026-06-29 R 0|0|0|0
```

Other collections (slug | status): Founders — `sruti-baz-moumas`, `kanicka-joseph-kk-smiles`, `michelle-cromwell-soeur-du-sol` (all editorial-review). Signals — `retail-readiness-operating-discipline`, `margin-pressure-changing-growth-plans`, `ai-shopping-moving-to-cart`. Resources — `retail-readiness-blueprint-executive-guide`, `retail-buyer-outreach-playbook`, `founder-growth-operating-system-governance-blueprint`. Events — `cpg-cash-flow-management-seminar-july-2026`, `funding-friday-weekly-opportunity-brief`, `founder-network-orientation`. Funding — `founder-funding-opportunity-verification-queue`, `shophand-boost-grant`, `nase-growth-grants`. Partners — `value-growth-partners`, `sengo`, `nudge`.

Canonical domain on all records: `thebrandblueprint.biz`. Original publish dates preserved throughout — this is the search-equity map for the Shopify migration.

## 9. Analytics-event inventory
Named but **not wired** (no pages exist to fire them): `founder_intake_start`, `founder_intake_submit`, `brand_blueprint_fit_call_click`, `institutional_inquiry_submit`, `partner_intro_click`, `podcast_application_submit`, `podcast_booking_click`, `route_select`, `cross_domain_route`, `assisted_conversion`. Reuse these exact names in Shopify (GA4) for continuity.

## 10. Unresolved placeholders
docs/07-unresolved-and-approvals.md — all items remain open and transfer to the Shopify workstream (historical-transcript decision, $115M proof, founder consent, pull quotes, photography, chapter markers).

## 11. Preview screenshots
Not producible: the site has no built pages to screenshot and this environment has no access to Studio preview. The CMS/data layer (this document + repo docs) is the parked record.

## 12. Shopify content/migration map

| Wix source | Records | Shopify 2.0 target | Notes |
|---|---|---|---|
| Episodes | 47 | Blog posts (podcast blog) or `episode` metaobject + templated pages | Keep slugs where possible; original publish dates; transcripts live in Wix CMS — export per-record via Wix CMS export before build |
| Founders | 3 | `founder_chapter` metaobject + dedicated template | Full field map already defined (docs/03); consent gates before publish |
| Signals | 3 | Blog category "Signals" or metaobject | Market Signal / Funding Friday as tags |
| Resources | 3 | Digital products (protected) + public pages; member gating via **Appstle Memberships** | `accessLevel` field maps to member tier |
| Events | 3 | Pages/metaobject (or app) | |
| Funding | 3 | Blog category or metaobject with deadline field | |
| Partners | 3 | Metaobject + page | |
| DanaProfile | 1 | About page content + `person` metaobject | $115M claim stays out pending proof |
| Founder Network $99/mo | not built in Wix (by design) | **Shopify + Appstle**: membership product, tier, recurring billing, dunning, protected access | System of record per handoff rules |
| Forms (intake/guest) | 2 | Shopify forms/app + qualification logic | Same questions, labels → Shopify customer tags; same routing outcomes |
| RestrictedRoutes | 4 | **Do not migrate URLs**; recreate governance doc internally | Private links never enter Shopify content either |
| Wix CRM contacts (BB labels) | — | Shopify Customers with matching tags | Per CRM ownership rules in docs/11 |

**Post-parking rule honored:** nothing on the parked site will be silently corrected or activated after this handoff.
