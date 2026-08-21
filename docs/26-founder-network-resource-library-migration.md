# 26 — Founder Network Resource Library → Shopify (gated) — BLOCKED, runbook staged

**Status: not executed.** Nothing was read from Drive, nothing was written to Shopify. This doc
records the two blockers, the decisions Dana owns, and the runbook so the next session is a
straight execution.

> This doc is written **pre-manifest**. The seven collection READMEs could not be opened, so it
> contains **no resource counts, codes, or file lists** — those come from the READMEs and only
> from the READMEs. Do not populate them from memory or from folder listings.

## Blocker 1 — tool approvals (environment)

Every MCP call in this session returned `MCP tool call requires approval`, and the session is
non-interactive so the prompt cannot be answered. This blocked **reads as well as writes**:

| Call | Purpose | Result |
|---|---|---|
| `Google_Drive.read_file_content` (START HERE) | source of truth | requires approval |
| `Google_Drive.search_files` | locate the seven READMEs | requires approval |
| `Shopify.get-shop-info` (read-only) | confirm store + plan | requires approval |

This is the same gate documented in [13-shopify-prototype-status.md](13-shopify-prototype-status.md)
§"Blocked and why", now extended to reads and to the Drive connector.

**To clear:** run the migration from a session where these approvals can be granted, or grant the
Drive + Shopify connectors standing approval for this project.

## Blocker 2 — there is no gating mechanism installed (independent of Blocker 1)

The brief requires confirming the gating mechanism *before building*. Per the repo's verified store
record ([13](13-shopify-prototype-status.md), [09](09-bb-parking-handoff.md)):

- **Appstle Memberships is not installed.** Install is manual, via the App Store.
- **0 products** — the $99 Founder Network membership product does not exist.
- No member tier, customer tag, or protected-content rule exists to apply.

So the answer to "customer accounts + tags, or a membership app?" is currently **neither — nothing is
configured**. Building the eight pages before gating exists would publish the entire library
publicly, which is the precise opposite of the requirement. Gating must land first.

## Decision Dana owns: how member files are actually protected

This one changes the build, so it must be settled before any upload. The brief says no file or asset
URL may be reachable without an authenticated member session, **including direct file links**.

Shopify **Files (`fileCreate`) does not satisfy that.** Files uploaded to Shopify are served from the
public `cdn.shopify.com` CDN. The URLs are unguessable in practice, but they are *unlisted, not
authenticated* — anyone holding the URL fetches the file whether or not they are signed in, and the
URL survives the member's cancellation. Gating the *page* does not gate the *file*.

Three routes that do satisfy it:

| Route | How it meets the requirement | Cost |
|---|---|---|
| **A. Digital-delivery app** (Appstle / SendOwl / equivalent) | App proxies each download behind the customer session; links expire and die with the membership | Another app + subscription; per-file setup |
| **B. App proxy + external storage** | Files in S3/R2; a Shopify app proxy checks the session and issues short-lived presigned URLs | Most control, strongest guarantee; needs a small app built and hosted |
| **C. Unlisted Shopify CDN links behind gated pages** | Page is gated; file URLs are unlisted only | Cheapest, **does not meet the brief as written** |

Recommendation: **A** if the Appstle install is happening anyway (one vendor, one bill, one admin
surface); **B** only if the library is expected to outgrow an app's file handling. **C** should be
chosen only as a deliberate, recorded relaxation of the requirement — not by default.

The large-video special cases fold into the same decision: Shopify-hosted video is also public-CDN,
so route A or B has to cover the Market Signal videos and CAP-10 too, or they need a host that
supports signed playback (e.g. a private Vimeo/Mux-style setup) linked from the gated 03 page.

## Runbook (once both blockers clear)

1. **Gate first.** Install the membership app, create the member tier/tag, and prove that a
   signed-out visitor is redirected off a test gated page. Nothing else starts until this passes.
2. **Read the manifest.** START HERE, then all seven collection READMEs. Transcribe each README's
   resource table verbatim into a staged JSON payload under `shopify-migration/founder-network/`
   — one file per collection, one row per listed resource, carrying `code`, `format`,
   `description`, and source link. **The README is authoritative:** migrate exactly what it lists,
   no more (ignore unlisted files in the folder), no less.
3. **Reconcile before uploading.** For each collection, assert `rows staged == rows in README`.
   Any mismatch is investigated, not rounded.
4. **Upload once, link many.** GTM-04 and BRD-02 are one document — upload under **BRD-02**, and
   have GTM-04 on the 03 page point at that same asset. Never a second copy.
5. **Google-native items** — apply the brief's per-item routing, and record the choice per item:
   export the privately-filled worksheets (RET-12/13/14, and the Docs BRD-01/02/03/04, PTR-03) to
   XLSX/DOCX; keep **GOS-02** and **GTM-07** as live Drive links (GOS-02 is described as the
   ready-to-use in-Drive version; GTM-07 is a Form that must stay functional). Note that a live
   Drive link is by definition outside the store's gating — its Drive sharing must be tightened to
   match, or it becomes the hole in the wall.
6. **CAP-03** keeps both files (editable PPTX + PDF) under the single code, as the README presents them.
7. **CAP-10** (50 MB MP4) and the three Market Signal videos (~1.67 GB) go to the chosen video route
   from the decision above — not to Shopify Files.
8. **Build eight gated pages**: one hub mirroring START HERE (intro, seven collections, "ways in"
   routing, membership inclusions, fine print) and seven collection pages, each reproducing its
   README's journey fit, recommended path, resource list with working links, visuals, and the
   **Notices block verbatim** on every page. Codes are load-bearing — documents cross-reference each
   other by code — so every code survives exactly as written.
9. **Verify signed out.** Hit all eight page URLs and a sample of file/asset URLs in a clean session;
   every one must 404 or redirect to login.

## Do not migrate (confirmed from the brief)

- Everything in **"Founder Network — Uploads to Sort"** (internal VGP material: investor CRM,
  referral partner agreement draft, client templates, BD emails). Sole exception: the three Market
  Signal videos named in 03's README.
- The two hub-root **`[ARCHIVED v1 …]` / `[ARCHIVED v2 …]`** docs (superseded START HERE versions).
- **`BB_Member_Founder-Network-Playbook_v1.docx`** — not listed in START HERE or any README.
  **Awaiting Dana's answer** before it is included or dropped.

## Open questions for Dana

1. **File protection route — A, B, or C above?** Blocks every upload.
2. **`BB_Member_Founder-Network-Playbook_v1.docx` — include or leave behind?** The brief says ask.
3. **Appstle, or plain customer accounts + tags?** [09](09-bb-parking-handoff.md) assumes Appstle for
   the $99 membership; if the library should instead gate on account tags alone, that is a different
   build and a different billing story.
