# 12 — VGP QA, Calendly Exposure Audit, and Items Requiring Dana's Approval

## Public/private Calendly exposure audit (2026-07-20, post-handoff re-run) — PASS

Every record of every publicly readable collection on **both** staging sites was re-scanned after the new seeds (Capabilities, DanaProfile mirror, cross-brand route, client-resources) for:
- Any `calendly.com` URL other than the approved `calendly.com/valugrowthpartners/vgp-insight-session`
- Build in Tulsa / W.E. Build / JumpStart mentions
- Leakage of the `{{SHOPIFY_BRAND_BLUEPRINT_URL}}` placeholder into public data

**Genuine findings: 0.** One false positive (the English phrase "We build…" in a capability paragraph matched the W.E. Build pattern) was reworded so future automated audits stay clean.

Verified collection read permissions:
- VGP public (ANYONE): Capabilities, CaseStudies, DanaProfile, Insights, Partners, Programs, Speaking
- VGP private (ADMIN): ClientResources, RestrictedRoutes, FormSubmissions
- BB parked public (ANYONE): content collections as documented; private (ADMIN): RestrictedRoutes, FormSubmissions, SiteStatus

The Shopify placeholder token exists only in one admin-read RestrictedRoutes record and in this repo — never in public data. The general Calendly landing page appears nowhere. Podcast booking remains invitation-only. Partner scheduling is contextual, not a founder default CTA.

## SEO / analytics / accessibility / mobile QA — data layer
| Area | State |
|---|---|
| SEO fields on all seeded VGP records (title, description, canonical domain, slug) | ✅ Complete; unique per record |
| One-H1, OG, canonical tags, schema markup | Page-level — applied at Studio build per doc 08 §9 gate |
| Analytics events | Named + mapped (doc 10); wiring at page build; no analytics on private scheduling |
| Accessibility (WCAG 2.2 AA) | Token system passes contrast (doc 08); page-level checks (keyboard, focus, forms, reduced motion) at Studio build |
| Mobile QA (1440/1024/390) | At Studio build — no pages exist yet to test |
| Alt text discipline | All seeded records carry descriptive or explicitly labeled placeholder alt text |

## Items requiring Dana's approval
1. **Manual rename** of `Bb Staging 2026` in My Sites to carry the PARKED label (internal label record already stored on-site).
2. **Cross-brand founder route behavior** on VGP pages until Shopify URL exists: hide the section vs. descriptive copy without a link.
3. **VGP Speaking past engagements** — supply verified list; placeholders remain until then.
4. **VGP Partner records** — replace `[PLACEHOLDER]` archetypes with approved partners + logo permissions, or hide at launch.
5. **$115M PepsiCo claim** — proof approval before it appears on either brand's About/Speaking.
6. **Members Area on VGP** for protected active-client resources — approve installing/configuring the free Members Area app and per-client roles at page build (collection is ready, admin-only).
7. **Insights articles** (3) — editorial sign-off (status `editorial-review`).
8. **Capabilities copy** (6 records) — editorial sign-off.
9. **All Phase-1 BB items** in doc 07 transfer to the Shopify workstream (historical transcripts, founder consent, pull quotes, photography).
10. **Shopify prototype kickoff** — store provisioning, Appstle install, and the migration map in doc 09 §12 await Dana's go-ahead; nothing has been created in Shopify.

**Stop point honored:** nothing published on either staging site; live sites untouched; Dana remains final publisher and rollback owner.
