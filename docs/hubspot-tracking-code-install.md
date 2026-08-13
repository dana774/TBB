# HubSpot Tracking Code — Install Handoff (VGP Vercel Site)

**For:** the agent/engineer building the Value Growth Partners site on Vercel (Next.js).
**Purpose:** install the HubSpot tracking code so site visitors appear on the CRM timeline and
form submissions attach to contacts.

- **HubSpot Account (portal) ID:** `246956537`
- **Data region:** NA2 → script host `js-na2.hs-scripts.com`
- **Verify anytime in HubSpot:** Settings → Tracking & Analytics → Tracking Code (the `src` there is authoritative).

---

## The raw snippet (plain HTML sites)

```html
<!-- Start of HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js-na2.hs-scripts.com/246956537.js"></script>
<!-- End of HubSpot Embed Code -->
```

Place it immediately before `</head>` (or before `</body>`) so it loads on **every** page.

---

## Next.js install (recommended — use `next/script`)

### App Router (`app/layout.tsx`)

```tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          id="hs-script-loader"
          strategy="afterInteractive"
          src="//js-na2.hs-scripts.com/246956537.js"
        />
      </body>
    </html>
  );
}
```

### Pages Router (`pages/_app.tsx`)

```tsx
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Script
        id="hs-script-loader"
        strategy="afterInteractive"
        src="//js-na2.hs-scripts.com/246956537.js"
      />
    </>
  );
}
```

> Use `strategy="afterInteractive"` (not `beforeInteractive`) — the HubSpot loader should run
> after hydration.

---

## IMPORTANT for a SPA: track client-side route changes

The HubSpot script records the **initial** page load. In a Next.js SPA, client-side navigations
do **not** trigger a new page view automatically, so without this you'd only ever see the landing
page. Fire a page view on every route change.

### App Router — a small client component included in `layout.tsx`

```tsx
"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function HubSpotRouteTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const _hsq = ((window as any)._hsq = (window as any)._hsq || []);
    _hsq.push(["setPath", pathname]);
    _hsq.push(["trackPageView"]);
  }, [pathname]);
  return null;
}
```

Render `<HubSpotRouteTracker />` inside the `<body>` of `RootLayout` (alongside the `<Script>`).

### Pages Router — in `_app.tsx`

```tsx
import { useRouter } from "next/router";
import { useEffect } from "react";

// inside App():
const router = useRouter();
useEffect(() => {
  const handle = (url: string) => {
    const _hsq = (window._hsq = window._hsq || []);
    _hsq.push(["setPath", url]);
    _hsq.push(["trackPageView"]);
  };
  router.events.on("routeChangeComplete", handle);
  return () => router.events.off("routeChangeComplete", handle);
}, [router.events]);
```

---

## Content Security Policy (if the site sets one)

If the site sends a CSP header, allow HubSpot or the script will be blocked. Minimum:

- `script-src`: `https://js-na2.hs-scripts.com https://js.hs-analytics.net https://js.hs-banner.com https://js.usemessages.com`
- `img-src`: `https://track.hubspot.com`
- `connect-src`: `https://api.hubspot.com https://forms.hubspot.com`

(HubSpot publishes the full domain list; expand if you later embed forms, chat, or CTAs.)

---

## Acceptance check

1. Deploy, open the site, then in HubSpot go to **Reports → Analytics Tools → Traffic Analytics**
   (or a contact's timeline after a test form submit) and confirm the visit is recorded.
2. Navigate between pages and confirm multiple page views register (proves SPA tracking works).

## Related next step (not this task)

Embedding a HubSpot **form** on the site so leads enter the CRM pre-tagged
(`vgp_original_relationship_source = Website`). Ask for the form embed handoff when ready.
