# 15 — Shopify Store Preferences Completion Checklist

Review of Online Store → Preferences (from Dana's 2026-07-23 screenshots). Verdict: the store is **almost fully configured correctly for staging**. Only the two homepage SEO text fields are genuinely incomplete, and they're low-urgency because the store is password-protected (noindex) until launch. None of these are settable through the Admin API — they're admin-UI settings — so the values below are paste-ready for the Shopify app/admin.

## Store access — ✅ correct, no change
- **Password protection: ON**, password `ucleax`. Keep ON. **Do not turn OFF until Dana approves launch** — this is what keeps the whole build private.
- **Restrict to B2B customers only: OFF.** Correct.

## Social sharing image and SEO — ⚠️ complete these two fields
- **Home page title** (currently empty → showing the myshopify domain). Paste (68 chars, under the 70 limit):
  `The Brand Blueprint — Build a brand that earns its place on the shelf`
- **Meta description** (empty). Paste (≤320):
  `The Brand Blueprint is the founder ecosystem: Founder Chapters, market signals, an eight-stage framework, and a podcast for consumer-brand founders ready to grow.`
- **Social sharing image** (empty). Add a 1200×628 BB-branded image once the design asset exists (doc 05 gap). Low priority while noindex.
- **Automatic hreflang tags: ON.** Harmless for a single-language store; leave as-is.

## Automatic redirection — ✅ fine as-is
- **Country/region: ON**, **Language: OFF.** Fine for a single US market; no change needed.

## Spam protection — ✅ correct, keep ON
- **hCaptcha on contact & comment forms: ON.** Good — this protects the Founder Intake and the guest/resource/partner application forms (all native contact forms) from spam.
- **hCaptcha on login / create account / password recovery: ON.** Good — protects member accounts.

## Crawler access — ✅ no action
- **Do not** create a crawler signature. Not needed for a private staging store; leave it.

## Summary
Only two paste actions are needed (homepage title + meta description), and both are optional until launch since the store is noindex. Everything else is already set the way a private staging store should be. The single hard "don't": leave Password protection ON.
