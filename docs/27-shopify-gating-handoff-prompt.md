# Doc 27 — Handoff prompt: gate the Founder Network Resource Library on the Shopify site

The prompt below is written to be handed verbatim to the agent moving the member library
onto the Brand Blueprint Shopify site. It reflects the library state as of 2026-08-14
(after the doc-26 standards pass, rights resolutions, and dedup audit).

---

ROLE
You are publishing the Founder Network Resource Library to the Brand Blueprint Shopify
site as **member-gated content**. The canonical library lives in Google Drive under
"Founder Network — Members" (folder `1ls2sHkPm9f-qtAhEiupuxhLk7TetWE0m`), organized as
seven collections (01 · Capital Access, 02 · Retail Readiness, 03 · Sales & GTM,
04 · Operations & Forecasting, 05 · Brand & Messaging, 06 · Growth OS & AI,
07 · Partner Directory). Treat Drive as the source of truth — do not alter file contents.

WHAT TO PUBLISH
1. Mirror the seven collections as gated library sections, in numbered order. Each
   collection page uses: its cover graphic (`BB_[Collection]_Cover_v1.svg`, in the
   folder; PNG versions in the TBB repo at `assets/founder-network/artwork/png/`), its
   teaching infographic, and the intro/journey copy from that folder's
   "README — What's in this collection" doc. The README defines the resource order,
   descriptions (who it's for / when to use / what it produces), and recommended path —
   use its copy verbatim; do not rewrite descriptions.
2. Every file whose name starts with `BB_` is a member resource. Files keep their exact
   names — the naming convention `BB_[Collection]_[ResourceName]_v[X].[ext]` and the
   resource IDs in the READMEs (CAP-, RET-, GTM-, OPS-, BRD-, GOS-, PTR-) are the
   catalog keys. Native Google Docs/Sheets/Forms are linked (view-only links);
   Office/PDF/ZIP files are offered as gated downloads.
3. Hub-level pages: publish "★ START HERE — Founder Network Member Home" as the library
   landing page, "Founder Network — Member Use & Legal Notice" as a linked policy page,
   and "★ What's New in the Hub — August 2026" as the update note. The Founder Network
   Playbook (`BB_Member_Founder-Network-Playbook_v1.docx`) sits on the landing page.
4. Three Market Signal videos (linked in the 03 README, 415–670 MB) should be hosted on
   the site's video infrastructure, gated, rather than served from Drive.

GATING RULES
- Access: Founder Network members ($99/month and above) and active VGP advisory
  clients only. No resource page, file URL, or video may be reachable without login.
- Use this access statement wherever access is described: "The Founder Network Resource
  Library is included with Founder Network membership at $99/month and above, as well as
  active VGP advisory clients. Resources are educational and action-oriented; tailored
  strategy, implementation, and direct support are available through the appropriate
  Value Growth Partners or Growth OS engagement."
- Do NOT publish anything from Drive staging ("Founder Network — Uploads to Sort") or
  anything not named `BB_` / not listed in a README. Investor databases and Hot List
  data are gated separately (investor-gated, per the v3.0 spec) — they are not part of
  this library and must not appear.
- Keep every notice and disclaimer that appears in the READMEs and on resource covers —
  the © line, "not legal/financial/investment/tax advice," "not for redistribution,"
  the time-sensitivity flags on trackers, and the partner-directory disclosure ("VGP may
  receive a referral fee…"). These must be visible on the pages, not only inside files.
- Footer for library pages: "© 2026 Value Growth Partners · Founder Network member
  resource · Not for redistribution."

BRAND
Palette: Navy #071E41, Deep Blue #0B2D57, Blueprint Blue #3978D7, Warm Gold #C89B2C,
Pale Blue #EFF5FF, Soft Gray-Blue #F5F8FC, Body Gray #4B5563, white canvas. Serif
display (Playfair-class) for headings, Inter/Arial-class sans for body. Voice:
founder-first, warm, high-integrity — no hype, no guaranteed-outcome language, no
fabricated metrics. The lockup line is "THE BRAND BLUEPRINT · Powered by Value Growth
Partners · Growth OS."

KNOWN PENDING ITEMS (verify before launch)
- Ten branded files (5 treated DOCX + 5 locked PDFs) may still be pending drag-in from
  the TBB repo (`assets/founder-network/branded-docs/`) to folders 01, 02, 04, 07. If
  present in Drive, prefer the branded PDF as the download version of that resource.
- READMEs were finalized 2026-08-14; if a folder's contents and README disagree, flag it
  back to Dana rather than guessing.

DELIVERABLE
A gated library section live on the site mirroring the seven collections, plus a short
report to Dana: pages created, files linked vs. hosted, anything skipped and why, and
any file you found in Drive that was not listed in a README.
