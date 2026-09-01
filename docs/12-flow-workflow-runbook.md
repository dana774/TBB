# 12 — Shopify Flow Implementation & Testing Sheet

**Why this is a sheet, not an API deployment:** Shopify Flow has **no public write API** — workflows are built only in the Flow editor (admin → Apps → Flow). This is the click-by-click implementation + testing matrix. **Every workflow stays INACTIVE until its trigger and downstream effects are tested (Dana's rule). No workflow is activated in staging.**

## System-of-record context (governs these workflows)
- **Shopify + Appstle** = system of record for **new Brand Blueprint membership** billing/access.
- **Wix** = system of record for **VGP relationships and existing VGP subscription billing**. **These workflows must never touch existing VGP/Wix subscriptions** (no import, cancel, rebill, recreate).
- Membership lifecycle events (tier, upgrade, downgrade, cancel, failed payment, recovery) originate from **Appstle Memberships / Shopify Billing**, surfaced to Flow via the Appstle connector or Shopify subscription/customer triggers. Where a trigger is Appstle-side, it is marked **[Appstle]**; Flow-native triggers are **[Flow]**.
- Calendly is the scheduling layer only, never the qualification layer. No workflow emails a visitor a scheduling link.

## Membership tiers (referenced below)
- **Free / open ecosystem** — no tag required.
- **Founder Network member** — customer tag `member` (Appstle applies on active subscription). Staging pricing "starts at $99/month"; **billing not activated**.

---

## Workflow matrix

Legend for **Activation status**: all = `INACTIVE (build + test only)` until Dana approves launch.

### 1. Newsletter welcome
- **Trigger:** [Flow] Customer created.
- **Conditions:** customer tags contain `newsletter`.
- **Actions:** send welcome email; add tag `signal-subscriber`.
- **Customer tags:** `newsletter` (in) → `signal-subscriber` (out).
- **Tier affected:** none.
- **Email/notification:** subscriber welcome ("You're on the list — the next Market Signal is coming").
- **Failure handling:** if email send fails, Flow retries per Shopify default; no tag rollback needed (idempotent).
- **Test record:** create a test customer with tag `newsletter`.
- **Expected result:** welcome email sent; `signal-subscriber` present.
- **Activation status:** INACTIVE.

### 2. Founder-intake acknowledgment
- **Trigger:** [Flow] Shopify Forms submission `Founder Intake` (or Customer created gated on `founder-intake` until Forms is wired).
- **Conditions:** always (any intake submission).
- **Actions:** send acknowledgment email; add tag `founder-intake`.
- **Customer tags:** `founder-intake`.
- **Tier affected:** none.
- **Email/notification:** "We've got your intake — here's what happens next" (no scheduling link).
- **Failure handling:** retry on send failure; tag is idempotent.
- **Test record:** submit the intake form as a test.
- **Expected result:** acknowledgment email; `founder-intake` tag.
- **Activation status:** INACTIVE.

### 3. Qualified founder routing
- **Trigger:** [Flow] same intake submission.
- **Conditions:** `Intake outcome branch` = `qualified_first_time_founder` (founder = Yes AND met Dana formally = No).
- **Actions:** add tags `route-fit-call`; internal notify Dana.
- **Customer tags:** `founder-intake`, `route-fit-call`.
- **Tier affected:** none.
- **Email/notification:** internal only to `dana@valugrowthpartners.com` ("Qualified first-time founder — fit call offered"). **No Calendly link emailed to the visitor**; the fit-call link is shown only on the qualified results page.
- **Failure handling:** if notify fails, retry; tag still applied for segmentation.
- **Test record:** intake with founder=Yes, met=No.
- **Expected result:** `route-fit-call` tag; internal email; visitor sees fit-call CTA on results page.
- **Activation status:** INACTIVE.

### 4. Human-review routing
- **Trigger:** [Flow] same intake submission.
- **Conditions:** `Intake outcome branch` ∈ {`prior_dana_relationship`, `non_founder_pathway`, `dana_review`}.
- **Actions:** add matching route tag; internal notify with 2-business-day SLA; Wait 2 days → reminder if not `review-done`.
- **Customer tags:** `route-prior-relationship` | `route-non-founder` | `route-human-review`.
- **Tier affected:** none.
- **Email/notification:** internal to Dana (submission details + SLA); reminder email after 2 days.
- **Failure handling:** reminder branch re-checks tags before sending to avoid duplicate nags; Dana closes with `review-done`.
- **Test record:** one intake per non-qualified branch.
- **Expected result:** correct route tag; internal email; reminder only if unresolved. No Calendly anywhere.
- **Activation status:** INACTIVE.

### 5. New-member onboarding
- **Trigger:** [Appstle] Subscription created / membership activated.
- **Conditions:** subscription is a **Brand Blueprint Founder Network** plan (exclude any legacy/VGP — those are Wix-only).
- **Actions:** send onboarding email (dashboard, resources, community); add tag `member`.
- **Customer tags:** `member`, `onboarding-sent`.
- **Tier affected:** Founder Network member.
- **Email/notification:** member welcome/onboarding.
- **Failure handling:** guard on `onboarding-sent` to avoid re-sending on reactivation.
- **Test record:** Appstle test subscription on a BB plan (test mode; no live billing).
- **Expected result:** `member` tag; onboarding email; dashboard access.
- **Activation status:** INACTIVE.

### 6. Tier assignment
- **Trigger:** [Appstle] Subscription created/updated.
- **Conditions:** map plan → tier.
- **Actions:** apply the tier's customer tag; remove superseded tier tags.
- **Customer tags:** `member` (Founder Network); future tiers add their own tag.
- **Tier affected:** the assigned tier.
- **Email/notification:** none (silent) or internal audit note.
- **Failure handling:** ensure single active tier tag (remove others) to prevent access ambiguity.
- **Test record:** Appstle test subscription; then change plan.
- **Expected result:** exactly one tier tag reflects the active plan.
- **Activation status:** INACTIVE.

### 7. Protected-access assignment
- **Trigger:** [Flow] Customer tags updated (gains/loses `member`).
- **Conditions:** on gain `member` → ensure access; on loss → revoke.
- **Actions:** (theme already gates protected resources + dashboard by the `member` tag via `bb-member-gate`) — this workflow only keeps an audit tag / internal log; optional notify.
- **Customer tags:** mirrors `member`; optional `access-granted` / `access-revoked` audit tags.
- **Tier affected:** Founder Network member.
- **Email/notification:** optional internal audit.
- **Failure handling:** access is enforced at render time by tag, so a Flow miss does not leak content.
- **Test record:** add then remove `member` on a test customer; hit a protected page each time.
- **Expected result:** protected page shows content only while tagged; denial state otherwise.
- **Activation status:** INACTIVE.

### 8. Membership upgrade
- **Trigger:** [Appstle] Subscription plan changed → higher tier.
- **Conditions:** new plan tier > old.
- **Actions:** swap tier tag; send upgrade confirmation.
- **Customer tags:** remove old tier tag, add new.
- **Tier affected:** new higher tier.
- **Email/notification:** upgrade confirmation.
- **Failure handling:** idempotent tag swap; confirm single tier tag.
- **Test record:** Appstle test plan change upward.
- **Expected result:** new tier tag + confirmation email.
- **Activation status:** INACTIVE.

### 9. Membership downgrade
- **Trigger:** [Appstle] Subscription plan changed → lower tier.
- **Conditions:** new plan tier < old.
- **Actions:** swap tier tag; send change confirmation; adjust access.
- **Customer tags:** remove old tier tag, add lower.
- **Tier affected:** new lower tier.
- **Email/notification:** downgrade/change confirmation.
- **Failure handling:** ensure access reduced to match new tier.
- **Test record:** Appstle test plan change downward.
- **Expected result:** lower tier tag; access adjusted.
- **Activation status:** INACTIVE.

### 10. Cancellation
- **Trigger:** [Appstle] Subscription cancelled/expired (**BB plans only** — never VGP/Wix).
- **Conditions:** cancelled plan is a BB Founder Network plan.
- **Actions:** remove `member` + tier tags; send cancellation confirmation + win-back pathway (no Calendly).
- **Customer tags:** remove `member`/tier; add `former-member`.
- **Tier affected:** downgrades to Free.
- **Email/notification:** cancellation confirmation.
- **Failure handling:** confirm all member/tier tags removed so protected access is revoked at next render.
- **Test record:** Appstle test cancellation.
- **Expected result:** tags removed; protected pages show denial state; confirmation email.
- **Activation status:** INACTIVE.

### 11. Failed-payment handling (dunning start)
- **Trigger:** [Appstle] Payment failed / subscription past-due.
- **Conditions:** BB plan.
- **Actions:** add tag `payment-issue`; send update-payment email; **do not** immediately revoke access (grace window).
- **Customer tags:** `payment-issue`.
- **Tier affected:** member retained during grace.
- **Email/notification:** payment-failed / update-card email.
- **Failure handling:** grace window before any access change; log attempt count.
- **Test record:** Appstle simulated failed payment (test mode).
- **Expected result:** `payment-issue` tag; dunning email; access retained during grace.
- **Activation status:** INACTIVE.

### 12. Payment recovery
- **Trigger:** [Appstle] Payment recovered / subscription reactivated.
- **Conditions:** previously `payment-issue`.
- **Actions:** remove `payment-issue`; confirm `member`/tier restored; send recovery confirmation.
- **Customer tags:** remove `payment-issue`.
- **Tier affected:** restored.
- **Email/notification:** payment recovered confirmation.
- **Failure handling:** ensure tier tags consistent after recovery.
- **Test record:** Appstle simulated recovery after #11.
- **Expected result:** `payment-issue` cleared; access confirmed; email sent.
- **Activation status:** INACTIVE.

### 13. Event reminder
- **Trigger:** [Flow] Scheduled/time-based relative to an event date (or Appstle/め calendar feed).
- **Conditions:** customer registered for the event (tag or attribute).
- **Actions:** send reminder email 24–48h before.
- **Customer tags:** `event-{slug}-registered` → optional `event-{slug}-reminded`.
- **Tier affected:** none.
- **Email/notification:** event reminder (links to the event's own registration URL, never Calendly).
- **Failure handling:** guard on `reminded` tag to avoid duplicates.
- **Test record:** test customer tagged for a near-future test event.
- **Expected result:** single reminder email.
- **Activation status:** INACTIVE.

### 14. Cross-brand VGP referral
- **Trigger:** [Flow] Customer tags updated OR intake branch = `non_founder_pathway` (institution/ESO).
- **Conditions:** audience indicates VGP fit (institution/ESO/advisory).
- **Actions:** add tag `vgp-referral`; internal notify; (visitor is routed on-site to the VGP cross-brand link — `https://www.valugrowthpartners.com/`). **No cross-system billing/data write into Wix** — referral is informational only.
- **Customer tags:** `vgp-referral`.
- **Tier affected:** none.
- **Email/notification:** internal referral notice.
- **Failure handling:** referral is advisory; no Wix mutation ever performed.
- **Test record:** intake as institution/ESO.
- **Expected result:** `vgp-referral` tag; internal notice; on-site VGP link fires `cross_domain_route`.
- **Activation status:** INACTIVE.

### 15. Consent and attribution recording
- **Trigger:** [Flow] Customer created / form submission.
- **Conditions:** always.
- **Actions:** record marketing-consent state and source/attribution (UTM or form `Form` field) to customer metafields/tags.
- **Customer tags:** `consent-marketing` (if opted in); `source-{channel}`.
- **Tier affected:** none.
- **Email/notification:** none.
- **Failure handling:** never assume consent — only tag when explicitly given.
- **Test record:** submit a form with and without marketing opt-in.
- **Expected result:** consent tag only when opted in; attribution recorded.
- **Activation status:** INACTIVE.

### 16. (Reserved) Membership renewal receipt — optional
- **Trigger:** [Appstle] Successful recurring charge.
- **Actions:** send renewal receipt.
- **Activation status:** INACTIVE. Build only if Dana wants a receipt beyond Shopify/Appstle defaults.

---

## Go-live checklist (per workflow, when Dana approves)
1. Wire the `Founder Intake` Shopify Form (replaces native contact form via the reserved app-block slot); confirm hidden `Intake outcome branch` maps through.
2. Confirm Appstle connector exposes subscription lifecycle events to Flow (for #5–12, #16).
3. Activate one workflow at a time; run its Test record; confirm Expected result; only then flip Activation status → ACTIVE.
4. Never activate a membership-billing workflow before live billing is approved.

## Guardrail
No workflow may email a visitor any scheduling link, write to Wix, or touch an existing VGP/Wix subscription. All member-billing workflows are BB-plan-scoped.
