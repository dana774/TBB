# 15 — Shopify Migration Execution Log (2026-07-20)

Executed against **the-brand-blueprint.myshopify.com** via the Shopify Admin API. All batches returned zero userErrors except two enum-constraint fixes noted below.

## Created (net-new metaobjects)
| Type | Count created | Notes |
|---|---|---|
| episode | **41** | The 6 withheld historical episodes were excluded (Round 1/Q1). Batches of 12/12/12/5. |
| signal | 3 | retail-readiness-operating-discipline, margin-pressure-changing-growth-plans, ai-shopping-moving-to-cart |
| resource | 3 | retail-readiness-blueprint-executive-guide, retail-buyer-outreach-playbook, founder-growth-operating-system-governance-blueprint |
| event | 3 | cpg-cash-flow-management-seminar-july-2026, funding-friday-weekly-opportunity-brief, founder-network-orientation |
| funding_opportunity | 2 | shophand-boost-grant, nase-growth-grants |

## Updated in place (existing skeletons — no duplicates created)
| Handle | Action |
|---|---|
| founder_chapter `michelle-cromwell` | Populated full featured chapter (narrative, market problem, turning points, milestones, lesson, Dana's Insight draft, SEO) + linked `related_episode` → dr-michelle-cromwell-soeur-du-sol. Stage "Distribution". Consent flags remain false; status `editorial-review` (publish gated on consent). |
| founder_chapter `sruti-baz` | Moved out of lineup — chapter_title flagged "MOVED OUT OF LINEUP 2026-07-20 — retained, not featured, do not publish"; linked related_episode. Retained, not deleted. |
| founder_chapter `kanicka-joseph` | Same moved-out treatment as Sruti. Retained. |
| dana_profile `dana-ammons` | Positioning updated; `pepsico_claim` reframed to the combined P&G/PepsiCo/Colgate-Palmolive/Walmart account total (>$1B) marked HELD/UNVERIFIED; `pepsico_claim_status` = pending-proof. Not published. |

## Enum constraints encountered and resolved
- `resource.access_level` accepts only `public`/`member` — the three resources were set to `member` (member-gated with public preview; the preview nuance is kept in each summary).
- `founder_chapter.stage` accepts only the 8 framework stages — Michelle set to `Distribution`.
- `founder_chapter.status` accepts only `editorial-review`/`published` — "moved out" is expressed via the chapter title + staying at `editorial-review` (never promoted to published), since a custom status value is rejected.
- `dana_profile.pepsico_claim_status` accepts only `pending-proof`/`approved` — set to `pending-proof`; the full held-note lives in the claim text.

## Deliberately NOT migrated
- **6 withheld historical episodes** (Round 1/Q1) — not created; held in `shopify-migration/episodes-WITHHELD.json`, transcripts in `transcripts-HISTORICAL-HOLD.json`.
- **29 clean transcripts** — not attached yet; per `transcripts-README.md` they export directly Wix → Shopify (`metaobjectUpdate` on each episode's `transcript` field) rather than round-tripping through the repo.
- **Best Damn Tape founder chapters** (Round 1/Q3) — no source material yet; awaiting Dana's founder details.

## Left in place for Dana to confirm
The scaffold **sample-*** placeholders were left untouched per the "update in place, keep samples" decision:
- episodes: sample-episode-latest, sample-episode-interview, sample-episode-historical
- signals: sample-market-signal, sample-funding-friday, sample-opportunity
- events: sample-event · funding: sample-funding
- resources: retail-readiness-checklist, buyer-pitch-deck-template (these two are real page-linked resources, not "sample-" — leave as-is)

Say the word and I'll delete the `sample-*` seeds now that real content backs every section.

## Publish-gate reminder
Nothing here is customer-visible yet: the store stays password-protected until launch approval, founder chapters are consent-gated, the Dana claim is held, and Appstle Memberships + the $99 Founder Network product are still pending (manual app install + Dana's go-ahead).
