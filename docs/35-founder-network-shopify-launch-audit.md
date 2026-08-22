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

## Content progress (metaobjects)
- ✅ **Capital Access migrated** — 11 `resource` metaobjects (CAP-01…CAP-11), `access_level=member`, `status=published`, ACTIVE, `collection_name="Funding + Capital Access"`, each linking to its file. (CAP-10 still points to the Drive video — hosting migration pending.)
- ✅ **5 pre-existing resources normalized** to the new collection names (retail-readiness-checklist, retail-readiness-blueprint, retail-buyer-outreach-playbook → Retail, Buyers + Distribution; buyer-pitch-deck-template → Funding + Capital Access; governance-blueprint → Growth OS + Founder Systems).
- ✅ **Parallel page HTML removed** — the four dedicated pages (`founder-network`, `membership`, `member-dashboard`, `resources`) cleared so the theme templates render; the earlier `main-menu` additions reverted.
- ⏳ **Capital Access page body** — clear the inline resource HTML once render via the `member-collection` template is confirmed (the metaobjects and the old HTML currently coexist).
- ⏳ **Collections 02–07** — build as `resource` metaobjects from Drive folders 02–07 (Retail, Buyers + Distribution / Marketing, Content + Customer Growth / Product, Packaging + Operations / Growth OS + Founder Systems / Partner Network + Expert Routing), like Capital Access.
- ⏳ **Videos** — move CAP-10 + the 3 Market Signal videos off Google Drive to real hosting.

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
