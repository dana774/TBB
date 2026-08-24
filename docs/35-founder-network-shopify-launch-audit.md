# 35 — Founder Network (Shopify) member-delivery audit + launch checklist

Store: **the-brand-blueprint.myshopify.com** — still password-protected staging.
Scope: the gated Founder Network Resource Library on the Brand Blueprint Shopify store.
**Updated 2026-08-14 for the platform reset — Shopify Subscriptions + native theme
gate + metaobject-driven content (Appstle removed).**

## Architecture (current, post-reset)
| Layer | System of record |
|---|---|
| Subscriptions/billing | **Shopify Subscriptions** — product `founder-network-membership`, one plan: monthly **$99** (`SellingPlan/2346582070`). **Appstle (Subscriptions + Memberships) is uninstalled — do NOT reinstall or add Appstle plans/embeds.** |
| Member gating | **Native theme snippet `bb-member-gate.liquid`** — shows gated content only when `customer.tags contains "Founder Network"` (`settings.bb_member_tag`). |
| Tag applier | **Shopify Flow (free)** — see the launch-critical gap below. |
| Nav + theme | Owned in **BB Preview theme `154677215286`**. Do NOT edit `main-menu`, sections, templates, `settings_data`, or `header-group`. Menu finalized (Start Here · Founder Chapters · Signals▾ · Resources · Founder Network▾ · Podcast · About Dana). Request nav changes; don't edit. |
| Member content | **Shopify `resource` metaobjects** (`title`, `collection_name`, `access_level`, `summary`, `page`/`link`, `status`). The theme's `bb-resource-library` renders them under "Available now" with the Member badge + sign-in gate, grouped by `collection_name`. |

## 🔴 Launch-critical gap — nothing tags subscribers yet
Appstle used to apply the `Founder Network` tag; it's gone. Until the tag applier is
rebuilt, a paying subscriber gets **no tag**, so `bb-member-gate.liquid` locks them
out. Rebuild with **Shopify Flow** (owner action — not API-creatable, outside the
content lane):
- **Flow A** — trigger *Subscription contract created/activated* → action *Add customer tag* `Founder Network`.
- **Flow B** — trigger *Subscription contract cancelled/expired* → action *Remove customer tag* `Founder Network`.
- **Interim for testing:** manually add the `Founder Network` tag to a test customer.

## The 9 library collections (exact `collection_name` values)
Start Here + Founder Operating Cadence · Funding + Capital Access · Retail, Buyers +
Distribution · Product, Packaging + Operations · Growth OS + Founder Systems ·
Marketing, Content + Customer Growth · Events, Market Signals + Opportunities ·
Partner Network + Expert Routing · Accelerator + Alumni Continuity.

Handle → collection mapping: `member-capital-access` → Funding + Capital Access ·
`member-retail-readiness` → Retail, Buyers + Distribution · `member-sales-gtm` →
Marketing, Content + Customer Growth · `member-operations-forecasting` → Product,
Packaging + Operations (route pure forecasting/systems pieces to Growth OS + Founder
Systems) · `member-brand-messaging` → Marketing, Content + Customer Growth ·
`member-growth-os-ai` → Growth OS + Founder Systems · `member-partner-directory` →
Partner Network + Expert Routing.

## Library build — COMPLETE (2026-08-15)
All member resources are now `resource` metaobjects (`access_level=member`, `status=published`,
`publishable=ACTIVE`), built from the canonical Drive collections 01–07 with each README's
copy, linked via Drive view URLs (videos via YouTube). **55 resources across 7 populated collections:**

| `collection_name` | Count | Source (Drive) |
|---|---|---|
| Funding + Capital Access | 11 | CAP-01…11 (01) |
| Retail, Buyers + Distribution | 15 | RET-01…15 (02) |
| Marketing, Content + Customer Growth | 11 | GTM-01/02/03/05/06/07 (03) + BRD-01…04,06 (05) |
| Product, Packaging + Operations | 3 | OPS-01/02/03 cash-flow (04) |
| Growth OS + Founder Systems | 9 | OPS-04/05/06 (04) + GOS-01…05 (06) |
| Partner Network + Expert Routing | 4 | PTR-00 disclosure card + PTR-01…03 (07) |
| Events, Market Signals + Opportunities | 3 | 3 Market Signal videos → YouTube playlist |

- ✅ **Parallel page HTML removed** — the 4 dedicated pages (`founder-network`, `membership`, `member-dashboard`, `resources`) **and** the `member-capital-access` inline HTML cleared (render via the `member-collection` template confirmed by Dana); the earlier `main-menu` additions reverted.
- ✅ **Legacy cleanup** — the 2 demo samples + 3 empty draft resources deleted so the library renders consistently.
- ✅ **Partner disclosure** — `PTR-00` disclosure card added (inclusion-is-not-an-endorsement + referral-fee disclosure) since the metaobject has no notices field and the collection-level themed header is a Preview-theme edit (owner's lane).
- ✅ **Videos → YouTube** — CAP-10 repointed off Drive, and the 3 Market Signal videos created in *Events, Market Signals + Opportunities* — all pass-through-linked to the playlist `PLt97rjQ0XHUpnaUv1sNC1vTByObU-JT8y` so re-uploads auto-reflect. (Linked to that one playlist as the starting point; repoint to per-video URLs or a dedicated Market-Signals playlist if preferred.)
- **Not built (no Drive folder / source yet):** *Start Here + Founder Operating Cadence*, *Accelerator + Alumni Continuity* — awaiting source.

## Open items
- 🔴 **Drive → Viewer** — the member files are shared `anyone: editor`. **I cannot change the public-link role via API** (the Drive `share_file` tool only adds/upgrades named users). Owner must set the "Founder Network — Members" folder → Anyone with the link → **Viewer**. Required before real member access.
- ⏳ **Partner-page themed disclosure header** — optional polish; owner's theme lane (PTR-00 card covers the requirement in the meantime).

## Launch checklist — owner actions (not the content lane)
1. **Build Flow A/B** (or set the interim manual tag) so subscribers actually get `Founder Network`.
2. **Verify the native gate**: a tagged customer SEES the resources; an untagged/logged-out visitor is blocked. Test several `member-*` pages.
3. **End-to-end $99 purchase** (test mode or refunded) → confirm Flow tags the buyer → gate unlocks. The true proof of the chain.
4. **Resource-link integrity** — links resolve; migrate the Drive videos.
5. **Keep the store password ON** until 1–4 pass and launch is approved.

## Boundary
Shopify Flow and the Preview theme (gate snippet, templates, menu) are owned outside
the content lane and aren't API-creatable here. The content lane owns the `resource`
metaobjects and their `collection_name`/`access_level`/`status` — that's what this
workstream builds.
