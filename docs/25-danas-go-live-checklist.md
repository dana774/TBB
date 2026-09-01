# 25 — Go-Live Checklist (VGP Astro app → Vercel)

Current as of **2026-09-01, post-consolidation**. Earlier drafts described a Next.js + Wix-CMS build and a
separate app branch — both are now out of date. The app is **built, consolidated onto the default branch,
and verified to build green.** You are the sole publisher; nothing touches the live domain until the last
step.

---

## What actually got built (verified in the repo + a local build)
- **Framework:** **Astro** (`output: hybrid`), Node **20.x** (`engines` pin). Not Next.js.
- **Location:** subdirectory **`vgp-headless/`**.
- **Branch:** the app now lives on the **default branch `claude/bb-vgp-staging-rebuild-5ww6ql`** — a
  parallel session merged the old app branch (`claude/new-session-q4or1d`) into it on 2026-09-01
  ("consolidate for go-live"). There is **no separate app branch to point at anymore.**
- **Content source:** **in the repo** — `vgp-headless/src/lib/content.ts` (7 capabilities, 3 institutional
  programs, case studies, insights, speaking, Dana profile, and **10 partners** already including
  Ark-La-Tex/Alt Finance–Thompson, Heloise Lanoix, Sengo, Nudge, Kaylee McFerson, Patrice Malloy,
  Veri-Core, Product Society, Sarah Horowitz Parfums, C2FO). **Wix CMS is retired** in this build — to
  change site copy you edit `content.ts`, not Wix.
- **CRM:** **HubSpot** (`src/lib/hubspot.ts`). Forms post to `/api/lead`; qualifier `/api/qualify`; plus
  `/api/calendly-webhook`.
- **Scheduling guardrail intact:** the one public fit-call URL is returned **server-side only** on the
  qualified advisory result (`FIT_CALL_URL`, default `vgp-insight-session`). Never in nav/footer or client
  source for non-qualified visitors.
- **Build status (local, 2026-09-01):** `npm install` (391 pkgs) + `npm run build` → **green**, all pages
  generate incl. all 10 `/network/<partner>` pages, `/programs/*`, `/network/funding-partners`. The
  Vercel-adapter path (`VERCEL=1`) also builds green and emits `.vercel/output`. `noindex` stays on until
  cutover.

## Two Vercel projects exist — consolidate to one
The repo references two hosts:
- **`tbb-roan.vercel.app`** — the repo's "About" link (the original import; this is the one that was
  erroring with 1-second builds, because it was building the repo root / wrong branch, before the app was
  consolidated onto the default branch).
- **`tbb-git-claude-vgp-referral-partners-value-growth-partners.vercel.app`** — a **`value-growth-partners`**
  Vercel project that has been building branch previews successfully.

Pick **one** project to be production (either works now that the app is on the default branch), configure
it as below, and delete/ignore the other so you're not maintaining two.

---

## PART 1 — Configure the chosen Vercel project (≈5 min)
1. Vercel → your VGP project → **Settings → General → Root Directory** → **`vgp-headless`** → Save.
   (Framework auto-detects as **Astro**; it auto-selects the Vercel adapter because Vercel sets `VERCEL=1`.)
2. Vercel → **Settings → Git → Production Branch** → **`claude/bb-vgp-staging-rebuild-5ww6ql`** (the
   default branch, which now contains the app) → Save.
3. **Node version:** the app pins `20.x`; set the project's Node.js version to **20** if it isn't already.
4. Redeploy. You should get a green build and a Preview/Production URL.

## PART 2 — Environment variables (≈5 min)
The site **builds and renders with zero env vars** (content is in-repo). Env vars only power CRM writes and
scheduling. Vercel → **Settings → Environment Variables** (Preview + Production):

| Variable | Needed? | Value / notes |
|---|---|---|
| `HUBSPOT_TOKEN` | **Required for forms** | HubSpot Private App token (contacts + deals write). Mark **secret**. Without it, forms render but don't write to the CRM. |
| `FIT_CALL_URL` | Recommended | `https://calendly.com/valugrowthpartners/vgp-insight-session`. Has a built-in default, so optional. |
| `BB_URL` | Recommended | Brand Blueprint cross-brand link target. |
| `EXISTING_CLIENT_SCHEDULE_URL` | Optional | Falls back to `FIT_CALL_URL`. |
| `HUBSPOT_PIPELINE` / `HUBSPOT_DEALSTAGE` | Optional | Default `default` / `appointmentscheduled`. |
| `CALENDLY_WEBHOOK_KEY` | Optional | Only if you wire the Calendly webhook signature check. |
| `PUBLIC_WIX_CLIENT_ID` | **Leave empty** | Deprecated — only if you ever re-enable live Wix reads. |

> The old `WIX_CLIENT_ID` / `WIX_META_SITE_ID` / `WIX_API_KEY` trio from earlier drafts is **not used**.

## PART 3 — Make the repo private (governance)
5. GitHub → `dana774/TBB` → **Settings → General → Danger Zone → Change visibility → Private.** The repo is
   currently **Public**, which exposes all of `docs/` (incl. the gated investor **Hot List** spec and
   restricted-route logic) and partner contact emails/phones embedded in `content.ts`. Making it private
   does not affect Vercel deploys (Vercel keeps its authorized Git connection). *(I can't change repo
   visibility from here — this is a GitHub UI action for you.)*

## PART 4 — Review the Preview (≈15 min)
6. Open the Preview URL and check:
   - Pages render; nav/footer correct; `noindex` present (staging).
   - Advisory pathway: the fit-call button appears **only** on the qualified result; other branches show no
     scheduling link.
   - Submit a test lead → confirm it lands in **HubSpot** (needs `HUBSPOT_TOKEN`).
   - `/network` partner pages render; partners show a "pending confirmation" banner (all `review:true`
     until each confirms their listing).

## PART 5 — Content sign-off (edit in `content.ts`; I can do these)
7. - **Partner naming:** the record is titled *"Ark-La-Tex Financial Consultants"* (site `altfc.net`). You'd
     asked to confirm **"Alt Finance"** as Thompson's public company name — give me the exact name/logo and
     I'll align it.
   - Flip each partner `review:true → confirmed` as they approve (outreach emails ready in
     `partners/outreach-emails.md` / the `.docx`).
   - About/Dana: confirm the approved cumulative **">$1B"** line (mirrors the Brand Blueprint Shopify
     profile).
   - Speaking: confirm the engagement list / dates.

## PART 6 — Go live
8. Clear the approval gates (offer/permission copy, W.E. Build dates, privacy/terms/accessibility + legal
   review). Remove `noindex` in `src/layouts/Base.astro`.
9. Vercel → **Settings → Domains** → add **`valugrowthpartners.com`**, follow the DNS steps, and **Promote**
   to Production. **You are the sole publisher and rollback owner.**

---

### Quick card
Repo `dana774/tbb` → make **Private** · default branch **`claude/bb-vgp-staging-rebuild-5ww6ql`** now
contains the app · app dir **`vgp-headless/`** · framework **Astro** · **build verified green** · Vercel
**Root Directory = `vgp-headless`**, **Production Branch = default**, **Node 20** · env **`HUBSPOT_TOKEN`**
(+ optional `FIT_CALL_URL`, `BB_URL`) · content in **`src/lib/content.ts`** · consolidate to **one** Vercel
project (`tbb-roan` or `value-growth-partners`) · public Calendly only `vgp-insight-session` after intake ·
public phone +1 229-663-1684.
