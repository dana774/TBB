# 03 — CMS Schema and Permission Report

Verified live against both staging sites on 2026-07-20 via the Wix Data REST API.

## Bb Staging 2026 — custom collections

| Collection | Records | Read | Write | Notes |
|---|---|---|---|---|
| Founders | 3 | ANYONE | ADMIN | Founder Chapter template source. Full editorial fields incl. consent (`consentStory/Image/Metrics`), rights, SEO, crop notes, `relatedEpisodeSlug`, `investorVisible`, `hotListStatus` |
| Episodes | 47 | ANYONE | ADMIN | Full archive migrated from live site. `seriesHost`, historical-review flags, transcripts (35 records), SEO fields. `chapterMarkers` empty (see doc 07) |
| Signals | 3 | ANYONE | ADMIN | signalType / summary / implication / founderActions / verificationSource |
| Resources | 3 | ANYONE | ADMIN | `collection` field = one of the nine library collections; `accessLevel` public vs member |
| Events | 3 | ANYONE | ADMIN | eventDate, registrationUrl, eligibility, followUpRoute |
| Funding | 3 | ANYONE | ADMIN | opportunityType, amountRange, deadline, verifiedBy, fitGuidance |
| Partners | 3 | ANYONE | ADMIN | partnerType, tier, disclosure, logoPermissionRef |
| CaseStudies | 0 | ANYONE | ADMIN | **Reserved** — case studies live on VGP; keep empty or mirror approved VGP records only |
| Programs | 0 | ANYONE | ADMIN | **Reserved** — programs are a VGP page type |
| Speaking | 0 | ANYONE | ADMIN | **Reserved** — speaking is a VGP page type |
| DanaProfile | 1 | ANYONE | ADMIN | Bio, philosophy, timeline present; portrait missing; PepsiCo claim held as *pending proof* |
| RestrictedRoutes | 4 | **ADMIN** | ADMIN | Correctly private. Only `qualified_first_time_founder` has `publicExposureAllowed=true` (→ vgp-insight-session) |
| FormSubmissions | 0 | **ADMIN** (insert ANYONE) | ADMIN | Legacy generic collection — superseded by Wix-native forms + CRM; keep as backup sink only |

## Vgp Staging 2026 — custom collections

| Collection | Records | Read | Write | Notes |
|---|---|---|---|---|
| Insights | 3 | ANYONE | ADMIN | Seeded this session (editorial-review) |
| CaseStudies | 3 | ANYONE | ADMIN | Pre-existing seeds |
| Programs | 3 | ANYONE | ADMIN | Pre-existing seeds |
| Partners | 3 | ANYONE | ADMIN | Seeded this session — all `[PLACEHOLDER]` archetypes |
| Speaking | 3 | ANYONE | ADMIN | Seeded this session — engagements placeholder-flagged |
| RestrictedRoutes | 4 | **ADMIN** | ADMIN | Seeded this session; private URLs deliberately NOT stored |
| FormSubmissions | 0 | ADMIN | ADMIN | Same status as BB |

## Permission verdict
- All approved public content collections are readable by ordinary public visitors (`read: ANYONE`) — **requirement met**.
- Both `RestrictedRoutes` and both `FormSubmissions` collections are **not** publicly queryable (`read: ADMIN`) — **requirement met**.
- Members system collections keep Wix defaults (`PrivateMembersData` = member-author only).

## Cross-site mapping
Founder/episode/signal/resource/event/funding content is mastered on **BB**; advisory content (insights, case studies, programs, speaking, partners) is mastered on **VGP**. Where one site references the other (e.g. VGP homepage "Brand Blueprint founders" router, BB "VGP pathway" section), reference by URL — do not duplicate records across sites.

## CRM
- Form submissions upsert Wix CRM contacts with labels: `custom.founder-intake`, `custom.podcast-guest-applicant` (BB); `custom.institutional-inquiry`, `custom.partner-contributor` (VGP).
- Qualification outcome / next-route labels (e.g. `custom.route-fit-call`, `custom.route-human-review`) are applied by the intake results page logic (see doc 08 §5) after evaluation — server-side, not client-guessable.

## Addendum — VGP re-verification 2026-07-24 (Phase 3)
Re-read `Vgp Staging 2026` (`6b5d8f63-…`) via Wix Data v2 `GET /data/v2/collections`. **10 custom collections** (more than this doc's original VGP table). Drift and additions:
| Collection | Read | Items | Note |
|---|---|---|---|
| Insights | ANYONE | 3 | as before |
| CaseStudies | ANYONE | 3 | as before |
| Programs | ANYONE | 3 | as before |
| Partners | ANYONE | 3 | placeholders |
| Speaking | ANYONE | 3 | placeholders |
| RestrictedRoutes | ADMIN | **5** | was 4 — one route added; still correctly private |
| FormSubmissions | ADMIN | 0 | as before |
| **Capabilities** | ANYONE | 6 | **new** — dedicated capability catalog (bind VGP capability pages here) |
| **ClientResources (Protected)** | **ADMIN** | 1 | **new** — members-area protected content source |
| **DanaProfile** | ANYONE | 1 | **new on VGP** — shared founder profile (About binds here) |

Permission verdict still holds: public content = ANYONE; RestrictedRoutes / FormSubmissions / ClientResources = ADMIN-only (not publicly queryable). Site is **Studio, Draft, Velo DISABLED** — Velo must be enabled before the `/advisory-pathway` server-side qualification backend (doc 14 §advisory-pathway) can be built.

## Field-standard note
Every custom content collection carries: `slug`, `status`, `owner`, `publishDate`, `lastVerified`, `reviewDate`, `expirationDate`, SEO title/description, canonical data, source, consent/rights fields, and image governance fields (alt text, focal point, caption, source, rights, credit) either at collection level or per-image — matching the Master Prompt data requirements.
