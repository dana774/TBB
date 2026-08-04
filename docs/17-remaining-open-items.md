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
| **Best Damn Tape founder chapters** (Jeremy, Chao, Logan Quavo) | Names as they should appear, emails, and 1–2 paragraphs of source material each (or an episode to draw from) | Round-1 Q3 asked to feature them and move Kirti/Bass/Kika out. Nothing about them exists in the archive, so they can't be written faithfully without source. Current founder set on Shopify: Sruti Baz, Kanicka Joseph, Dr. Michelle Cromwell. |
| **$115M → ">$1B" account claim** | The per-role account figures from Dana's LinkedIn (Pepsi, Walmart, Colgate-Palmolive, P&G) to total and verify | I can't read LinkedIn. Held in `dana_profile` as pending-proof; will not publish as verified until confirmed. |
| **Dr. Michelle Cromwell "Dana's Insight" block** | Sign-off on the drafted insight text | Drafted, marked `[DRAFT — pending Dana's approval]`. |
| **Founder headshots** (Sruti, Kanicka, Michelle) + Best Damn Tape founders | Real photography + image consent | Founder grid shows gaps until supplied. See doc 05. |
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
