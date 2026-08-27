# Ascend Family Vault — working session materials (VGP design system)

Four client materials for the August 27, 2026 Ascend Family Vault working session,
rebuilt on the Value Growth Partners design system. Source content came from a
ChatGPT-produced set; the substance was preserved and edited, and the visual
system, structure and pagination were rebuilt.

| File | Audience | Format |
|---|---|---|
| `01_Ascend_Family_Vault_Internal_Opportunity_Strategy_Book.docx` | Dana / VGP only | 16 pp, US Letter |
| `02_Ascend_Family_Vault_Client_Discussion_Brief.docx` | Eric, Isaiah, project team | 7 pp, US Letter |
| `03_Ascend_Family_Vault_Working_Session_Agenda.docx` | On screen during the session | 4 pp, US Letter |
| `04_Ascend_Family_Vault_Working_Session_Presentation.pptx` | Presented in the session | 14 slides, 16:9 |

## Design system

Tokens follow the VGP/BB design contract in [`docs/08-studio-build-spec.md`](../../docs/08-studio-build-spec.md) §1
and the calmer institutional rhythm specified for VGP in [`docs/20-vgp-headless-build-prompt.md`](../../docs/20-vgp-headless-build-prompt.md).

| Token | Hex | Use in these documents |
|---|---|---|
| Navy | `#071E41` | Cover bands, display headings, table header rows, closing slides |
| Deep Blue | `#0B2D57` | Sub-headings, callout body copy, secondary surfaces |
| Blueprint Blue | `#3978D7` | Bullets, numerals, single primary accent |
| Warm Gold | `#C89B2C` | Eyebrow labels only — one accent per view |
| Pale Blue | `#EFF5FF` | Insight callouts, emphasized cards |
| Soft Gray-Blue | `#F5F8FC` | Secondary tint, form-capture cells |
| Body Gray | `#4B5563` | Body copy |
| Border | `#E5EAF2` | Hairline table and card rules |

**Type.** Editorial serif for display (**Cambria**, standing in for the Playfair/Tiempos
class named in the design contract) over neutral sans for everything else (**Arial**,
standing in for Inter/Söhne). Both ship with every Office install, so the files render
identically on any machine without font installation. Eyebrows are uppercase, letter-spaced
and small; body copy runs 10 pt at 1.5 line spacing.

**Layout.** US Letter, 0.75″ side margins, generous section spacing, hairline tables with a
Navy header band and no zebra fill, callouts as tinted blocks with a gold label. No gradients,
no rounded corners, no decorative rules or accent stripes.

## What changed from the source materials

- Rebuilt on VGP tokens (the source used an unrelated teal/red/Aptos palette).
- Every heading carries an eyebrow label; sections start on their own page.
- Fill-in blanks in the agenda became real bordered form cells instead of underscores.
- Added a contents page to the strategy book and a deliberate closing page to the brief.
- Deck grew from 9 to 14 slides: added the timed agenda, market-entry ranking, MVP
  boundary (in/out), the four guardrails, and the 90-day plan — all drawn from the
  strategy book, which the original deck did not carry through.
- Fixed run-together titles, tightened copy, and repaired pagination
  (no orphaned headings, no blank pages, no split callouts).

## Rebuilding

```bash
cd build && npm install docx pptxgenjs
node doc-01-strategy.js ../01_Ascend_Family_Vault_Internal_Opportunity_Strategy_Book.docx
node doc-02-brief.js    ../02_Ascend_Family_Vault_Client_Discussion_Brief.docx
node doc-03-agenda.js   ../03_Ascend_Family_Vault_Working_Session_Agenda.docx
node deck-04.js         ../04_Ascend_Family_Vault_Working_Session_Presentation.pptx
```

`build/theme.js` holds the shared Word design system — reuse it for the next VGP document
rather than restyling from scratch. `build/render.sh <file> <prefix>` renders any output to
JPEGs for visual QA.
