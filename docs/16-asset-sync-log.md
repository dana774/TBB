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

## Governance preserved
- Sole-host imagery only (no second person surfaced).
- No private/STAGING assets published; store still password-protected.
