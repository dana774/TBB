# 16 — Image / Logo / Asset Sync Log (2026-07-24)

Assets supplied by Dana: a 30-piece logo suite, a Phase-2 business-card system, and 3 podcast promo images. Synced to the Shopify store (the-brand-blueprint.myshopify.com). Store remains password-protected; nothing customer-visible.

## Key correction (recorded)
The Wix CMS had **no founder or Dana headshots** — those fields were empty. The only images in Wix were episode hero images: recent episodes use Spotify cover thumbnails, and **older episodes use real branded artwork hosted in Wix's own Media Manager** (`static.wixstatic.com`, owned assets). The business-card kit's production notes also list a "canonical Dana portrait" as still-missing. So headshots remain an open item; the logo suite + podcast imagery are the real material synced.

## Dana's decisions applied (2026-07-24)
- **Podcast images:** use the **solo host image only**; the two two-person images are held (sole-host / no-misrepresentation rule).
- **Headshots:** the solo promo image is the **interim approved Dana visual** for podcast/About; real portrait session later.
- **Episode art:** populate from the **existing Spotify/Wix covers**.

## Uploaded to Shopify Files (all READY on cdn.shopify.com)
| Asset | Alt text |
|---|---|
| TBB primary horizontal logo (Blueprint Blue, transparent) | primary horizontal logo |
| TBB stacked logo (white on navy) | stacked logo |
| TBB favicon / B icon (512) | B icon favicon |
| TBB + VGP endorsement lockup | logo with VGP endorsement |
| Dana Ammons podcast host image (solo) → MediaImage 31688547270710 | Dana Ammons hosting The Brand Blueprint podcast in studio |

## Data wired
- **episode.image_url** field added; **37 episodes** populated with existing cover art (mix of owned Wix Media Manager artwork + Spotify covers). Excluded: the 6 withheld historical episodes and the 3 newest episodes that had no cover in Wix (funding-friday-capital-readiness, sruti-baz-scaling-moumas, ai-shopping-moving-to-the-cart) + the 3 sample placeholders.
- **dana_profile.portrait** field added; set to the Dana host image (READY).

## Not published / still theme-editor or open
- **Header logo + favicon placement** are Shopify **theme settings** — the files are in the Files library ready to select in the theme editor (or via an unpublished-theme settings edit on request). Not auto-applied.
- **The full 30-piece logo suite**: only the 5 core web assets were uploaded. The rest (social icons, banners, virtual-call background, etc.) can be uploaded on request.
- **Business-card `STAGING` art**: deliberately NOT uploaded/published — the kit marks all STAGING files do-not-distribute until routing/QA passes.
- **Founder headshots (Michelle featured; Sruti/Kanicka archived)**: still none — awaiting real photography + consent.
- **Two-person podcast images**: held per Dana's decision.
- **Image rights fields**: the promo images appear to be brand renders; source/rights/photographer metadata still needs confirmation before any public publish.

## Theme logo + favicon (2026-07-27, unpublished "BB Preview" theme)
Applied to the working theme **"BB Preview (Phase 1-2) - DO NOT PUBLISH"** (live "Horizon" theme untouched; API blocks live-theme writes anyway). Edited `config/settings_data.json` surgically — added three keys, preserved everything else, JSON validated:
- **`logo`** → the **B icon** (`TBB_B_Icon`) — the repeating anchor logo, renders in the global header on every page.
- **`favicon`** → `TBB_Favicon_512` — browser-tab icon site-wide.
- **`brand_image`** → full horizontal `TBB_Primary_Horizontal_Blue` — footer/brand lockup (selective full-logo placement).

Additional logo pieces uploaded to Files this round (the ones that fit website use): B icon, B-icon-on-navy, stacked Blue. Combined with the earlier five, the store now has a working web set: header (B), footer (horizontal), dark-background (stacked white-on-navy / B-on-navy), and the TBB+VGP endorsement lockup. The remaining suite pieces (social post templates, banners, story covers, virtual-call background) are marketing/social assets, not website page assets, so were intentionally not uploaded.

### Whitespace / per-page images — what this fixes and what remains
- The **global header B logo** now anchors every page (biggest single fix for the "missing logo" whitespace).
- The **Dana portrait** and **episode cover images** wired earlier feed the custom sections (`bb-dana-authority`, `bb-about-dana`, `bb-podcast-preview`, etc.), so those fill in automatically.
- **Still open (needs section-level work or founder photos):** the `bb-founder-grid` still shows gaps because founders have no headshots yet; and any bespoke section with its own empty image slot would need per-section placement in the theme editor. The homepage is a custom-section theme (`bb-hero-editorial`, etc.); tell me which specific sections still look sparse and I'll place the appropriate logo/image into each.

## Empty image slots filled (2026-07-31, unpublished "BB Preview" theme)
Preview-checked the custom homepage/About sections and found **3 image_picker slots rendering the gray placeholder callout** because they read from **theme section settings** (template JSON), not from the metaobject. Filled all three via `themeFilesUpsert` (verified persisted, no userErrors):
- `templates/index.json` → `bb_hero.settings.image` = `shopify://shop_images/Dana_Ammons_Podcast_Host.png` (homepage hero).
- `templates/index.json` → `bb_dana.settings.portrait` = same (homepage "Dana authority" band).
- `templates/page.about.json` → `bb_about.settings.portrait` = same (About page portrait).

**Note / recommendation:** the same single Dana host image now appears in both the homepage hero **and** the homepage Dana-authority band — only one Dana photo exists today. Recommend a real portrait session so hero vs. authority vs. About use **distinct** frames instead of one repeated image. The `bb-founder-grid` still shows gaps (founders have no headshots yet — awaiting photography + consent).

## Governance preserved
- Sole-host imagery only (no second person surfaced).
- No private/STAGING assets published; store still password-protected.
