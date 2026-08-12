# 28 — Newsletter Integration Strategy (auto-subscribe + on-site archive, synced to the stack)

**Goal (Dana's words):** new members are **automatically added to the email list** on join, and get
**immediate access to the newsletter through the website archive** — all **synced with the tech stack
(HubSpot + Claude/ChatGPT agents, Claude preferred)**, across the **two-site strategy** (VGP on Vercel,
The Brand Blueprint on Shopify). Willing to add a newsletter platform if it optimizes the workflow.

---

## The one decision that drives everything: which newsletter engine

Your current stack (Tech Stack OS v4) already names **Klaviyo** as the lifecycle-email platform and
**HubSpot** as the CRM master, with **Zapier and Make removed**. So the real choice is:

| | **Option A — Add beehiiv (recommended)** | **Option B — Klaviyo only (no new platform)** |
|---|---|---|
| Newsletter engine | **beehiiv** owns *The Founder Signal* | Klaviyo owns the newsletter too |
| Klaviyo's job | Shopify ecommerce/lifecycle flows only | Everything (newsletter + flows) |
| Native web archive | ✅ Yes — hosted issue pages + subscribe pages, embeddable | ❌ No true archive; must be custom-built on the VGP site |
| Paid/member gating | ✅ Native premium tier + magic-link access | ⚠️ Custom (tag-gated content on site) |
| Growth tools | ✅ Referral program, recommendations, boosts | ❌ None |
| Cost | Free to start; ~$0–$99/mo as list grows | $0 extra (already budgeted) |
| Downside | A second sender to keep in its lane | Weakest "website archive" story — the exact thing you asked for |

**Recommendation: Option A — add beehiiv** as the publication layer, keep Klaviyo for Shopify-triggered
flows, HubSpot as the CRM system of record, and Claude as the drafting/QA agent. beehiiv is purpose-built
for exactly your model (a paid founder newsletter with an archive and a growth engine); it directly
solves the "on-site archive + immediate member access" requirement that Klaviyo does not. The
"no-duplicate-sending" rule stays intact because the two tools have clean, separate lanes.

*If you'd rather not add a platform, Option B works — but you'll pay for it in custom archive-building on
the VGP site and weaker growth tooling.*

---

## The architecture (Option A)

```
                         ┌─────────────────────────────┐
   $99 join on Shopify → │  Shopify (Brand Blueprint)  │  tags customer `founder-network`,
                         │  membership + checkout       │  fires "customer/subscription created" webhook
                         └──────────────┬──────────────┘
                                        │  webhook (HTTPS)
                                        ▼
                         ┌─────────────────────────────┐   ← Claude builds & maintains this
                         │  Vercel serverless function  │     (you already run /api/* on the VGP site)
                         │  /api/member-provision        │
                         └───┬───────────┬───────────┬──┘
             subscribe to    │           │           │   add to Google Group
             the newsletter  ▼           ▼           ▼   (gates the member hub)
                    ┌──────────────┐ ┌──────────┐ ┌────────────────────┐
                    │   beehiiv    │ │ HubSpot  │ │  Google Group       │
                    │ audience +   │ │ contact  │ │  founder-network    │
                    │ premium tier │ │ + list   │ │  (Drive hub access) │
                    └──────┬───────┘ └──────────┘ └────────────────────┘
                           │  welcome email w/ magic link + member-area URL
                           ▼
                    ┌────────────────────────────────────────────┐
                    │  VGP site (Vercel) /members/newsletter       │  ← on-domain archive,
                    │  renders past issues via beehiiv API/embed   │     gated to members
                    └────────────────────────────────────────────┘
```

**Why a Vercel serverless function instead of Zapier/Make:** you removed both from the stack, and you
already run serverless `/api/*` endpoints on the VGP site (that's how the advisory form posts to HubSpot).
One small `/api/member-provision` function is the clean, code-owned "glue" — no subscription to re-add,
and **Claude (your $100 plan) builds and maintains it**, which is exactly where you want the agent work.

---

## How each requirement is met

1. **Auto-add to the email list on join.** Shopify fires the webhook on a `founder-network` purchase →
   the Vercel function calls the beehiiv "create subscription" API (premium tier) and upserts the contact
   in HubSpot. No manual step.
2. **Immediate access to the archive.** The welcome email contains a magic link; the VGP
   `/members/newsletter` page renders the issue archive (pulled from beehiiv's API) and is gated to
   members. New member → instant read access to every past issue, on your domain.
3. **Synced with HubSpot.** HubSpot stays the system of record: the function upserts the contact, tags
   `founder-network`, and (optionally) writes newsletter engagement back via HubSpot's API so sales/
   advisory context lives in one place. No campaigns are *sent* from HubSpot (preserves the sending rule).
4. **Claude-centered agents.** A Claude workflow assembles *The Founder Signal* from content you already
   produce — Hot List, Funding Friday, Market Signals — drafts it into beehiiv via API, and runs final QA.
   ChatGPT ($20) stays minimal; Claude ($100) does the heavy lifting, as you prefer.
5. **Two-site strategy.** The archive lives in **one** place (VGP site) to avoid duplicate maintenance;
   the Shopify (Brand Blueprint) member area simply **links** to it. One source of truth, both doors.

---

## Newsletter production loop (Claude agent)

1. **Ingest** — Claude reads the week's inputs (Hot List, Funding Friday, Market Signal, partner notes).
2. **Assemble** — drafts the issue in your house template (sections, subject line, preview text).
3. **QA** — checks links, compliance language, claims, and partner disclosures (see doc 29).
4. **Stage** — pushes the draft to beehiiv via API for your review.
5. **You approve & send.** Human-in-the-loop stays on subject lines, capital claims, and anything
   regulated (per your AI-governance principle).
6. **Archive updates automatically** — the sent issue appears in the on-site archive with no extra step.

---

## Build sequence (what to actually do)

1. **Decide A vs B** (above). Assuming A:
2. **Create the beehiiv publication** (*The Founder Signal*), set a **premium/paid tier** = Founder Network.
3. **Add env vars** on Vercel: `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `SHOPIFY_WEBHOOK_SECRET`
   (reuse existing `HUBSPOT_TOKEN`). Keep all secrets in Vercel env — never in git.
4. **Have Claude build** `/api/member-provision` on the VGP site: verify Shopify webhook signature →
   beehiiv subscribe → HubSpot upsert → Google Group add. (I can build this next when you're ready.)
5. **Register the Shopify webhook** (`customers/create` or the subscription-app event) → the function URL.
6. **Build** `/members/newsletter` on the VGP site: fetch beehiiv issues via API, render on-domain,
   gate behind the member check. Link it from the Shopify member area.
7. **Klaviyo** stays connected to Shopify for ecommerce flows only (post-purchase, winback) — not the
   newsletter.
8. **Test** end-to-end with a $0 test order before launch.

---

## Guardrails
- **Secrets** (beehiiv key, Shopify webhook secret, HubSpot token) live only in Vercel env vars.
- **Consent:** only subscribe buyers (a purchase is opt-in to member comms); include unsubscribe and
  honor it across beehiiv + HubSpot.
- **One sender per audience:** beehiiv = the newsletter; Klaviyo = Shopify flows; HubSpot = CRM, no sends.
- **Human-in-the-loop** on anything regulated: capital claims, financial guidance, partner promises.
