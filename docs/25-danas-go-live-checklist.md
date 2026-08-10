# 25 — Dana's Go-Live Checklist (build the VGP site on Codex)

Everything is prepared and pushed. This is the exact step-by-step **you** run to get the VGP site
built with the Codex headless method (same as Brand Blueprint). Nothing here touches your live site
until the final step, and you are the only publisher.

---

## PART 1 — Get the code (≈5 min)
1. The finished work is on GitHub: **`dana774/tbb`**, branch **`claude/bb-vgp-staging-rebuild-5ww6ql`**.
   All specs are in **`/docs` (19–25)**; images in **`/assets/vgp/`**.
2. Get it into Codex one of two ways:
   - **Easiest:** merge that branch to `main` (ask me to open the pull request — one word and it's done),
     then point Codex at `main`; **or**
   - Point Codex directly at the branch `claude/bb-vgp-staging-rebuild-5ww6ql`.

## PART 2 — Wix Headless access (≈15 min, one-time)
3. In the Wix dashboard for **Value Growth Partners staging** → Settings → **Headless** → create an
   **OAuth app** (or admin API key) with **READ** on the CMS collections.
4. Copy two things Codex will need:
   - **metaSiteId:** `6b5d8f63-fc66-449d-8c07-2d826ef21d2d`
   - the **OAuth Client ID** (and, for the admin-only collections, a server-side key — keep it server-side).

## PART 3 — Run Codex (the build)
5. Open Codex the same way you did for The Brand Blueprint.
6. Give it the repo **plus these two files as the prompt:**
   - `docs/20-vgp-headless-build-prompt.md` (the build prompt)
   - `docs/23-v3-master-spec-reconciliation.md` (**authoritative** overrides — nav, CTA language,
     Calendly registry, single-ladder rule)
   - supporting: `docs/21` (gated Hot List), `docs/22` (images), `docs/24` (runbook).
7. Tell Codex:
   - Read content from the **VGP CMS** (metaSiteId above); render only records with `status = published`.
   - Build to a **staging preview only**. **Do not touch the live valugrowthpartners.com site.**
   - Implement the **Calendly exposure registry** (doc 23 §B): one public event after founder-intake
     qualification; everything else gated/inactive.

## PART 4 — Review & approve
8. Open the preview URL Codex gives you. Check: pages render, the **one** public Calendly gate works,
   Partners + Founder Resource Directory look right, About shows your portrait and the $1B line.
9. In the Wix CMS, flip records from `editorial-review` → `published` as you approve each.
10. Approve the go-live gates (full list in `docs/24`): the single public naming family + pricing,
    offer/permission copy, W.E. Build dates, and privacy/terms/accessibility + legal review.

## PART 5 — Send me the last inputs (whenever — non-blocking)
11. The **6 partners'** logos + confirmed edits (the outreach emails are ready to send),
    the **Speaking** past-engagements list, and (optionally) a **real Dana portrait**.
    I'll upload/wire them and flip the confirmed partners to `published`.

## PART 6 — Publish
12. Only when you're satisfied, connect the domain / publish. **You are the sole publisher and rollback
    owner.** Brand Blueprint stays on Shopify; VGP goes live on Wix.

---

### Quick reference
- **Branch:** `claude/bb-vgp-staging-rebuild-5ww6ql` · **Repo:** `dana774/tbb`
- **VGP metaSiteId:** `6b5d8f63-fc66-449d-8c07-2d826ef21d2d`
- **Public phone:** +1 229-663-1684 (never the 480 number) · **Public Calendly:** only `vgp-insight-session`, after intake
- **Build prompt to paste:** `docs/20` + `docs/23`
