# 12 — Shopify Flow Workflow Runbook (operator build guide)

**Why this is a runbook, not an API deployment:** Shopify Flow has **no public write API** — workflows can only be created in the Flow editor (admin → Apps → Flow, or flow.shopify.com). This doc turns the doc 10 §1 specs into click-by-click steps with paste-ready values so Dana (or a VA) can build all three in ~15 minutes. **Leave every workflow toggled OFF (draft) until Dana approves intake go-live.**

Prerequisite: the intake later moves from the native contact form to a **Shopify Forms** form named `Founder Intake` (the theme already reserves the app-block slot in `bb-intake-form`). Until then, the trigger is the contact-form submission. Both carry the hidden field `Intake outcome branch`.

---

## WF1 — "BB Intake: outcome tagging"

1. Flow → **Create workflow** → name it `BB Intake: outcome tagging`.
2. **Trigger:** search `Shopify Forms` → **Form submitted**. (If Forms isn't wired yet, use trigger **Customer created** and gate on the tag `founder-intake` in step 3 instead.)
3. Add condition **Form / Submission** field `Intake outcome branch`. Build four branches (use "Add condition" → "Or" groups, or a Decision split):

   | If `Intake outcome branch` equals | Action → **Add customer tags** |
   |---|---|
   | `qualified_first_time_founder` | `founder-intake`, `route-fit-call` |
   | `prior_dana_relationship` | `founder-intake`, `route-prior-relationship` |
   | `non_founder_pathway` | `founder-intake`, `route-non-founder` |
   | `dana_review` (else) | `founder-intake`, `route-human-review` |

4. Save. **Leave OFF.**

## WF2 — "BB Intake: human-review SLA"

1. New workflow → `BB Intake: human-review SLA`.
2. **Trigger:** same as WF1.
3. **Condition:** `Intake outcome branch` is `prior_dana_relationship` **OR** `dana_review`.
4. **Action → Send internal email:**
   - To: `dana@valugrowthpartners.com`
   - Subject: `Intake needs your review — 2-business-day SLA`
   - Body (paste; Flow fills the `{{ }}` variables from the submission):
     ```
     A Founder Intake submission needs a human decision.

     Name: {{ submission.name }}
     Email: {{ submission.email }}
     Outcome branch: {{ submission.Intake outcome branch }}
     Message: {{ submission.body }}

     SLA: respond within two business days. After responding, add the
     tag "review-done" to this customer to close the loop.
     ```
5. **Action → Wait** `2 days`.
6. **Condition after wait:** customer still tagged `route-human-review` or `route-prior-relationship` **AND** not tagged `review-done` → **Send internal email** reminder (same address, subject `Reminder: intake still awaiting your review`).
7. Save. **Leave OFF.**

## WF3 — "BB Newsletter: segmentation" (optional)

1. New workflow → `BB Newsletter: segmentation`.
2. **Trigger:** **Customer created**.
3. **Condition:** customer tags contain `newsletter`.
4. **Action → Add customer tags:** `signal-subscriber`.
5. Save. **Leave OFF.**

## Guardrail (applies to all)
No Flow action may email a visitor any scheduling link. Every email above is **internal only** (to Dana). The qualified-founder fit-call link is rendered only on the intake results page from the `bb_fit_call_url` theme setting — never from Flow.

## Go-live checklist (when Dana approves)
1. Wire the `Founder Intake` Shopify Form (replaces the native contact form via the app-block slot).
2. Confirm the hidden `Intake outcome branch` field maps through.
3. Toggle WF1 ON, submit one test of each branch, confirm tags apply.
4. Toggle WF2 ON, confirm the internal email arrives.
5. WF3 ON if desired.
