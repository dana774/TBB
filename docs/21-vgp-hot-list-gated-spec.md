# 21 — VGP Hot List: Investor-Gated Digest Specification

The VGP Hot List is a weekly digest that surfaces **vetted founders and their active raises to
approved investors**. It carries **highly confidential founder data** — raise amounts, capital
secured, use of funds, data-room links. This document specifies how to build it **safely**: gated
access, founder consent, and zero public exposure. It complements the public build in doc 20 (the
Hot List is explicitly NOT a public page there).

## 0. Relationship to the BB Investor Pipeline (v3.0)
Per the v3.0 master spec, **public investor lead-capture belongs to the Brand Blueprint _Investor
Pipeline_ form** (BB owns the investor front door). This gated Hot List is the **downstream product**:
the weekly digest served **only to vetted, approved investors** (many sourced via that BB form). They
are complementary — the BB form captures interest; the Hot List (below) serves confidential deal flow to
approved investors. Nothing here changes the "never public" rules.

## 1. Non-negotiable governance
- **Never public.** No public route, no sitemap/index entry, `noindex`, no public API read. Founder
  raise/round/capital/data-room fields must never render outside an authenticated investor session.
- **Founder consent is required per feature.** A founder appears **only** if
  `consentInvestorVisibility = true` with a `consentRef` (link/id of the signed authorization). No
  consent → not rendered, even in the gated view. Consent is per issue-cycle; stale consent is
  treated as false.
- **Investors are vetted and approved.** Access is invite/approval-only; an investor must be
  authenticated **and** hold the `investor` role, and must have accepted the Hot List access terms /
  confidentiality (NDA-style) before first view.
- **Data minimization.** Circulate the outcome, not the raw pipeline. Data-room links are
  time-boxed/revocable; never embed credentials. No analytics/marketing tracking on gated founder data.
- **Staging carries no real client financials.** The backing collections exist but stay empty until
  Dana populates them with consented, production data. Do not seed sample raises that look real.

## 2. Data model (Wix CMS — ADMIN-only, already created)
Both collections are **read: ADMIN** (no direct client/member read). The headless app reads them
**only** through a backend function that first verifies the caller's investor role (see §4).

**`HotListIssues`** (one row per weekly edition):
`issueNumber`, `slug`, `issueDate`, `ecosystemInsights` (rich text — non-sensitive briefing),
`aboutBlurb` (rich text), `status` (draft / published-to-investors).

**`HotListFeatures`** (one row per featured founder per issue):
`issueRef` (→ issue), `featureType` (client-snapshot | investment-opportunity), `clientName`,
`founderNames`, `clientLogo`, `businessProfile`, `fundraisingNeeds`, `businessNeeds`, `supportNeeded`,
`round`, `raiseAmount`, `capitalSecured`, `useOfFunds`, `timeline`, `traction`, `topNeeds`,
`investorProfile`, `summary`, `website`, `linkedin`, `dataRoomUrl`, **`consentInvestorVisibility`
(boolean)**, `consentRef`, `status`.

Resource Partner Highlights reuse the public `Partners` collection — no duplication.

## 3. Sections (from Dana's template)
1. **This Week in the Ecosystem** — 3–5 non-sensitive briefing bullets (`ecosystemInsights`).
2. **Key Client Snapshots** — consented founders: profile, key needs, and fundraising info.
3. **Investment Opportunities** — active raises: amount, round, traction, ideal investor fit.
4. **Resource Partner Highlights** — from `Partners` (published only).
5. **About VGP** — mission + the approved Calendly (`vgp-insight-session`) and contact.

## 4. Access control & gating (build)
- **Auth:** Wix Members / headless member auth. Gate the entire `/investors/hot-list` area behind login.
- **Role:** issue an `investor` role/badge on approval. The gated area and the backend data function
  both check `member.roles includes "investor"`; without it → 403, redirect to an access-request page.
- **Server-side only:** the front end never queries `HotListIssues` / `HotListFeatures` directly.
  A backend function (Velo `.jsw` or headless server route) (a) verifies the session + investor role,
  (b) queries with elevated permission, (c) **filters `consentInvestorVisibility === true` and
  `status === published-to-investors`**, (d) strips any field the tier shouldn't see, (e) returns only
  the assembled issue. Data-room links are returned as short-lived/redirected URLs, never raw.
- **Approval flow:** investor applies (or is invited) → Dana reviews/approves → role granted + access
  terms accepted → access. Revocation removes the role immediately.
- **Audit:** log issue views by investor (who/when) for confidentiality accountability; this log is admin-only.

## 5. Routes
- `/investors` — public: what the network is, how to apply for access (no founder data). CTA: request access.
- `/investors/hot-list` — **gated**: current issue. Requires auth + `investor` role.
- `/investors/hot-list/{issueSlug}` — **gated**: past issues (archive), same guard.
- `/investors/request-access` — application form → Dana approval queue.

## 6. Optional email distribution (secondary)
The template is email-shaped. If Dana emails the digest: send **only** to the approved investor list,
include **only** consented founders, and prefer a "log in to view" link over embedding raise/data-room
details in the email body. Never BCC-blast; never include non-consented founders. Same consent + audit
rules as the web view.

## 7. Build acceptance criteria
- No `HotListIssues`/`HotListFeatures` field reachable without an authenticated `investor` session —
  verify by hitting the data function unauthenticated (→ 403) and as a non-investor member (→ 403).
- A founder with `consentInvestorVisibility = false` never appears in any rendered issue.
- No Hot List route in the sitemap; pages carry `noindex`; no founder financial field in any public bundle.
- Data-room links are never exposed to non-investors and are time-boxed.
- Grep the public build for raise/round/data-room strings → zero matches outside the gated area.

## 8. Status
Collections created (ADMIN-only, **empty**). Spec ready for the headless build. Populating real
consented founder data + standing up the investor role/approval flow is Dana's go — nothing here is
live, and no real founder financials exist in staging.
