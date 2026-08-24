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

## Blocker 2 — CORRECTED 2026-08-24: gating stack exists, but it is not one app

> **This section originally said "no gating mechanism is installed," citing docs 13 and 09. That was
> stale.** The current state lives in **docs 34 and 35 on branch `claude/new-session-q4or1d`**
> (commit `dfd6df2`), which this branch did not have. Docs 09/11/13/17 and `README.md` on this
> branch still describe the **superseded Appstle architecture** — treat 34/35 as authoritative and
> do not act on the Appstle references elsewhere in this repo.

Per the 2026-08-14 platform reset, gating is a **three-part native stack**, not a membership app:

| Part | What it does | State |
|---|---|---|
| **Shopify Subscriptions** (first-party) | Bills the $99/mo — product `founder-network-membership`, `SellingPlan/2346582070` | In place. **Billing only — it does no gating.** |
| **`bb-member-gate.liquid`** (native theme snippet) | The actual gate: renders gated content only when `customer.tags contains "Founder Network"` | In place, in BB Preview theme `154677215286` |
| **Shopify Flow** | Applies/removes the `Founder Network` tag on subscription activate/cancel | 🔴 **NOT BUILT** |

**Appstle (Subscriptions + Memberships) was uninstalled in the reset. Do not reinstall it.**

**Launch-critical gap (doc 35):** Appstle used to apply the tag; nothing does now. Until Flow A/B
exist, a paying subscriber gets no tag and `bb-member-gate.liquid` locks them out. This fails
*closed*, so it is not leaking — but the chain is broken.

## Blocker 3 — the native gate does not satisfy the file-level requirement

This is the half the reset did **not** solve, and it is independent of the Flow gap.
`bb-member-gate.liquid` is Liquid: it runs at page render and conditionally omits HTML. It has no
effect on the file URL behind a resource. So under the current stack:

| Request | Result |
|---|---|
| Signed-out visitor → a `member-*` page | blocked ✅ |
| Signed-out visitor → the file URL directly | **file served** ❌ |
| Cancelled member (tag removed) → any file URL they saved | **still works, permanently** ❌ |

The brief requires that no file or asset URL be reachable without an authenticated member session.
A tag check in Liquid cannot deliver that, because `cdn.shopify.com` performs no session check.

**Third hole — the Drive links.** Doc 35 records CAP-10 still pointing at the Drive video, and the
Market Signal videos not yet moved. A Drive link sits entirely outside the Shopify gate — its access
is governed by Drive sharing, not by `customer.tags`. The same applies to the Google-native items the
brief says to keep live (GOS-02, GTM-07): their Drive sharing must be tightened to match, or they
become the way around the wall.

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
| **A. Digital-delivery app** (SendOwl / Sky Pilot / equivalent — **not Appstle**, it is uninstalled by decision) | App ties each download to the customer/order and expires links | Another app + subscription; per-file setup |
| **B. App proxy + external storage** | Files in S3/R2; a Shopify app proxy checks the session and issues short-lived presigned URLs | Most control, strongest guarantee; needs a small app built and hosted |
| **C. Unlisted Shopify CDN links behind the native gate** | Page is gated; file URLs are unlisted only | Free, **does not meet the brief as written** |

Recommendation given the reset's direction (native, free, fewer vendors): **B** is the only route
that actually delivers "no asset URL reachable without an authenticated session," and an app proxy
fits the native/no-extra-vendor posture — at the cost of a small app to build and host. **A** is the
lower-effort route if adding one vendor is acceptable. **C** should be chosen only as a deliberate,
recorded relaxation of the requirement — not by default.

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

## Scope divergence to resolve (found 2026-08-24 in doc 35)

The original brief and the post-reset build describe **different shapes**, and this needs settling
before collections 02–07 are built:

- **Brief:** 7 Drive folders → 7 gated collection pages + 1 hub, content authored as pages.
- **Doc 35:** **9** library collections with different names, content as `resource` **metaobjects**
  rendered by `bb-resource-library` grouped by `collection_name`, with a handle→collection mapping
  that **splits and merges** the Drive folders (e.g. `member-sales-gtm` *and* `member-brand-messaging`
  both land in "Marketing, Content + Customer Growth"; `member-operations-forecasting` splits across
  "Product, Packaging + Operations" and "Growth OS + Founder Systems").

Doc 35 also records **Capital Access already migrated** — 11 metaobjects CAP-01…CAP-11. So the
resource **codes are being preserved** under the new taxonomy, which is what the brief actually
requires. Remaining: collections 02–07.

If the 9-collection taxonomy stands, "one gated page per README" is no longer the right target —
the READMEs still supply the manifest (codes, formats, descriptions, links, Notices), but the
grouping follows doc 35's mapping.

## Open questions for Dana

1. **File protection route — A, B, or C above?** Blocks every upload. The native gate does not
   cover files; see Blocker 3.
2. **`BB_Member_Founder-Network-Playbook_v1.docx` — include or leave behind?** The brief says ask.
3. **Taxonomy — 7 README collections or doc 35's 9?** See the divergence above.
4. **Who builds Flow A/B?** Doc 35 calls it an owner action, not API-creatable from the content
   lane. Until it exists, no subscriber can pass the gate.
