# 20 — VGP Headless Build (architecture decision + status)

## Decision (Dana, 2026-08-04): go headless
VGP is now built as a **code-driven headless site** (in `vgp-headless/`), mirroring the code-driven Brand Blueprint build — **not** composed by hand in the Wix Studio editor.

**Why:** the reason BB was buildable/designable by Claude and VGP-in-Studio wasn't is **code-driven frontend vs. visual editor**, not Wix vs. anything. BB shipped code (Shopify theme; and there's a BB Wix *headless* / "Editorless" site in the account too). Wix **Studio** (VGP's staging site) is a visual editor with **no page-composition API**, so it could only be specced. Headless makes the frontend code again → Claude builds and designs every page.

## What's built (`vgp-headless/`, Astro)
Build-verified (`astro build` passes; server + endpoint tested):
- **Design system** from doc 19 (shared BB↔VGP tokens, VGP calmer rhythm) — `src/styles`.
- **Layout**: responsive nav, footer, SEO + Organization JSON-LD, `noindex` while staging.
- **Homepage**: 5-stage spine (Intake audience-router / Diagnose / Map / Select / Execute) + positioning band + insights + BB cross-brand + CTAs.
- **Advisory pathway** + **server-side qualification** (`src/pages/api/qualify.ts`, `src/lib/qualify.ts`): confirmed rule (prospective client + no prior paid engagement → fit call). **Tested across all four branches** and tolerant of label vs coded values.
- **All interior pages**: capabilities (+6 detail), programs (+3), case-studies (+3), insights (+3), speaking, about (PepsiCo claim gated), institutional-inquiry & partner-contributor forms, members, privacy/terms/accessibility. 29 static pages + the server endpoint.
- **Content layer** (`src/lib/content.ts`): reads VGP Wix CMS (Capabilities, Programs, CaseStudies, Insights, Speaking, DanaProfile) when `PUBLIC_WIX_CLIENT_ID` is set; else editorial-review seed so pages render now.

## Guardrail — provably enforced
Repo-wide build audit: the fit-call URL (`vgp-insight-session`) appears in **zero static page sources**; it exists only inside the compiled server `/api/qualify` endpoint. Non-qualified visitors cannot find it in page source → **true server-side gating** (stronger than the Shopify results-page approach). No private/program scheduling URLs anywhere; `noindex`; nothing points at the live domain.

## Remaining (needs Dana / setup — not code)
1. **Wix headless data client:** create a Wix Headless project/OAuth app for the VGP content, set `PUBLIC_WIX_CLIENT_ID`, `npm i @wix/sdk @wix/data` → live CMS content replaces seed.
2. **Deploy:** pick a host (Vercel/Netlify/Render) — swap the adapter if desired; set `FIT_CALL_URL`, `BB_URL`, `PUBLIC_WIX_CLIENT_ID`. Keep `noindex` until launch.
3. **Live form submission:** wire the two inquiry forms to the existing Wix Forms (ids in doc 18 Part H) + CRM labels via the Wix client (currently they acknowledge inline in staging).
4. **Content approvals:** replace `[EDITORIAL REVIEW]` seed/placeholder copy with approved content; supply real case studies, verified speaking engagements, Dana portrait; PepsiCo claim stays gated until approved.
5. **Domain/cutover:** only after approval — never touch the live VGP site until then.

## Relationship to the Wix Studio staging site
The VGP **Studio** staging site (`6b5d8f63…`) remains the **content/CMS + forms backend** (collections, the 3 intake forms, CRM labels — all verified). The headless frontend reads from it. The Studio site is no longer the intended *frontend*; page composition there is superseded by this coded build. Docs 13–14 remain the design reference the code implements.
