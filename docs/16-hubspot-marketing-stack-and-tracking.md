# 16 — HubSpot Marketing Stack, Email Ownership, and Tracking-Code Install

Decision record for how HubSpot fits alongside the systems of record defined in
[docs/11-crm-billing-ownership-and-handoff-spec.md](11-crm-billing-ownership-and-handoff-spec.md).
Origin: HubSpot Marketing Hub onboarding ("Attract new customers with Marketing Hub").

## HubSpot's role — and its boundary

HubSpot is a **marketing, tracking, and nurture layer** — primarily for the VGP
(B2B advisory) side. It is **NOT** a CRM or billing system of record and must
never become a third one.

| Owns (unchanged from doc 11) | System |
|---|---|
| BB members, subscribers, merchandise purchasers | **Shopify Customers** |
| BB membership contract, billing, renewal, access | **Appstle Memberships** |
| VGP advisory prospects, clients, proposals, invoices | **Wix CRM + Wix business tools** |
| Scheduling only | **Calendly** |
| Marketing tracking, VGP nurture email, campaign analytics | **HubSpot** (layer only) |

Rule: HubSpot may *observe* and *nurture* contacts, but the owning system for
identity, membership, and billing stays exactly as doc 11 specifies. No recurring
entitlement, payment method, or membership record is created in HubSpot.

## Onboarding checklist — disposition

| HubSpot step | Decision |
|---|---|
| **Attract & capture leads** (landing pages + forms) | **Skip.** Pages/forms already live on Wix (VGP) and Shopify (BB). Do not rebuild in HubSpot — it would fragment the brand and split form data from the systems of record. Let the tracking code auto-capture existing-form submissions instead. |
| **Engage leads & convert** (email campaigns) | **Split by brand — see below.** |
| **Track & analyze performance** (tracking code) | **Do it.** Install steps below. |

## Email — where campaigns run

Not "HubSpot vs Klaviyo." It is **both, split strictly by brand**, because each
tool is best-in-class for a different motion.

| Brand | Motion | Email tool | Rationale |
|---|---|---|---|
| **Brand Blueprint** | Ecommerce / membership (Shopify) | **Klaviyo** | Deep Shopify integration: abandoned cart, browse abandonment, post-purchase, back-in-stock, product blocks, membership flows. |
| **VGP** | B2B advisory (Wix) | **HubSpot** | Lead nurture, sales sequences, follow-ups tied to contacts/deals. Klaviyo has no native Wix integration and is weak for B2B nurture. |

**Golden rule:** one contact, one sending system. Never email the same person
from both tools. Segment strictly by brand to protect deliverability and avoid
double-sends. Consolidating into a single tool is not viable — Klaviyo can't
serve VGP's B2B motion, and HubSpot is weaker for Shopify ecommerce flows.

## Tracking-code install — status & steps

Grab the snippet first: **HubSpot → Settings ⚙ → Tracking & Analytics →
Tracking Code** (a `<script>` from `js.hs-scripts.com` carrying the Hub ID).
Add **both** domains under **Settings → Domains & URLs** so traffic attributes
correctly.

| Property | Platform | Method | Status |
|---|---|---|---|
| Brand Blueprint (`thebrandblueprint.biz`) | Shopify | **HubSpot Shopify app** (adds code + syncs customers/orders/products) | ✅ Installed — app connected, initial sync in progress (backfill takes a few hours) |
| VGP (`valugrowthpartners.com`) | Wix (live) | Custom Code snippet | ✅ Installed on existing live site |
| VGP headless (new) | **Vercel (Next.js)** | Manual pageview calls — see below | ⏳ Pending headless launch |

### Verify a live install (either site)
- **DevTools → Network**, filter `hs-scripts` or `__ptq.gif` — a request means it's firing.
- HubSpot Tracking Code status flips to **Installed** within an hour or two of real traffic.
- Confirm sessions appear under **Reports → Analytics Tools → Traffic Analytics**.

### Headless build (Vercel / Next.js) — the one place the standard code does NOT "just work"

HubSpot's snippet auto-logs a pageview only on **full page loads**. A headless
SPA changes routes client-side, so HubSpot records the first landing and then
goes silent. Fire a pageview manually on every route change.

Load the snippet once via `next/script` (`strategy="afterInteractive"`), then:

**App Router** (`app/`) — a client component mounted in the root layout:

```tsx
'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function HubSpotPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const _hsq = (window._hsq = window._hsq || []);
    _hsq.push(['setPath', pathname + (searchParams?.toString() ? `?${searchParams}` : '')]);
    _hsq.push(['trackPageView']);
  }, [pathname, searchParams]);
  return null;
}
```

**Pages Router** (`pages/_app`) — listen to `router.events`:

```jsx
useEffect(() => {
  const onChange = (url) => {
    const _hsq = (window._hsq = window._hsq || []);
    _hsq.push(['setPath', url]);
    _hsq.push(['trackPageView']);
  };
  router.events.on('routeChangeComplete', onChange);
  return () => router.events.off('routeChangeComplete', onChange);
}, [router.events]);
```

**Framework-agnostic fallback** — call on any client-side navigation:

```js
const _hsq = (window._hsq = window._hsq || []);
_hsq.push(['setPath', window.location.pathname]);
_hsq.push(['trackPageView']);
```

### Headless forms
HubSpot "collected forms" may not auto-capture client-side-rendered forms.
Submit those leads via the **HubSpot Forms API** (or an embedded HubSpot form)
instead of relying on auto-capture.

## Compliance note
The tracking code sets cookies. Ensure the **cookie-consent banner covers
HubSpot analytics** on both domains (consistent with the consent discipline
elsewhere in these docs). Prefer testing on the Wix **staging** site before the
live VGP site where practical — doc 11 keeps the live VGP site untouched.
