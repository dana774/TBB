# 16 — HubSpot Marketing Stack, Email Ownership, and Tracking-Code Install

Decision record for how HubSpot fits alongside the systems of record defined in
[docs/11-crm-billing-ownership-and-handoff-spec.md](11-crm-billing-ownership-and-handoff-spec.md).
Origin: HubSpot Marketing Hub onboarding ("Attract new customers with Marketing Hub").

## HubSpot's role — and its boundary

HubSpot is a **marketing, tracking, and nurture layer** — primarily for the VGP
(B2B advisory) side. It is **NOT** a CRM or billing system of record and must
never become a third one.

| Role | System |
|---|---|
| BB members, subscribers, merchandise purchasers — **and, going forward, consulting/accelerator billing** (see Amendment below) | **Shopify Customers** |
| Recurring billing, renewal, access ($99 tier, retainers) | **Appstle Memberships** |
| Bespoke / negotiated consulting invoices | **Shopify draft orders** |
| VGP advisory prospects, existing subscriptions, existing bespoke proposals/invoices | **Wix CRM + Wix business tools** (existing clients protected — see Amendment) |
| Scheduling only | **Calendly** |
| Pre-customer marketing tracking, B2B nurture email, campaign analytics | **HubSpot** (layer only) |
| Post-purchase lifecycle / retention / cross-sell email | **Klaviyo** (fed by Shopify) |
| **Cross-system relationship ledger + reporting spine** (one human across many funnel passes) | **Airtable** (mirror only) |
| **Delivery / project execution** after a deal closes | **Asana** (downstream only) |

Rule: HubSpot, Klaviyo, Airtable, and Asana may *observe*, *nurture*, *report on*,
or *execute against* contacts, but the owning system for identity, membership, and
billing stays as specified. No recurring entitlement, payment method, or membership
record is created in HubSpot, Klaviyo, Airtable, or Asana.

### Where Airtable and Asana fit (added 2026-08-06)

- **Airtable = relationship ledger, not a CRM.** It mirrors data *out of* the
  systems of record (keyed on normalized email) to give the one thing no single
  platform provides: a unified lifetime view when one client re-enters the funnel
  repeatedly — subscriber → lapsed → consulting project → accelerator cohort →
  merch. This is the operational realization of doc 11's `masterRelationshipId` /
  `CrossBrandHandoffs` concept. **Hard rule:** Airtable reads and aggregates; it
  never *owns* a subscription or a payment. The moment it holds billing it becomes
  a shadow CRM and reintroduces the duplicate-billing risk doc 11 prevents.
- **Asana = delivery layer, strictly downstream.** A closed HubSpot deal or a new
  Shopify order/subscription *triggers* an Asana project (via automation); Asana
  manages the work of fulfilling it. It holds no customer, billing, or
  marketing-consent data and is never a system of record.
- **Neither changes the tool choices** for tracking or email.

## Onboarding checklist — disposition

| HubSpot step | Decision |
|---|---|
| **Attract & capture leads** (landing pages + forms) | **Skip.** Pages/forms already live on Wix (VGP) and Shopify (BB). Do not rebuild in HubSpot — it would fragment the brand and split form data from the systems of record. Let the tracking code auto-capture existing-form submissions instead. |
| **Engage leads & convert** (email campaigns) | **Split by stage — see below.** |
| **Track & analyze performance** (tracking code) | **Do it.** Install steps below. |

## Email — where campaigns run

Not "HubSpot vs Klaviyo." It is **both, split by stage.** (This supersedes the
earlier split-by-brand model: once consulting/accelerator billing consolidates
into Shopify — see Amendment — consulting clients become Shopify customers, so
the dividing line is *pre-customer vs. post-purchase*, not *VGP vs. BB*.)

| Stage | Email tool | Audience | Rationale |
|---|---|---|---|
| **Pre-customer** — lead nurture, B2B sales sequences, winning the deal | **HubSpot** | VGP advisory / institutional prospects, top-of-funnel leads | Lead nurture, sequences, follow-ups tied to contacts/deals. Best-in-class for B2B sales motion. |
| **Post-purchase** — lifecycle, retention, cross-sell, funnel re-entry | **Klaviyo** (fed by Shopify) | Anyone who has bought: subscribers, consulting clients, accelerator, merch | Deep Shopify integration: post-purchase, win-back, cross-sell, product blocks, membership flows. Now owns consulting-client lifecycle too, not just merch. |

**Golden rule:** one contact, one sending system *at a given stage*. When a
prospect becomes a customer, they graduate from HubSpot broadcasts to Klaviyo —
**suppress customers from HubSpot marketing sends** so nobody is emailed by both
tools. Consolidating into a single tool is not viable: Klaviyo can't run the B2B
pre-sale nurture, and HubSpot is weaker for Shopify lifecycle flows.

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

## Amendment (2026-08-06) — Brand Blueprint as the consolidated billing hub

**Decision (Dana):** Consolidate subscription-level billing *and* monthly
consulting-contract billing onto **Brand Blueprint / Shopify**, to sell the full
range of services (the $99 subscription, periodic consulting, accelerator access,
merch) to the same clients through one system with Shopify's full outreach
capability. A single client is expected to pass through the funnel multiple times
(e.g. nonprofit clients engaging accelerator programs periodically).

This is the **written approval** that doc 11 required before converting bespoke
work into a Shopify checkout. Doc 11's systems-of-record table needs a formal
amendment to match; this record is the go-forward directive until that edit is made.

**Go-forward billing model**

| Service | Shopify primitive |
|---|---|
| $99 subscription, monthly retainers | Appstle recurring products |
| Accelerator access, merch | Standard products / membership tiers |
| Bespoke / negotiated consulting | **Draft orders** (custom invoice for a negotiated amount) |

**Guardrails carried over from doc 11 (still binding):**
1. **New** engagements originate in Shopify. **Existing** active Wix subscriptions
   are NOT auto-migrated — they run out on Wix or migrate one at a time, manually,
   with the customer re-entering payment. Never a bulk move; never double-billed.
2. Never create the same recurring entitlement in both Wix and Shopify.
3. Identity is keyed on **one normalized email = one Shopify customer**. Every
   subsequent purchase (subscription, project, accelerator, merch) attaches to that
   same customer record — that record *is* the repeat-funnel history, and Airtable
   rolls it up into the lifetime relationship view.

**Open item requiring Dana's confirmation:** disposition of existing Wix
subscription clients — default per guardrail #1 is "stay on Wix, migrate
deliberately if at all." Confirm before any migration.

**Caveat:** truly bespoke institutional proposals remain clunkier in Shopify draft
orders than in Wix's proposal tools; accepted trade-off for unified outreach and a
single customer record.
