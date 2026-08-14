# 22 — Founder Resource Directory: exposure decision + verification (2026-08-14)

## Decision (Dana, 2026-08-14) — FINAL
The **Founder Resource Directory** (contract manufacturers, 3PL/fulfillment,
warehouse/flexible space, packaging — the `FounderResourceDirectory` Wix
collection) stays a **gated member benefit delivered inside the Brand Blueprint
Founder Network** ($99/month and above), on the **Brand Blueprint / Shopify**
side.

It is **NOT** published as a public directory on the VGP site — not on the Wix
Studio staging site and not in the VGP headless (`vgp-headless/`, Astro) build.

> Decision history (same day): an interim instruction to build the directory as a
> public, category-filterable page on the VGP headless site was raised and then
> **reversed by Dana**. No public directory was built; no code was written for it.
> This doc is the settled record.

## Verification — the VGP frontend has no public directory (nothing to remove)
Checked against source + git history on branch `claude/new-session-q4or1d`:
- **No `/resources` route exists.** No `vgp-headless/src/pages/resources*` file
  now, and `git log --all --diff-filter=A` shows one was **never committed on any
  branch**. Astro builds routes only from page files → the deploy 404s for
  `/resources`. No index, no per-vendor detail, no teaser, no gated-preview stub.
- **`FounderResourceDirectory` is never wired into the frontend.** `content.ts`
  reads Capabilities, Programs, CaseStudies, Insights, Speaking, DanaProfile,
  Partners — not the directory. No records render publicly anywhere.
- **No internal links to clear.** Zero `/resources` links in nav, footer, or any
  page. The "Resource Library" / "Partner Directory" strings in `members.astro`,
  `membership.astro`, and `ecosystem.astro` describe **member benefits** (the
  gated end-state) and link nowhere public — left as-is.
- **Sitemap / structured data:** the app has **no sitemap integration**
  (`@astrojs/sitemap` absent) and the only JSON-LD in `Base.astro` is an
  **Organization** block. Neither referenced the directory. Whole site ships
  `<meta name="robots" content="noindex">` while staging.
- **410 needed? No.** The route was never built or deployed and the site is
  `noindex` staging — nothing was ever public to deindex.

## Data — preserved, not altered
`FounderResourceDirectory` on `Vgp Staging 2026` (`6b5d8f63…`) is intact:
- **20 records**, 4 categories × 5 (Contract Manufacturer, 3PL / Fulfillment,
  Warehouse / Flexible Space, Packaging).
- All `status: editorial-review`; each has a public `sourceUrl` (records were
  compiled from vendors' public sites).
- Collection permission `read: ANYONE`. **Only read-only queries were run — no
  record or field was modified.**

## Residual exposure + recommendation (not yet actioned)
The Wix Studio site still has `FounderResourceDirectory` at `read: ANYONE` with an
`EDITABLE_PAGE_LINK` dynamic page. That Studio site is **Draft / unpublished** and
is **superseded as the VGP frontend** (doc 20), so it is not public today. As a
belt-and-suspenders guard, recommend locking the collection `read: ANYONE → ADMIN`
so the directory cannot surface publicly even if that Studio site is later
published. Records are unaffected by a permission change. **Awaiting Dana's
go-ahead before making this mutation.**

## Guardrail for future prompts / automation
Any build prompt or automation that describes publishing this directory on the
**VGP site (Wix Studio or headless), Vercel, or as a public page** is **incorrect**
and must be corrected to this rule:
- Delivery is **gated, on the Brand Blueprint / Shopify (Appstle) side only.**
- **Do not** build or expose the directory on VGP.
- **Do not** duplicate the entitlement across Wix and Shopify (doc 20 / doc 11
  cross-brand rules).
- The `FounderResourceDirectory` data stays the system-of-record and feeds the
  member-gated Partner/Resource experience on Brand Blueprint.

## Follow-through — build prompt corrected (2026-08-14)
`docs/20-vgp-headless-build-prompt.md` carried a `### /resources — Founder
Resource Directory` section instructing a **public** category-filterable build.
That section was replaced with the gated rule above (and its Hot List
cross-reference fixed) on the **5 branches that contained it**:
`bb-vgp-staging-rebuild-5ww6ql`, `founder-network-resource-standards-y6a9nm`,
`founder-signal-agent-setup-93hxb2`, `hubspot-email-tracking-setup-1di0a9`,
`newsletter-intelligence`.

The other 3 branches carrying that prompt file
(`hubspot-auth-key-hjcwr8`, `hubspot-structure-integrations-5ocgxs`,
`vgp-funding-os-v2-deploy-4j9am4`) had **no** public `/resources` section — they
already use a gated `/client-sign-in → protected client resources` model — so no
change was needed. The canonical build branch (`new-session-q4or1d`, per doc 00)
never had the section. Net: no branch now instructs a public directory build.
