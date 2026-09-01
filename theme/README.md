# The Brand Blueprint — Shopify Theme (Phase 1)

Dawn 15.5.0 fork for the password-protected dev store `the-brand-blueprint.myshopify.com`.
**Unpublished preview only. Never publish this theme without Dana's explicit approval.**

Build plan, schema and acceptance tests: [`../docs/09-shopify-phase1-plan.md`](../docs/09-shopify-phase1-plan.md).

## Conventions

- Everything Brand Blueprint is `bb-` prefixed (sections, snippets, assets). Dawn core is touched minimally (`layout/theme.liquid` wires in `bb-tokens.css`, `bb-theme.css`, `bb-intake.js`, `bb-schema-org`).
- Design tokens live in `assets/bb-tokens.css` only — components consume the variables, never restate hex values.
- Seed/staging copy is labeled `[EDITORIAL REVIEW]`.

## Store-side setup this theme expects

1. **Metaobject definitions** (create in admin; each with the listed fields used by the sections):
   `founder_chapter` (web pages ON, template `metaobject/founder_chapter`), `episode`, `signal`, `resource`, `event`, `funding_opportunity`, `dana_profile` (singleton).
2. **Pages** using the BB templates: start, founder-intake, intake-next-steps, founders, podcast, about, membership, member-dashboard, plus one page per resource (public/protected template).
3. **Theme settings → Brand Blueprint**: set the fit-call URL (the single approved `vgp-insight-session` Calendly event) and the VGP cross-brand URL. These are deliberately **not** in Git.
4. **Appstle Memberships** applies the member tag (default `member`); no plans/billing activated in Phase 1.

## Working locally

```sh
npm install -g @shopify/cli
shopify theme check --path theme --fail-level error   # must be zero errors
shopify theme push --path theme --unpublished --theme "BB Phase 1 - DO NOT PUBLISH"
```

Authenticate with a Theme Access token via `SHOPIFY_CLI_THEME_TOKEN` + `SHOPIFY_FLAG_STORE=the-brand-blueprint.myshopify.com` — never commit tokens.

## Intake logic (guardrail)

Only a founder/business owner who has **not** previously met Dana formally reaches the fit-call CTA. Branch evaluation lives in `assets/bb-intake.js`; the no-JS fallback is the human-review branch, never the fit-call. The results section renders a Calendly link exclusively from the `bb_fit_call_url` theme setting.
