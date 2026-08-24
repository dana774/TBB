# Referral Partner framework

The end-to-end process for building, reviewing, and publishing referral-partner pages — and keeping the
data current from a single source of truth.

## The loop
```
  Draft page (site)  →  Announce + send preview link  →  Partner updates via form (Airtable)
        ▲                                                            │
        └────────────  Pull confirmed data back to the site  ◄───────┘
```

1. **Draft pages** — one per partner at `/network/<slug>`, in editorial-review state (built; see
   `vgp-headless/src/pages/network/[slug].astro`). The whole staging site is `noindex`, so preview links are
   shareable but not public/indexed.
2. **Announce** — send `process-announcement-email.md` (explains the new form/process + shows the example
   page), then each partner's individual email from `outreach-emails.md` with their preview link.
3. **Partner updates** — via the Airtable form (`airtable-referral-partners-spec.md`): edits + logo/headshot/
   images + optional services/rates + consent. Airtable is the source of truth (recreates the Google Sheet).
4. **Pull to site** — when a partner is `Confirmed` in Airtable, update `content.ts` + drop their assets in
   `public/assets/partners/`, set `review:false`, rebuild, deploy. (Automatable later — see the spec.)

## Files here
- `airtable-referral-partners-spec.md` — the Airtable base, form, automation, and pull process (click-to-build).
- `process-announcement-email.md` — the "new process" announcement + example page.
- `outreach-emails.md` — the 7 individual partner emails (with preview + form links).

## Preview links (staging host TBD from the branch deploy)
- Ark-La-Tex — `/network/ark-la-tex-financial`  ← **example page** (most complete)
- Veri-Core Systems — `/network/veri-core-systems`
- Patrice Malloy — `/network/patrice-malloy`
- Heloise Lanoix — `/network/heloise-lanoix`
- Kaylee McFerson — `/network/kaylee-mcferson`
- Sengo — `/network/sengo`
- Nudge — `/network/nudge`
- Product Society (contract manufacturing) — `/network/product-society`
- Sarah Horowitz Parfums (fragrance contract manufacturing) — `/network/sarah-horowitz-parfums`
- Funding partners — `/network/funding-partners` (now live with **C2FO — Lending Connections** / Jay Lott)

## Funding & sourcing partners added (researched)
- **C2FO — Lending Connections** (Jay Lott, Director) — working-capital platform + lender matchmaking (receivables finance, term loans, ABL, factoring). Listed on the funding-partners page; founder intros made warmly via VGP. **Jay's direct contact kept internal (Airtable), not published** pending his confirmation.
- **Product Society** (Philip Miller) — USA-made turnkey contract manufacturer (beauty/personal care/fragrance), North Hollywood.
- **Sarah Horowitz Parfums** (Sarah Horowitz) — fragrance contract manufacturer (custom scent → bottling/production).
All three added in editorial-review state; run them through the same announcement + form loop before publishing.

## Confirmed data notes
- **Ark-La-Tex** website = `altfc.net` (arklatexfinancial.net is dead). Contact nthompson@altfc.net · 318-256-9796 · Many, LA.
- **Heloise Lanoix** — spelling confirmed (not "Louise Lenoir").
- Headshots (Patrice / Heloise / Kaylee) on hold; partners will send via the form.
