# 04 — Redirect Matrix (PROPOSED — NOT ACTIVATED)

**Status: draft for Dana's approval. No redirect has been created or activated anywhere.** Redirects are applied only after staging approval, at cutover, on the live domains.

## thebrandblueprint.biz

| Legacy URL | Proposed target | Type | Notes |
|---|---|---|---|
| `/` | `/` (new homepage) | — | Same URL, new page; no redirect needed |
| `/capsule-1` | `/founders/{chapter-slug}` | 301 | Capsule 1 → its Founder Chapter. **Mapping to be confirmed by Dana** (which founder/episode Capsule 1 features) |
| `/capsule3` | `/founders/{chapter-slug}` | 301 | Same — note legacy inconsistent naming (`capsule-1` vs `capsule3`) |
| `/capsule-N` (all others) | `/founders/{chapter-slug}` or `/podcast/{episode-slug}` | 301 | Full legacy URL inventory must be pulled from the live site's sitemap at cutover; this environment cannot crawl the live domain |
| Legacy blog post URLs | `/podcast/{episode-slug}` | 301 | 47 episodes already migrated with slugs preserved where they existed; verify slug-for-slug identity before redirecting — identical slugs need no redirect |
| Any removed page | Closest surviving section page | 301 | Never redirect everything to the homepage |

## valugrowthpartners.com

| Legacy URL | Proposed target | Type | Notes |
|---|---|---|---|
| `/` | `/` (new homepage) | — | Same URL |
| Legacy service pages | `/capabilities/...` | 301 | Confirm final capability slugs after Phase 3 |
| Legacy booking page (if publicly linked) | `/advisory-pathway` | 301 | Ensures old links route through qualification, not straight to Calendly |

## Rules
1. Preserve established URLs wherever content survives at the same path — a redirect is a fallback, not a default.
2. Meaningful published dates and search equity are preserved: episode records keep original `publishDate`; canonical URLs stay on the original domain until cutover.
3. Redirect activation happens in the live site's SEO settings **only after** Dana signs off the staging experience, and is reversible (keep this matrix as the rollback record).
4. Before activation: export the live sitemaps, diff against this matrix, and close any gaps.
