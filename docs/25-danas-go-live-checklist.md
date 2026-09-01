# 25 — Go-Live Checklist (Codex → Vercel → Wix Headless)

Reviewed and current as of **2026-09-01**. This is the exact step-by-step **you** run to build and
publish the VGP site with your real stack. Nothing touches the live site until the final step; you are
the sole publisher.

## Your stack (confirmed)
**Wix CMS (content)** → **Codex** (builds a Next.js headless app) → **GitHub** (the app repo) →
**Vercel** (hosts preview + production) → **your domain**. Same method as Brand Blueprint.
Brand Blueprint stays on **Shopify**; VGP is this Wix-Headless-on-Vercel build.

## Verified state (what's set up, 2026-09-01)
**VGP Wix CMS** — `metaSiteId 6b5d8f63-fc66-449d-8c07-2d826ef21d2d` — all populated, all
`editorial-review` (nothing public yet):
- Capabilities **7** · Programs **10** (4 institutional + 6 accelerator tiers; **cleaned 3 duplicates
  this review**) · Case Studies 3 · Insights 3 · Speaking 3 · **Partners 6** (real only; **removed 3
  placeholders this review**) · Founder Resource Directory **20** · Dana Profile 1 (**$1B line
  approved**) · Hot List collections (empty, admin-only) · Client Resources 1 · Restricted Routes 5.
- Images in `assets/vgp/`; specs in `docs/19–25`.

**Brand Blueprint (Shopify)** — store `The Brand Blueprint`:
- Episodes **43** (2 added since the migration) · Founder chapters 5 · Dana profile **$1B line
  approved** (mirrors VGP).
- ⚠️ **Founder Network Membership product is now `ACTIVE`** (I created it `DRAFT`). Before it can
  actually sell as a membership, confirm this was intentional **and** that the **Appstle** monthly plan
  is attached — otherwise it charges a one-time $99, not $99/month.

---

## PART 1 — Get the code (≈5 min)
1. Work is on GitHub **`dana774/tbb`**, branch **`claude/bb-vgp-staging-rebuild-5ww6ql`** (docs 19–25,
   `assets/vgp/`). Merge to `main` (ask me to open the PR — one click) or point Codex at the branch.

## PART 2 — Wix Headless access (≈15 min, one-time)
2. In the **Value Growth Partners staging** Wix dashboard → Settings → **Headless** → create an
   **OAuth app** with **READ** on the CMS. For the admin-only collections (Hot List, Client Resources,
   Restricted Routes) create a **server-side API key** — keep it server-side only.
3. Copy: **metaSiteId** `6b5d8f63-fc66-449d-8c07-2d826ef21d2d`, the **OAuth Client ID**, and the
   server API key.

## PART 3 — Run Codex (build the Next.js app)
4. Open Codex as you did for Brand Blueprint. Give it the repo + paste **`docs/20`** (build prompt) and
   **`docs/23`** (authoritative overrides — nav, CTA language, Calendly registry, single-ladder rule).
   Supporting: docs 21, 22, 24.
5. Tell Codex: build a **Next.js headless app** that reads the VGP CMS (metaSiteId above); render only
   `status = published`; implement the **Calendly exposure registry** (doc 23 §B — one public event
   after intake, everything else gated). Output the app to a GitHub repo.

## PART 4 — Deploy on Vercel (≈15 min)
6. In **Vercel** → New Project → import that GitHub repo. Framework: Next.js (auto-detected).
7. Add **Environment Variables** (both Preview and Production):
   - `WIX_CLIENT_ID` = your Headless OAuth Client ID
   - `WIX_META_SITE_ID` = `6b5d8f63-fc66-449d-8c07-2d826ef21d2d`
   - `WIX_API_KEY` = server-side key (mark it as a **server/secret** var, not exposed to the browser)
   - (match whatever variable names Codex generates in the app — align these to them.)
8. Deploy. Vercel gives a **Preview URL** first — every push builds a preview; `main` builds Production.
   Keep it on Preview until you approve.

## PART 5 — Review the preview
9. Open the Vercel Preview URL. Check: pages render; the **one** public Calendly gate works
   (`vgp-insight-session`, only after intake); Partners (6) + Founder Resource Directory (20) look
   right; About shows your portrait + the $1B line.
10. In the Wix CMS, flip records `editorial-review → published` as you approve each; the next Vercel
    build shows them.

## PART 6 — Go live
11. Clear the approval gates (full list in `docs/24`): single public naming family + pricing, offer /
    permission copy, W.E. Build dates, privacy/terms/accessibility + legal review.
12. In **Vercel → Settings → Domains**, add **valugrowthpartners.com** and follow the DNS instructions
    (point the domain's records to Vercel). Promote the build to Production. **You are the sole
    publisher and rollback owner.**

## Send me the last inputs anytime (non-blocking)
The **6 partners'** logos + confirmed edits (outreach emails ready to send), the **Speaking**
past-engagements list, optional real Dana portrait. Also tell me if the **Founder Network product
`ACTIVE` + Appstle plan** needs fixing and I'll sort it.

### Quick card
Repo `dana774/tbb` · branch `claude/bb-vgp-staging-rebuild-5ww6ql` · VGP metaSiteId
`6b5d8f63-fc66-449d-8c07-2d826ef21d2d` · paste `docs/20` + `docs/23` · Vercel env: WIX_CLIENT_ID /
WIX_META_SITE_ID / WIX_API_KEY · public phone +1 229-663-1684 · public Calendly only
`vgp-insight-session` after intake.
