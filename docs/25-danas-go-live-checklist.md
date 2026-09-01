# 25 — Go-Live Checklist (VGP Astro app → Vercel)

Corrected against the **actual built app** on **2026-09-01**. Earlier drafts of this doc described a
Next.js + Wix-CMS build; that is **not** what got built. The real, deployable VGP site already exists in
this repo and this checklist matches it exactly. You are the sole publisher — nothing touches the live
domain until the final step.

---

## What actually got built (verified in the repo)
- **Framework:** **Astro** (`output: hybrid`), Node **20.x**. Not Next.js.
- **Location:** subdirectory **`vgp-headless/`** of repo **`dana774/tbb`**.
- **Branch:** **`claude/new-session-q4or1d`** (the Codex build). *Not* the specs branch
  (`claude/bb-vgp-staging-rebuild-5ww6ql`), which holds docs 19–25 + `assets/`.
- **Content source:** **in the repo** — `vgp-headless/src/lib/content.ts` (a ~455-line seed with 7
  capabilities, 3 institutional programs, case studies, insights, speaking, Dana profile, and **10
  partners** already including Ark-La-Tex/Alt Finance–Thompson, Heloise Lanoix, Sengo, Nudge, Kaylee
  McFerson, Patrice Malloy, Veri-Core, Product Society, Sarah Horowitz Parfums, C2FO).
  **Wix CMS is retired** in this build. To change site copy you edit `content.ts`, not Wix. (Live Wix
  reads are still possible but optional — only if `PUBLIC_WIX_CLIENT_ID` is ever set.)
- **CRM:** **HubSpot** (`src/lib/hubspot.ts`) — not Wix CRM. Forms post to `/api/lead`; the qualifier is
  `/api/qualify`; there is also `/api/calendly-webhook`.
- **Scheduling guardrail intact:** the one public fit-call URL is returned **server-side only** on the
  qualified advisory result (`FIT_CALL_URL`, defaulting to `vgp-insight-session`). Never in nav/footer or
  client source for non-qualified visitors.
- **Pages present:** home, about, how-we-work, advisory-pathway, capabilities, programs, case-studies,
  insights, speaking, institutional-inquiry, investors-partners, partner-contributor, ecosystem,
  founders, membership, members, network, privacy, terms, accessibility. `noindex` stays on until cutover.

## Why the Vercel builds show a 1-second error
The repo **root has no `package.json`** — the app is one level down in `vgp-headless/`. Vercel is
building the repo root (and, in the deployment you screenshotted, an unrelated branch), so it finds no app
and errors almost immediately. This is **configuration, not a broken build.** Two settings fix it:
**Root Directory = `vgp-headless`** and **Production Branch = `claude/new-session-q4or1d`**.

---

## PART 1 — Point Vercel at the real app (≈5 min) — fixes the failing builds
1. Vercel → your VGP project → **Settings → General → Root Directory** → set to **`vgp-headless`** →
   Save. (Framework auto-detects as **Astro**; the app auto-selects the Vercel adapter because Vercel
   sets `VERCEL=1` at build time — nothing to configure there.)
2. Vercel → **Settings → Git → Production Branch** → set to **`claude/new-session-q4or1d`** → Save.
   (Optional tidy-up later: rename that branch to `main` / make it the repo default, then point
   Production Branch at it. Not required to go live.)
3. If the project was first imported against the wrong repo root and won't re-detect, it's fastest to
   **delete the Vercel project and re-import** `dana774/tbb` with Root Directory `vgp-headless` from the
   start.

## PART 2 — Environment variables (≈5 min)
The site **builds and renders with zero env vars** (content is in-repo). Env vars only power CRM writes
and scheduling. In Vercel → **Settings → Environment Variables** (add to Preview + Production):

| Variable | Needed? | Value / notes |
|---|---|---|
| `HUBSPOT_TOKEN` | **Required for forms** | HubSpot Private App token, scope `crm.objects.contacts.write` (and deals). Mark **secret**. Without it, forms render but don't write to the CRM. |
| `FIT_CALL_URL` | Recommended | The one public Calendly (`https://calendly.com/valugrowthpartners/vgp-insight-session`). Has a built-in default, so optional — set it to be explicit. |
| `BB_URL` | Recommended | Brand Blueprint cross-brand link target. |
| `EXISTING_CLIENT_SCHEDULE_URL` | Optional | Falls back to `FIT_CALL_URL`. |
| `HUBSPOT_PIPELINE` / `HUBSPOT_DEALSTAGE` | Optional | Default `default` / `appointmentscheduled`. |
| `CALENDLY_WEBHOOK_KEY` | Optional | Only if you wire the Calendly webhook signature check. |
| `PUBLIC_WIX_CLIENT_ID` | **Leave empty** | Deprecated — only if you ever re-enable live Wix reads. |

> The old `WIX_CLIENT_ID` / `WIX_META_SITE_ID` / `WIX_API_KEY` trio from earlier drafts is **not used** by
> this app. Ignore it.

## PART 3 — Review the Preview (≈15 min)
4. Trigger a deploy (push to the branch, or **Redeploy**). It should now build the Astro app and give a
   **Preview URL**. Open it and check:
   - Pages render; nav/footer correct; `noindex` present (staging).
   - Advisory pathway: the fit-call button appears **only** on the qualified result; other branches show
     no scheduling link.
   - Submit a test lead → confirm it lands in **HubSpot** (needs `HUBSPOT_TOKEN`).
   - Partners show a "pending confirmation" banner (they're all `review:true` until each confirms).

## PART 4 — Content sign-off before launch (edit in `content.ts`)
5. Confirm/adjust these in `vgp-headless/src/lib/content.ts` (I can make the edits and push):
   - **Partner naming:** the record is titled *"Ark-La-Tex Financial Consultants"* (website `altfc.net`).
     You'd asked to confirm **"Alt Finance"** as Thompson's company name — tell me the exact public
     name/logo to use and I'll align it.
   - Flip each partner from `review:true` → confirmed as they approve their listing (outreach emails are
     ready in `vgp-partner-outreach-emails.docx`).
   - About/Dana profile: confirm the approved cumulative **">$1B"** line reads as you want (mirrors the
     Brand Blueprint Shopify profile).
   - Speaking: confirm the engagement list / dates.

## PART 5 — Go live
6. Clear the approval gates (offer/permission copy, W.E. Build dates, privacy/terms/accessibility + legal
   review). Remove `noindex` in `src/layouts/Base.astro`.
7. Vercel → **Settings → Domains** → add **`valugrowthpartners.com`**, follow the DNS instructions, and
   **Promote** the build to Production. **You are the sole publisher and rollback owner.**

---

## Housekeeping worth doing
- **Stop the stray Vercel error emails:** every branch push currently triggers a preview build that fails
  (no app at root). Once Root Directory is set, only branches that contain `vgp-headless/` build cleanly;
  you can also limit Vercel's "Ignored Build Step" or deployment branches to the app branch.
- **Brand Blueprint stays on Shopify** — unaffected by any of the above. Its Founder Network product is
  `ACTIVE` with the native Shopify Subscriptions monthly plan ($99/mo); no Appstle involved (confirmed).

### Quick card
Repo `dana774/tbb` · app branch **`claude/new-session-q4or1d`** · app dir **`vgp-headless/`** · framework
**Astro** · Vercel **Root Directory = `vgp-headless`** · env **`HUBSPOT_TOKEN`** (+ optional
`FIT_CALL_URL`, `BB_URL`) · content in **`src/lib/content.ts`** · public Calendly only `vgp-insight-session`
after intake · public phone +1 229-663-1684.
