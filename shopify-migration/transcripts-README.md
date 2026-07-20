# Transcript Migration — Execution Guide

35 of 47 episodes carry substantive transcripts in the parked Wix `Episodes` collection (`transcript`, plain-text field, ~147K chars total). They split into two sets.

## Set A — 6 historical (co-host-era) transcripts — QUARANTINED
File: [`transcripts-HISTORICAL-HOLD.json`](transcripts-HISTORICAL-HOLD.json)

These are the episodes with `historical_flag=true` whose transcript text still names co-hosts (Cataanda James, plus Heloise Lanoix / Christian Ampuero on the panel + capsule episodes). Every co-host mention is catalogued at the top of that file.

**Do not migrate or publish these six until Dana resolves Round 1 / Q1** (publish with a neutral archive note / edit the transcript / withhold the episode). They are extracted and held here precisely so Dana can review the exact language before deciding. No history has been rewritten or fabricated.

## Set B — 29 clean transcripts — direct Wix → Shopify at execution
These carry no host-governance issue. They are **not** duplicated into this repo: staging them here would mean pulling ~120K chars through the assistant's working context for zero benefit, since the execution session already has live Wix read access. Instead, at execution time, pull each transcript straight from Wix and write it onto the matching Shopify episode metaobject.

Reference pattern (execution session):
```js
// 1. Read from parked Wix (site a7642a66-cb39-4be6-9517-9ebf10b70906)
//    POST /wix-data/v2/items/query  { dataCollectionId: "Episodes", query: { filter: { slug } } }
//    -> data.transcript  (plain text)
// 2. Convert to Shopify rich text: split the text on double-newline into paragraphs, e.g.
//    { "type":"root","children": paragraphs.map(t => ({ "type":"paragraph","children":[{"type":"text","value":t}] })) }
// 3. Write onto the episode metaobject (handle == Wix slug):
//    metaobjectUpdate(id, { fields: [{ key: "transcript", value: JSON.stringify(richText) }] })
```

The 29 clean slugs (all `historical_flag=false`):
```
the-brand-blueprint-revolutionizing-personal-branding-for-founders-with-natalie-weakly
the-brand-blueprint-blog-power-up-your-brand-with-these-essential-market-research-tools
unleashing-entrepreneurial-success-the-bold-story-of-jacob-guss-and-bold-move-beverages
blog-post-capsule-4-brand-development-and-product-strategy
the-brand-blueprint-mastering-inclusive-marketing-strategies-and-insights-with-devoreaux-walton
vision-persistence-and-pivoting-in-brand-building-insights-from-aisha-crump
the-brand-blueprint-capsule-5-demystifying-marketing-roi-and-strategic-brand-growth
the-brand-blueprint-navigating-product-development-a-deep-dive-into-the-ordinary-s-triumph-and-s
the-brand-blueprint-mastering-product-development-insights-from-desi-the-glam-scientist
innovating-the-beauty-industry-an-in-depth-interview-with-dwan-white
the-importance-of-market-research-and-consumer-insights-in-brand-creation
the-brand-blueprint-leveraging-linkedin-for-brand-success-expert-strategies-with-trish-lindo
from-idea-to-reality-the-inspiring-journey-of-daniel-victor-and-hid-sips
positioning-your-brand-in-a-saturated-market
fashioning-a-cultural-tapestry-the-story-of-mapate-diop-and-diop-clothing
the-brand-blueprint-navigating-tax-season-and-building-wealth-insights-from-patrice-malloy-the
navigating-non-alcoholic-spirits-in-dry-january-with-phil-irvine
the-brand-blueprint-blog-capsule-one-resources-essential-resources-for-crafting-your-brand-vision
the-brand-blueprint-mastering-global-markets-strategic-insights-with-sylvia-lin
revolutionizing-personal-branding-with-ai-insights-from-trish-lindo
the-brand-blueprint-podcast-resource-capsule-market-research-and-analysis
building-brand-identity-and-positioning-insights-from-the-brand-blueprint
the-brand-blueprint-blog-establishing-your-brand-vision-essential-steps-for-aspiring-founders
empowering-athletes-with-nil-the-magic-cleats-story
the-unstoppable-force-kathleen-lanoix-s-journey
happy-new-year-2026-seedspot-special-from-dakar-to-u-s-shelves-with-victorine-sarr-lyvv-maiso
the-brand-blueprint-blog-ai-tools-and-tips-for-crafting-your-brand-vision
mastering-visual-brand-identity-essential-tips-for-entrepreneurs
the-build-a-brand-segment-market-research-tools
```

The remaining 12 episodes (of 47) have no substantive transcript — leave `transcript` empty or attach an accessible summary later.
