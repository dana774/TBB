# Shopify Migration Package — The Brand Blueprint

Target store: **the-brand-blueprint.myshopify.com** (verified: "The Brand Blueprint", Dana's account, Basic plan)

## Status (2026-07-20)

Already true in the store (verified live):
- 12 pages exist: `start`, `founder-intake`, `intake-next-steps`, `founders`, `podcast`, `about`, `membership`, `member-dashboard`, `retail-readiness-checklist`, `buyer-pitch-deck-template`, `contact`, `data-sharing-opt-out`
- 7 metaobject definitions exist: `episode`, `founder_chapter`, `signal`, `resource`, `event`, `funding_opportunity`, `dana_profile`
- `episode.publish_date` (date) field **added by this workstream** to preserve original publish dates / search equity
- All metaobject types have **0 entries** — content migration is the outstanding work
- 0 products, no membership app yet

Blocked in this session: Shopify Admin **mutations require interactive approval** (host-app confirmation) that a non-interactive session cannot grant. All payloads below are validated against the Admin schema (`metaobjectCreate` batch mutation passed validation) and staged here for execution in an interactive session.

## How to execute

For each entry in the JSON files, run `metaobjectCreate`:

```graphql
mutation Create($m: MetaobjectCreateInput!) {
  metaobjectCreate(metaobject: $m) { metaobject { handle } userErrors { field message } }
}
```

Batching: up to ~12 aliased `metaobjectCreate` calls per request is validated and safe.

Order (no dependencies except where noted):
1. `episodes.json` (47 entries) — do these first
2. `founders.json` (3 entries) — after episodes, then set each `related_episode` field to the episode metaobject GID (`kanicka-joseph-k-and-k-smiles`, `dr-michelle-cromwell-soeur-du-sol`, `sruti-baz-scaling-moumas`) via `metaobjectUpdate`
3. `signals-resources-events-funding.json`
4. `dana-profile.json` — see its inline notes for the rich-text fields sourced from Wix

## Governance rules carried over
- Dana Ammons is sole host: every solo segment's `guest` field says "hosted by Dana Ammons"; no co-host presentation anywhere
- 6 episodes carry `historical_flag: true` (co-host-era embedded media) — do not surface historical language until Dana's editorial decision
- `$115M` PepsiCo claim is stored in `dana-profile.json` as a held claim with status "Pending final proof approval" — do not render publicly
- No private Calendly/program links exist in any payload
- Membership ($99 Founder Network): create in Shopify **only after** Appstle Memberships is installed (manual app-store install) and Dana approves launch; until then the `membership` page stays informational
- Transcripts (35 episodes): handled in [`transcripts-README.md`](transcripts-README.md). Six historical/co-host-era transcripts are extracted and **quarantined** in [`transcripts-HISTORICAL-HOLD.json`](transcripts-HISTORICAL-HOLD.json) pending Dana's Round 1 / Q1 decision — do not migrate those until resolved. The other 29 clean transcripts export directly Wix → Shopify at execution time (pattern in the transcripts README); the remaining 12 episodes have no substantive transcript.
