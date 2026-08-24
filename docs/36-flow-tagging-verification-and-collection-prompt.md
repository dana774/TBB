# 36 — Founder Network: gating verification, Flow tag runbook, and the two-collection build prompt (2026-08-15)

Store: the-brand-blueprint.myshopify.com · Preview theme `154677215286` (UNPUBLISHED, "BB Preview (Phase 1-2) — DO NOT PUBLISH").

## A. Gating verification — what's confirmed via API
- ✅ **Gate snippet present:** `snippets/bb-member-gate.liquid` exists. Logic: reads `settings.bb_member_tag`; if `customer.tags contains` it → renders `gated_content`; logged-in non-member → "Compare memberships" pathway; logged-out → sign-in prompt.
- ✅ **Tag value:** `bb_member_tag = "Founder Network"` in the Preview theme settings. **The tag Flow applies must be exactly `Founder Network`.**
- ✅ **Theme-editor preview:** the snippet reveals gated content when `request.design_mode` is true — so member pages can be reviewed in the **Customizer** without a member login (live visitors unaffected).
- ✅ **Content layer:** 55 `resource` metaobjects, all `publishable=ACTIVE`, `status=published`, `access_level=member`; definition `storefront=PUBLIC_READ`.
- ✅ **Product/plan:** "Founder Network Membership" — Shopify Subscriptions, $99/mo (`SellingPlan/2346582070`).

### Cannot be verified from here (human/browser — owner)
- Live logged-out block and logged-in-member reveal on the real storefront (logic is sound; confirm in a browser).
- End-to-end $99 purchase → Flow tags buyer → gate unlocks.
- Store still password-protected (keep it ON until launch).

### Notes (cosmetic, theme owner's lane)
- The gate snippet's comment still says the tag is "applied by Appstle Memberships" — now applied by **Shopify Flow**; update the comment when convenient.
- `settings_data.json` still lists **Appstle app-embed blocks** (app uninstalled → inert); the theme owner can remove the stale blocks.

## B. Flow tag-applier runbook (owner builds in the Flow app — NOT API-creatable)
Shopify Flow workflows can't be created through the Admin API, so this is a manual build. The tag must be **exactly `Founder Network`** (matches `bb_member_tag`).

**Flow A — grant on subscription start**
1. Shopify admin → **Flow** → **Create workflow**.
2. **Trigger:** `Subscription contract created` (Shopify Subscriptions). *(Alternative if you prefer to grant only after first payment: `Subscription billing attempt success`.)*
3. *(Optional)* **Condition:** `Subscription contract → status` **equals** `ACTIVE`.
4. **Action:** `Add customer tags` → `Founder Network`.
5. **Turn on.**

**Flow B — revoke on cancel/expire**
1. **Create workflow.**
2. **Trigger:** `Subscription contract status changed` (or `Subscription contract cancelled` if listed).
3. **Condition:** `Subscription contract → status` is `CANCELLED` **or** `EXPIRED` (add both with OR).
4. **Action:** `Remove customer tags` → `Founder Network`.
5. **Turn on.**

**Interim test (before Flow exists):** add the tag `Founder Network` to a test customer (Customers → the customer → Tags), then verify the gate in a logged-in browser.

## C. Verification checklist — owner steps
1. **Preview render:** open the Preview theme Customizer → each `member-*` page → confirm the resource grid renders (design_mode reveals gated content).
2. **Live gate:** with Flow on (or the interim tag), sign in as a tagged customer → resources visible; sign out / untagged → sign-in / compare prompt.
3. **End-to-end:** buy the $99 plan (test mode or refunded) → Flow tags the buyer → gate unlocks.
4. **Drive → Viewer:** set "Founder Network — Members" folder sharing to **Anyone with link → Viewer** (required; not API-changeable here).
5. **Keep the store password ON** until 1–4 pass.

## D. Build prompt — hand to the Founder Resource agent for the two missing collections
Two library collections have no Drive source folder and render empty on the site:
**"Start Here + Founder Operating Cadence"** and **"Accelerator + Alumni Continuity"**.
Give the agent the prompt in the section below; when it returns the folder IDs + file list,
the Shopify workstream creates the `resource` metaobjects (title with ID prefix, `collection_name`
= the EXACT display name, `access_level=member`, `status=published`, `link` = Drive view URL,
`summary` = README description).
