# 01 — Change List (Session 2026-07-20)

All changes were made on the two **staging** sites only. No live site was touched. Nothing was published.

## Bb Staging 2026 (`a7642a66-cb39-4be6-9517-9ebf10b70906`)

### Episodes collection (47 records)
- **Host governance verified**: `seriesHost` = "Dana Ammons" on all 47 records (sole host).
- **SEO scrub**: episode `the-brand-blueprint-build-a-brand-panel-segment-creating-a-standout-brand-in-haircare` — `seoDescription` rewritten to remove Cataanda James being presented as a host. New copy describes the panel content without naming any co-host and without fabricating replacement history.
- **Alt text**: descriptive editorial `imageAltText` written for all 47 records (pattern: `Episode artwork — {title} | The Brand Blueprint Podcast`). Previously all 47 were empty. No filename-style alt text remains.
- **Historical media flags preserved**: 6 records carry `historicalParticipantReview = true` with notes; 4 of them contain Cataanda James references inside embedded historical **transcripts**. These are intentionally left for Dana's editorial decision (see doc 07) — not silently deleted, not rewritten.

### Founders collection (3 records — Founder Chapter template data)
- **Repaired broken episode links**: `relatedEpisodeSlug` corrected for Kanicka Joseph (`kanicka-joseph-k-and-k-smiles`) and Dr. Michelle Cromwell (`dr-michelle-cromwell-soeur-du-sol`); both previously pointed at non-existent slugs.
- **Full editorial enrichment** of all 3 records (previously empty shells): story snapshot, market problem, founder narrative, strategic turning points, milestones, founder lesson, category, Dana's insight (marked `[DRAFT — pending Dana's approval]`), image crop notes, and placeholder-labeled alt text.
- **No fabrication**: pull quotes are explicit placeholders pending verbatim selection from episode audio; no traction metrics invented; consent flags left `false` and status left `editorial-review` because founder consent is not yet recorded.

### Forms (new — Wix Forms app installed and activated)
- **Founder Intake** (`ce3bdc89-a89d-4bda-9c36-484810e99c40`) — 11 fields including the two qualification questions ("Are you a founder or business owner?" Yes/No; "Have you previously met with Dana formally to discuss potential services?" Yes/No), audience selector, Brand Blueprint stage, consent radio. Upserts a CRM contact and applies label `custom.founder-intake`.
- **Podcast Guest Application** (`56acacdc-33ec-40ab-b218-e854bf843138`) — 9 fields; thank-you copy states approved guests receive a **private** interview-booking link by email (Calendly link never shown publicly). Label `custom.podcast-guest-applicant`.

### Apps
- Installed **Wix Forms** (`225dd912-7dea-4738-8688-4b8c6955ffc2`) to activate the `wix.form_app.form` namespace. ("Forms & Payments" alone did not expose it.)

## Vgp Staging 2026 (`6b5d8f63-fc66-449d-8c07-2d826ef21d2d`)

### Collections seeded (previously empty)
- **Insights** — 3 full advisory articles: *From Access to Commercial Readiness*, *The Retail Math Founders Must Master Before the Buyer Meeting*, *Forecast-Ready: Building Numbers That Institutions and Investors Believe*. Each with summary, full body, pull quote, SEO title/description, category, related capability and route. Status `editorial-review`.
- **Speaking** — 3 talk records (*From Brand to Shelf*, *Retail Readiness: What Major Retailers Expect from Emerging Brands*, *Funding Follows Forecasts*) with topic, audience, format, promise, outcomes. `pastEngagements` is an explicit placeholder pending Dana's verified list. No engagement history fabricated. The $115M PepsiCo figure is **not** used anywhere pending proof approval.
- **Partners** — 3 clearly labeled `[PLACEHOLDER]` partner archetype records (ESO, Capital, Retail/Distribution). No real organization named or implied.
- **RestrictedRoutes** — 4 governance records: the approved public `vgp-insight-session` Calendly route (with usage rules in notes), private active-client scheduling (URL intentionally **not stored**), private sponsored-program scheduling for Build in Tulsa / W.E. Build / JumpStart (URLs intentionally **not stored**; JumpStart noted as not-signed), and partner/contributor human-review route.

### Forms (new)
- **Institutional Inquiry** (`bfeb795f-543c-40a6-8c29-3712031cfc1c`) — org type + support-area qualification, consent; label `custom.institutional-inquiry`; two-business-day review promise in thank-you copy.
- **Partner & Contributor Inquiry** (`f37ecc59-bf20-4daf-8485-8ec883f13de7`) — contribution-type selector, consent; label `custom.partner-contributor`.

### Apps
- Installed **Wix Forms** (same reason as BB).

## Not changed (deliberately)
- Live sites, live DNS, live SEO, live redirects: untouched.
- No redirects created or activated anywhere.
- BB `CaseStudies`, `Programs`, `Speaking` collections left empty: those page types live on VGP in the approved architecture; the BB collections are reserved for cross-brand mapping (documented in doc 03).
- Historical transcripts referencing Cataanda James: preserved and flagged, per governance rules.
- Studio page composition: requires editor work — full build spec in doc 08.
