# 26 — Member Content Access (the $99 gated area)

**Goal:** $99 Founder Network members log in and reach gated content (resource library, funding opportunities, accelerator toolkit, partner directory). Functional at launch.

## Principle
The VGP site (Astro on Vercel) is **static — it has no login system and does not host the gate**. The gate lives where membership status lives. The VGP `/members` page just links to a member hub via `MEMBER_PORTAL_URL`. Pick a path below, get the hub link, set that env var, done.

---

## Path A — Google-native hub (recommended for launch)
Matches the Growth OS manual ("start Google-native… graduate later"). Live fastest, lowest risk.

**Build steps:**
1. **Create the Drive hub** — a shared Google Drive folder "Founder Network — Members," sub-foldered by founder need: Capital Access · Retail Readiness · Sales & GTM · Operations & Forecasting · Brand & Messaging · Growth OS & AI · Partner Directory. Each resource notes *who it's for, when to use it, what it produces*.
2. **Create a Google Group** (e.g., `founder-network-members@…`) and give the Group **Viewer** access to the folder.
3. **On each new $99 subscription**, add the member's email to the Group (manual at first — fine for early members).
4. **Set `MEMBER_PORTAL_URL`** in Vercel = the Drive hub link (or a simple "member home" Google Doc that links to everything). The `/members` "Enter the member area" button goes live.
5. **Automate later:** Shopify "subscription created" → Zapier/Make → add email to the Google Group; on cancel → remove. Makes access hands-off.

*Effort: low. Access: semi-manual → automatable.*

---

## Path B — Shopify-gated member area (the graduation)
One login tied to the subscription; instant automatic access. More setup.

**Build steps (Brand Blueprint Shopify store):**
1. Enable **Shopify customer accounts** (new/passwordless accounts).
2. Install a **membership/gating app** — **Appstle Memberships** (likely already there for subscriptions) or **Locksmith**. Configure it to grant access based on an **active Founder Network subscription** (or a `founder-network` customer tag applied on purchase).
3. Build **member-only pages** on the store (Resource Library, Funding, Toolkit, Partner Directory) — or gated pages that embed/link the Google Drive hub.
4. **Set `MEMBER_PORTAL_URL`** in Vercel = the Shopify member-login / member-home URL.

**Prompt for the Shopify agent (copy-paste):**
```
On The Brand Blueprint Shopify store, set up a gated member area for Founder Network
($99/mo) subscribers.
1. Enable customer accounts (new customer accounts / passwordless login).
2. Using our membership/gating app (Appstle Memberships or Locksmith), gate access so
   ONLY customers with an active "Founder Network" subscription (or a `founder-network`
   tag applied at purchase) can view member pages.
3. Create member-only pages: Resource Library, Funding Opportunities, Accelerator
   Toolkit, Partner Directory. They may embed or link to our Google Drive hub.
4. On subscription start, apply the `founder-network` tag to the customer; on cancel,
   remove it (so access follows the subscription).
5. Return to me: the member-login URL (or member-home URL) to link from the VGP site.
Do not expose member content publicly or change unrelated store settings.
```

---

## The one wiring step (either path)
Vercel → VGP project → **Settings → Environment Variables**:
```
MEMBER_PORTAL_URL = <the member hub / login URL>
```
Redeploy. The `/members` "Enter the member area" button activates and the "opening at launch" note disappears. No code change.

## Recommendation
Launch on **Path A** (Google-native) — it's what your manual calls for and it's live day one. Graduate to **Path B** once member volume justifies the automation. The VGP site supports both with the same single env var.
