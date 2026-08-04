# 19 — VGP Wix Studio Design-System Setup Sheet

Input these values **once** in the Wix Studio **Site Styles** panels for `Vgp Staging 2026`, and every page inherits the shared Brand Blueprint ↔ VGP design system (doc 08 §1 tokens, VGP's calmer institutional rhythm). This is the operational bridge from design tokens → Studio Global Styles. It configures the design system the whole editor build inherits; the per-page composition then follows docs 13–14.

> Where: Studio editor → left sidebar **Site** (or top **Site Styles**) → **Colors** and **Text**. Set text sizes per breakpoint (Desktop / Tablet / Mobile) using the Studio breakpoint switcher.

## 1. Color palette (Site Styles → Colors)
Add these as the site's custom colors and assign to the palette roles shown.
| Token | HEX | Studio role |
|---|---|---|
| Blueprint Blue | `#3978D7` | Primary / action (buttons, links, active) |
| Navy | `#071E41` | Headings / dark surfaces / footer |
| Deep Blue | `#0B2D57` | Secondary / primary-hover |
| Warm Gold | `#C89B2C` | Accent — eyebrows only, ≤1 per view (never text on white) |
| Pale Blue | `#EFF5FF` | Tinted section background 1 |
| Soft Gray-Blue | `#F5F8FC` | Tinted section background 2 |
| Body Gray | `#4B5563` | Body text |
| White | `#FFFFFF` | Dominant background |
Contrast: Body Gray on White and Navy on White both pass WCAG 2.2 AA. **Never** set gold as text on white.

## 2. Text themes (Site Styles → Text) — VGP calmer scale
Heading font: refined editorial **serif** (Playfair Display or a Freight/Tiempos-class serif), color Navy. Body/UI font: **sans-serif** (Inter/Söhne-class), color Body Gray. Set sizes per breakpoint:
| Theme | Font | Desktop | Tablet | Mobile | Line height | Color |
|---|---|---|---|---|---|---|
| Heading 1 | Serif | 60px | 44px | 34px | 1.1 | Navy |
| Heading 2 | Serif | 40px | 32px | 26px | 1.15 | Navy |
| Heading 3 | Serif | 28px | 24px | 22px | 1.25 | Navy |
| Heading 4 | Sans (600) | 22px | 20px | 18px | 1.3 | Navy |
| Paragraph 1 (body) | Sans | 18px | 17px | 17px | 1.7 | Body Gray |
| Paragraph 2 (small) | Sans | 15px | 15px | 14px | 1.6 | Body Gray |
| Eyebrow / label | Sans (600, +5% letter-spacing, UPPERCASE) | 13px | 13px | 12px | 1.4 | Warm Gold |
VGP rhythm vs BB: one step smaller headings, more line-height, more whitespace.

## 3. Buttons (Site Styles → Buttons / component defaults)
- **Primary:** fill Blueprint Blue, text White, corner radius 4px, no gradient/shadow. Hover: fill Deep Blue. Focus: 2px offset outline Blueprint Blue.
- **Secondary:** transparent fill, 1px Navy border, Navy text. Hover: Pale Blue fill. On Navy sections: White border + White text.
- Padding ~ 0.9rem × 1.9rem. Square or 4px radius only.

## 4. Layout & spacing defaults
- Max content width **1240px**; 12-column grid; gutters 24px.
- Section vertical padding: **Desktop 112–136px**, Tablet 72–88px, Mobile 52–64px (VGP is airier than BB).
- Cards: White, 1px `#E5EAF2` border, 4px radius, shadow on hover only. **2-up max per row** on desktop (institutional restraint) — never 4-up.

## 5. Motion & accessibility
- Transitions ≤200ms fade/rise; honor `prefers-reduced-motion` (Studio: keep animations subtle).
- One H1 per page; visible keyboard focus; labeled form fields; responsive images with focal points.
- Test breakpoints: 1440 / 1024 / 768 / 390.

## 6. After the styles are set
The design system is now global. Build pages per **doc 14** (section-by-section) — sections inherit these colors, text themes, buttons, and spacing automatically, so composition is layout + content, not restyling each element. Data bindings and the advisory-pathway backend are in docs 13–14 and 18.

## Status
Design-system configuration = this sheet (Dana inputs in Studio Site Styles). Visual page composition = editor work per doc 14 (no Wix API for it). Data layer (collections, advisory form + backend) = done/in-progress via API (docs 03, 18).
