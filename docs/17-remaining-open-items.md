# 17 — Remaining Open Items & Approval Gates (2026-08-04)

Current status of the Shopify Brand Blueprint build after the transcript-pipeline round.
Store `the-brand-blueprint.myshopify.com` remains **password-protected**; nothing here is
customer-visible. This doc is the single action list — everything below is either done, or
waiting on one specific input/approval from Dana.

## ✅ Done this round
- **Theme image slots filled** — hero, homepage Dana-authority band, and About-page portrait
  now use the Dana host image (unpublished "BB Preview" theme). See doc 16.
- **Transcript export/import pipeline delivered** — `shopify-migration/transcripts/`
  (`transform_transcripts.py`, `import_transcripts.py`, `README-import.md`). Faithful,
  local, governance-enforced (29 clean episodes only; 6 co-host-era slugs hard-excluded).
  Smoke-tested. **Execution is Dana's local run** (needs a Wix Episodes CSV export + a
  Shopify `write_metaobjects` token) — see that folder's README.

## ✅ Wix→Shopify content transfer (2026-08-04, round 2)
Confirmed where the real content actually lives: the live **"The Brand Blueprint" (site 792a)**
is a **Blog** — each episode is a blog post with a hi-res 3000×3000 cover image + the full
written article + a link out to Spotify. The other live site (6bd1) holds only *sample* founder
records. **No discrete founder headshots exist in any Wix CMS** — only episode cover art.
- **Episode images upgraded:** pulled all live blog cover images and set **28 Shopify episodes**
  to the hi-res versions (was low-res Spotify thumbnails). The **6 withheld co-host-era posts were
  excluded** (governance); the other 13 Shopify episodes aren't in the blog and kept their art.
  These are hotlinks to `static.wixstatic.com` (same pattern as the prior Spotify hotlinks) —
  a later hardening pass can rehost to Shopify's CDN.
- **2 new founder chapters built** (Dana confirmed): **Logan Cuvo / Best Dam Tape** (stage
  Distribution) and **Jeremy Chow / Tactus Technologies** (stage Development), grounded in their
  verified public episode content, marked `editorial-review`. Name corrections applied vs. the
  original brief ("Best **Dam** Tape," "Logan **Cuvo**," and "Jeremy **Chow**" of Tactus — a
  separate founder, not a third Best Dam Tape person).
- **Founder visual = episode cover art (Dana's choice) — follow-on needed:** the founder grid
  renders a `portrait` **file_reference**, but episode cover art is an external **URL**. To honor
  the choice, add an `image_url` (url) field to `founder_chapter`, populate each founder from
  their episode cover, and point `bb-founder-grid` at it. The 3 original founders have Shopify
  episodes to draw from; the 2 new founders have no episode record/cover yet.

## Account figure ">$1B" — verified, does NOT hold (see doc 18)
The three résumés document ≈**$265M** in stated peak account responsibility (PepsiCo $115M+,
Colgate-Palmolive $115M incl. Walmart, S.C. Johnson $35M+; P&G roles state no figure) — **not
>$1B**. Claim stays gated as pending-proof. **Dana to choose:** defensible language (doc 18) or
supply cumulative annual-value × years to substantiate. Full analysis in `docs/18`.

## ✅ Approved & executed (2026-08-04)
1. **3 placeholder episodes deleted.** `sample-episode-latest`, `sample-episode-interview`,
   `sample-episode-historical` removed per Dana's OK. Episode set is now **41 real episodes,
   zero samples** (verified).
2. **$99/month Founder Network product created as DRAFT.** Per Dana: **monthly, $99/month**.
   - Product: **Founder Network Membership** — `gid://shopify/Product/9102448689206`,
     status **DRAFT**, vendor "The Brand Blueprint", type "Membership".
   - Variant: "Monthly membership", SKU `FOUNDER-NETWORK-MONTHLY`, price **$99.00**.
   - Tagged `DRAFT-pending-launch-approval`. **No sales channel, no Appstle plan, no billing
     wired** — the recurring $99/month plan is attached in Appstle at launch, and the product
     is not published until Dana's explicit go-ahead. Entitlements live on Shopify only (doc 11).

## 🔒 Blocked — need material/data only Dana can provide
| Item | What's needed | Notes |
|---|---|---|
| ~~**Best Damn Tape founder chapters**~~ ✅ DONE | — | Built Logan Cuvo / Best Dam Tape + Jeremy Chow / Tactus from verified public episode content (editorial-review). Names corrected vs. brief. |
| **$115M → ">$1B" account claim** | Dana picks: defensible language OR cumulative annual-value × years per seat | Résumés verified at ≈$265M, not >$1B (doc 18). Held in `dana_profile` as pending-proof; will not publish as verified until Dana chooses. |
| **Dr. Michelle Cromwell "Dana's Insight" block** | Sign-off on the drafted insight text | Drafted, marked `[DRAFT — pending Dana's approval]`. |
| **Founder visuals** (all 5 founders) | Confirm the `image_url`-field + grid follow-on so episode cover art renders | Dana chose "use episode cover art." Requires the small field + theme change described above; 2 new founders have no episode/cover yet. |
| **Distinct Dana photography** | A real portrait session | Only one Dana image exists today; it now repeats across hero + Dana-authority band. |
| **Image rights / source metadata** | Photographer/source/rights for the promo images | Needed before any public publish. |
| **Founder consent** (story/image/metrics) | Recorded consent for each featured founder | Records held at `editorial-review` until consent logged. See `founder-consent-emails.md`. |

## Ready-to-run on approval (specs already exist)
- **Founder Network launch:** ✅ Draft product created ($99/month) → install Appstle Memberships
  → attach the $99/month subscription plan to the product → set entitlements (single source of
  truth on Shopify; never duplicate recurring entitlements onto Wix per doc 11) → Dana approves
  → publish to the online store. Appstle install + plan attach + publish are the remaining steps,
  all gated on Dana's launch go-ahead.
- **Transcript import:** run the pipeline in `shopify-migration/transcripts/`.
- **6 withheld co-host-era transcripts:** decision still open (doc 07 §1) — publish with a
  neutral historical note, edit, or withhold. Quarantined in `transcripts-HISTORICAL-HOLD.json`.

## Governance still holding
Sole-host imagery only; no co-host-era content surfaced; no private/STAGING assets published;
store password-protected; `$1B` claim gated as pending-proof; founder records gated on consent.
