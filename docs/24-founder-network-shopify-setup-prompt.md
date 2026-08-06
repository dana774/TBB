# 24 — Founder Network ($99/mo) — Shopify Setup Prompt & Wiring

The VGP site has a **Membership** page (`/membership`) that sells the $99/month Founder Network. Its "Join" button goes live the moment you set one env var — `MEMBERSHIP_CHECKOUT_URL` — to the Shopify checkout/product link. The subscription itself is sold through **The Brand Blueprint (Shopify)**, so the product needs to exist there first.

Below is a ready-to-paste prompt for the agent working on the Brand Blueprint Shopify store, plus the exact wiring step for this site.

---

## Paste this to the Shopify/Brand Blueprint agent

> **Goal:** Create a recurring **$99/month subscription product** on the Brand Blueprint Shopify store called **"Founder Network"** and give me a direct checkout (or product) URL I can link from the Value Growth Partners website.
>
> **Requirements:**
> 1. **Product:** Title "Founder Network Membership". Price **$99.00 USD**, recurring **monthly**, cancel anytime. Use Shopify's native **Subscriptions** (or the store's installed subscriptions app, e.g. Appstle) to create a monthly selling plan and attach it to this product.
> 2. **Type:** Digital / service product — no shipping, no inventory tracking, taxable per store default.
> 3. **Description (use this copy):** "The Founder Network is your low-friction front door to the Brand Blueprint ecosystem — signal, funding, tools, and the people who can help you build. Members get: the Founder Signal newsletter (market moves, funding calls, operator insight); ecosystem funding access including Funding Friday and Hot List eligibility; access to the vetted referral partner network with member-only discounts on select partners; the accelerator toolkit (curriculum, tools, templates, and playbooks); member discounts on Brand Blueprint accelerator content and programs; and partner and investor visibility pathways as you grow. $99/month, cancel anytime."
> 4. **Images:** use the Brand Blueprint / Founder Network brand image if available.
> 5. **Checkout:** confirm the product can be purchased as a standalone subscription (a direct **permalink** like `https://<store>.myshopify.com/cart/<variantId>:1?selling_plan=<planId>` or a product page URL that adds the subscription to cart). 
> 6. **Return to me:** the **public checkout/product URL** for the $99 Founder Network subscription, plus the variant ID and selling-plan ID.
> 7. **Do not** publish/announce it broadly or change any other product; this is a single new subscription SKU.

---

## Then wire it to the VGP site (30 seconds)

In Vercel → the VGP project → **Settings → Environment Variables**, add:

```
MEMBERSHIP_CHECKOUT_URL = <the Shopify checkout/product URL the agent returns>
```

Redeploy. The `/membership` "Join the Founder Network" button will point straight to Shopify checkout, and the "opening soon" note disappears automatically. No code change needed.

## Benefit language (cleaned — matches the site)
- **The Founder Signal** — members' newsletter: market moves, funding calls, operator insight.
- **Funding access** — ecosystem funding opportunities, Funding Friday, Hot List eligibility.
- **Referral partner network** — vetted specialists (financing, tax, creative, paid media) with member-only discounts on select partners.
- **Accelerator toolkit** — curriculum, tools, templates, playbooks.
- **Member discounts** — reduced pricing on Brand Blueprint accelerator content and programs.
- **Visibility pathways** — partner and investor visibility as you build.

## Notes
- Keep brand separation intact: the *subscription/commerce* lives in the Brand Blueprint Shopify store; the VGP site just presents it and links to checkout. This matches the ecosystem model (Brand Blueprint = founder-facing front door; VGP = advisory/operating firm).
- If you'd rather sell the membership through **HubSpot Commerce** instead of Shopify, say so and I'll point the button at a HubSpot payment link instead — same env var, different URL.
