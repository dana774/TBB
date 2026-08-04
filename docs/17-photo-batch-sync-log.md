# 17 — Website Photo Batch QC + Sync Log (2026-08-04)

Batch source: `Brand_Blueprint_VGP_Next_5_Images.zip` (5 images supplied by Dana).
Governed by the Website Photography Production Master Prompt v2.0 (20-asset manifest).
Store: **the-brand-blueprint.myshopify.com** (Dana's account) — still password-protected, nothing customer-visible.

## QC results (against binding shot specs)

| Asset | File | Dim | QC verdict | Reason |
|---|---|---|---|---|
| BB-10 | dana-bb-portrait.jpg | 1200×1500 ✅ | **PASS** | Real editorial portrait, matches 4:5 spec. Locs + salt-and-pepper beard + light-blue suit on deep blue ground. |
| BB-09 | bb-members.jpg | 1600×1067 ✅ | **PASS** | Over-the-shoulder virtual meeting, 4 peers in gallery, Dana's face turned away (identity not at risk), no visible brand logos/readable names. Minor: no product-sample shelf; peer diversity could be stronger. |
| BB-05 | bb-funding.jpg | 1600×1067 ✅ | **REVISE** | Faces out of frame per spec, but the checklist renders as garbled fake AI text — reads as artifact at full size. Retouch to true blur before use. |
| VGP-01 | vgp-home-hero.jpg | 2400×1350 ✅ | **REJECT** | (1) Apple logo visible on laptop (hard exclusion). (2) Only 1 cofounder — spec needs 2 (Black woman + South Asian man). (3) Subject placement center-right; spec requires subjects LEFT with negative space RIGHT for headline. |
| BB-08 | bb-ecosystem.jpg | 1600×1067 ✅ | **REJECT** | (1) Male reads as a Dana-lookalike in a **Dana: NO** asset (identity bleed). (2) Only 2 people — spec needs 3 (Black woman founder + South Asian male cofounder + East Asian/white woman investor). |

All 5 files were dimensionally correct. None carried an embedded sRGB profile as delivered.

## Synced to Shopify (this session)

Both PASS assets were re-saved with an embedded **sRGB** ICC profile at JPG quality 92, then uploaded to Shopify Files (staged upload → `fileCreate`, both `READY`):

| Asset | Shopify MediaImage GID | CDN URL | Wired to |
|---|---|---|---|
| BB-10 dana-bb-portrait.jpg | `gid://shopify/MediaImage/31919069855798` | cdn.shopify.com/…/dana-bb-portrait.jpg | **`dana_profile.portrait`** (replaced interim podcast crop) |
| BB-09 bb-members.jpg | `gid://shopify/MediaImage/31919069888566` | cdn.shopify.com/…/bb-members.jpg | Files library — **theme-editor placement pending** (Member/Community section) |

- `dana_profile` (`gid://shopify/Metaobject/232776269878`) `portrait` field repointed from the interim `Dana_Ammons_Podcast_Host.png` (1672×941 landscape) to the new real 4:5 portrait. The podcast host image is **left in Files** (still used for podcast placement per doc 16) — not deleted.
- Nothing published; store remains password-protected; no theme changes made.

## Alt text (final)
- **dana-bb-portrait.jpg** — "Dana Ammons in a light blue suit against a deep blue studio background."
- **bb-members.jpg** — "Dana Ammons participates in a virtual client meeting with four professionals shown in a gallery view on a laptop."

## Open items / awaiting replacements from Dana
- **VGP-01, BB-08** — re-generate (see reject reasons). VGP-01 is a Wix/VGP hero; BB-08 must not contain a Dana-like face.
- **BB-05** — re-generate or retouch the checklist to true blur.
- **BB-09** — place `bb-members.jpg` in the theme editor (Member/Community section) when Dana next opens the Shopify customizer.
- **BB-10** — confirm the source portrait is a genuine photograph of Dana (spec: REAL PHOTO ONLY); rights/photographer metadata still to be recorded before public launch.

## Cross-batch guardrails for future generations
1. Never allow a Dana-like face in any "Dana: NO" asset.
2. Keep Apple / device / retailer brand logos off all screens and objects.
3. Deliver at exact pixel dimensions with an embedded sRGB profile.
