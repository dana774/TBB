# The Founder Signal — locked newsletter template

Canonical visual template for the bimonthly member newsletter. Full spec: `docs/30` (Part D).

## Files
- `the-founder-signal-template.html` — the layout (Brand Blueprint aesthetic, section icons, diagrams).
- `assets/tbb-logo.png` — The Brand Blueprint primary logo (masthead). **Fixed.**
- `assets/b-mark.png` — blueprint-B watermark. **Fixed.**
- `assets/qr.png` — Dana's Popl digital-business-card QR (footer). **Fixed.**
- `assets/hero.jpg` — header hero photo. **Swap per issue** from approved imagery.

## Render to PDF (print / attachment)
Headless Chromium honors the print CSS and background colors:

```
chrome --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=The-Founder-Signal.pdf file:///abs/path/the-founder-signal-template.html
```

(Any Chromium works; on this environment: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.)

For **email**, port the same structure/sections/colors into beehiiv's editor — the HTML here is the
design reference, not a beehiiv-email export.

## What to change each issue (everything else stays)
1. **Market Signal block** — Dana's editorial lead (from Dana), plus optional stat row / process-flow diagram.
2. **Item rows** — Funding Radar, Capital Moves, Founder News (from the intelligence database).
3. **Funding deadline timeline** — the SVG node dates/labels.
4. **`assets/hero.jpg`** — the header photo.

## Brand guardrails
- The Brand Blueprint leads; VGP is the footer endorsement ("Powered by Value Growth Partners"). Never
  equal logo hierarchy.
- Colors: Brand Blueprint Blue `#3978D7`, navy `#071E41`/`#0B2D57`, panels `#EFF5FF`/`#F5F8FC`, gold
  `#C89B2C`, gray `#4B5563`, white background.
- Every capital/market figure is flagged for Dana's sign-off before send; no unverified numbers.
