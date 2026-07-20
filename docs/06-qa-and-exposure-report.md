# 06 — QA and Private-Link Exposure Report

Run 2026-07-20 against both staging sites via the Wix Data REST API.

## Private-link exposure test — PASS

Method: every record of every collection with `read: ANYONE` on both staging sites was fetched and its full serialized data scanned for:

1. Any `calendly.com/...` URL other than the single approved `calendly.com/valugrowthpartners/vgp-insight-session`
2. Any mention of *Build in Tulsa*, *W.E. Build*, or *JumpStart*

**Result: 0 findings.** Zero unapproved Calendly URLs and zero private-program mentions exist in publicly queryable data on either site.

Supporting controls:
- `RestrictedRoutes` is `read: ADMIN` on both sites (not publicly queryable).
- Private active-client and sponsored-program scheduling URLs are **deliberately not stored anywhere on-site** — the RestrictedRoutes records for them document the policy but contain no URL.
- The approved public Calendly event appears in exactly two places: the BB RestrictedRoutes record `qualified_first_time_founder` (admin-only) and the VGP RestrictedRoutes record `vgp-insight-session` (admin-only). Public pages will reference it only via the post-qualification results logic.

Repeat this scan (plus published-page source and sitemap inspection) after the Studio pages are built and before any publish.

## Data QA — Episodes (47 records)
| Check | Result |
|---|---|
| `seriesHost` = "Dana Ammons" (sole host) | 47/47 PASS |
| Cataanda James in current-host contexts, summaries-as-host, SEO, OG | 0 remaining (1 `seoDescription` fixed this session) |
| Cataanda James in embedded historical transcripts | 4 records — **flagged, awaiting Dana's decision** (doc 07) |
| Descriptive alt text | 47/47 set (was 0/47); no filename-style alt |
| Slugs present | 47/47 |
| Hero image | 43/47 (4 missing — asset list) |
| Transcripts (substantive) | 35/47 |
| Chapter markers | 0/47 — build item, see doc 07 |
| Status | 44 Published-ready, 3 editorial-review |

## Data QA — Founders (3 records)
| Check | Result |
|---|---|
| `relatedEpisodeSlug` resolves to a real episode | 3/3 PASS (2 repaired this session) |
| Editorial depth (narrative, problem, turning points, milestones, insight, lesson) | 3/3 populated |
| Pull quote | 3/3 explicit placeholders — must be verbatim from audio, not invented |
| Consent recorded | 0/3 — **blocking publish**, status correctly `editorial-review` |
| Portrait / gallery | 0/3 — asset list |

## Forms QA
All four forms verified created, enabled, spam-protected (ADVANCED), with CRM upsert and labels:
- BB Founder Intake — 11 fields, both qualification questions present as required radios
- BB Podcast Guest Application — 9 fields
- VGP Institutional Inquiry — 9 fields
- VGP Partner & Contributor Inquiry — 8 fields

End-to-end submission → contact → label → routing test can only run once the pages embedding these forms exist in Studio (doc 08); screenshots of the intake-to-fit-call flow are deferred to that point.

## Founder-intake URL status
Per instruction, no final intake URL is claimed: **the `/start` and `/founder-intake` pages do not yet exist** (Studio editor build). The form that powers `/founder-intake` exists and is verified (ID `ce3bdc89-a89d-4bda-9c36-484810e99c40`). The actual staging URL will be reported when the page is created, tested and visible in staging preview.

## Environment limits encountered
- The visual reference (`brand-blueprint-vgp.dana51503.chatgpt.site`) and the live legacy sites are not fetchable from this sandboxed environment (network policy). Design direction was implemented from the written design contract; legacy content was available via the already-migrated CMS data.
- Wix exposes no public API for Studio page composition; desktop/tablet/mobile visual previews therefore cannot be produced from here and are delivered as the doc 08 build spec instead.
