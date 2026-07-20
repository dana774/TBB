# 07 — Unresolved Placeholders and Items Requiring Dana's Approval

## Editorial decisions only Dana can make
1. **Historical media with Cataanda James** — 4 episode transcripts (and any embedded historical audio/video) contain co-host-era language:
   - `building-a-strong-brand-identity-insights-from-capsule-3-of-the-brand-blueprint-podcast`
   - `unveiling-beauty-brand-secrets-with-ylorie-taylor`
   - `building-your-brand-insights-from-the-build-a-brand-panel`
   - `the-brand-blueprint-build-a-brand-panel-segment-creating-a-standout-brand-in-haircare`
   Options: publish as-is with a neutral historical note, edit transcripts, or withhold those episodes. No replacement history has been fabricated; all current-host presentation, SEO and metadata already show Dana as sole host.
2. **$115M PepsiCo retail responsibility** — held in `DanaProfile` with status *"Pending final proof approval — do not publish as a verified claim."* Not used anywhere else. Needs Dana's proof sign-off before it appears on About or Speaking.
3. **Dana's insight blocks** on all 3 Founder Chapters — drafted, marked `[DRAFT — pending Dana's approval]`.
4. **Founder pull quotes** — placeholders; select verbatim quotes from episode audio.
5. **Capsule → Founder Chapter redirect mapping** (doc 04) — which legacy capsule maps to which chapter.
6. **Speaking past-engagement lists** (VGP) — placeholders; supply verified engagements only.
7. **VGP partner records** — 3 `[PLACEHOLDER]` archetypes; replace with real, approved partners + logo permissions, or hide the section at launch.

## Consent and rights gaps (blocking publication of specific records)
- Founder consent (`consentStory/Image/Metrics`) not recorded for Sruti Baz, Kanicka Joseph, Dr. Michelle Cromwell — records held at `editorial-review`.
- Founder photography, logos and galleries — none supplied (doc 05).
- Dana portrait — missing.

## Build items not yet done (and why)
| Item | Status | Blocker |
|---|---|---|
| Studio page composition (all Phase 1 templates) | Spec complete (doc 08) | No public Wix API for Studio editor content — editor session required |
| `/start` + `/founder-intake` pages and live intake URL | Forms built; pages pending | Same |
| Intake results routing logic (Velo) | Code spec in doc 08 §5 | Page must exist first |
| Episode chapter markers (timestamps) | 0/47 | Requires the actual media timings — cannot be invented from text |
| Per-episode OG images | Unset | Needs approved artwork template after design sign-off |
| Analytics events wiring | Naming + trigger map ready (doc 08 §8) | Fires from pages that don't exist yet |
| Desktop/tablet/mobile previews + intake-flow screenshots | Deferred | Produced from Studio preview once pages are built |
| Founder Network $99/month plan (Pricing Plans app) | App installed on BB; plan not created | Create only when Dana confirms staging pricing language |
| Members Area sign-in flows | App installed on BB | Configure with page build |

## Explicitly NOT done (guardrails honored)
- No live-site changes, no publishing, no redirect activation, no legacy content deletion.
- No new disconnected site created.
- JumpStart nowhere presented as signed/active.
- No private scheduling URL stored on-site anywhere.
