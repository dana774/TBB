# VGP Headless Frontend

Code-driven (headless) frontend for **Value Growth Partners**, mirroring the code-driven Brand Blueprint build. **Astro** + optional **Wix headless SDK** for CMS data. This is the "build & design in code" approach chosen 2026-08-04 as the alternative to composing the VGP site by hand in the Wix Studio editor (which has no page-composition API).

Design system: docs/19 (shared BB↔VGP tokens, VGP calmer rhythm). Page specs: docs/13–14. Qualification rule: docs/18.

## Architecture
- **Frontend:** Astro (`output: hybrid`) — pages prerender; `/api/qualify` is server-rendered so the fit-call URL is never in client source for non-qualified visitors.
- **Data:** `src/lib/content.ts` reads the VGP Wix CMS collections via the Wix headless SDK **when `PUBLIC_WIX_CLIENT_ID` is set**; otherwise it renders editorial-review seed content (so pages build and look right now). Single integration point: `queryCollection()`.
- **Qualification:** `src/lib/qualify.ts` (shared) + `src/pages/api/qualify.ts` (server endpoint). Confirmed rule: prospective client AND no prior paid engagement → fit call; fit-call URL returned only then.

## Run
```sh
npm install
npm run dev       # http://localhost:4321
npm run build && node ./dist/server/entry.mjs
```

## Wire live Wix data (when ready)
1. Create a **Wix Headless** project/OAuth app for the VGP content and copy its **Client ID**.
2. `npm i @wix/sdk @wix/data`
3. Set env: `PUBLIC_WIX_CLIENT_ID=…` (see `.env.example`). Collections read: Capabilities, Programs, CaseStudies, Insights, Speaking, DanaProfile.

## Deploy
The `@astrojs/node` standalone adapter runs anywhere. For Vercel/Netlify, swap the adapter (`@astrojs/vercel` / `@astrojs/netlify`) and deploy the repo. Set `FIT_CALL_URL`, `BB_URL`, and `PUBLIC_WIX_CLIENT_ID` as env vars. Keep `noindex` (in `Base.astro`) until launch.

## Guardrails (same as the rest of the ecosystem)
Fit-call URL only on the qualified advisory result · never in nav/footer/source for non-qualified visitors · no private/program scheduling URLs anywhere · nothing points at the live domain until cutover · `noindex` while staging.

## Status (2026-08-04)
Built & build-verified: design system, layout (nav/footer/SEO/schema), homepage (5-stage spine + audience router), advisory-pathway + server-side qualification (tested: qualified→fit call; all other branches→no link). Remaining pages scaffolded next: capabilities, programs, case-studies, insights, speaking, about, institutional-inquiry, partner-contributor, members, legal.
