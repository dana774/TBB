# 22 — VGP Deploy Runbook (headless site → live)

One page, in order. Follow top to bottom. Nothing here touches Git — every secret lives in the host's env panel only.

**What's deploying:** the Astro app in `vgp-headless/`. Marketing pages are static; three endpoints run server-side — `/api/qualify` (advisory pathway + fit-call gate), `/api/lead` (institutional/partner forms), `/api/calendly-webhook` (marks a contact as booked).

---

## 0 · Before you start (5 min)
- [ ] **Rotate the HubSpot token.** Settings → Integrations → Private Apps → your app → *Auth* → **Regenerate**. (The one shared in chat should not be the one you deploy.) Scope needed: `crm.objects.contacts.write`, `crm.objects.deals.write`. Copy the new token.
- [ ] **(Optional) Create 3 contact properties** in HubSpot → Settings → Properties → Contact: `vgp_pathway`, `vgp_source`, `vgp_message` (single-line text). Skippable — the code auto-retries with standard properties if these are absent; you just lose that segmentation until they exist.
- [ ] Confirm the Calendly link is live: `https://calendly.com/valugrowthpartners/vgp-insight-session`.

## 1 · Connect the repo to Vercel (5 min)
- [ ] Create/log into Vercel → **Add New → Project** → import this repo.
- [ ] **Root Directory:** `vgp-headless`  ← important, the app is not at repo root.
- [ ] Framework preset: **Astro** (auto-detected). Leave build/output commands default.
- [ ] Don't deploy yet — set env first (next step).

## 2 · Set environment variables (Vercel → Project → Settings → Environment Variables)
Apply to **Production** (and Preview if you want previews to capture leads).

| Key | Value | Notes |
|---|---|---|
| `DEPLOY_TARGET` | `vercel` | selects the Vercel adapter at build |
| `HUBSPOT_TOKEN` | *your rotated token* | secret — never in Git |
| `FIT_CALL_URL` | `https://calendly.com/valugrowthpartners/vgp-insight-session` | server-gated; shown only to qualified submissions |
| `BB_URL` | `https://the-brand-blueprint.myshopify.com` | swap to the live BB domain once set |

Optional (add only if used):
| Key | Value | Purpose |
|---|---|---|
| `HUBSPOT_PIPELINE` / `HUBSPOT_DEALSTAGE` | your IDs | route qualified advisory deals into a custom pipeline/stage |
| `CALENDLY_WEBHOOK_KEY` | signing key | verify Calendly webhook signatures |
| `PUBLIC_HUBSPOT_PORTAL_ID` | `246956537` | enables the HubSpot tracking script site-wide |

**Leave `noindex` as-is for now** — it's baked into the layout for staging and we remove it deliberately at launch (step 6).

## 3 · Deploy & smoke-test the build (5 min)
- [ ] Click **Deploy**. Wait for green.
- [ ] Open the `*.vercel.app` URL. Click through: Home → Capabilities → Programs → Insights → Speaking → Institutional Inquiry → Partner/Contributor → Members. All should render with the navy/blueprint styling and no broken links.
- [ ] Confirm the fit-call link is **not** visible anywhere in nav, footer, or page CTAs (it should never appear until a form qualifies).

## 4 · First real lead, end-to-end (10 min)
Do this once with your own details so you can watch it land, then delete the test record.
- [ ] **Advisory form:** submit as a *prospective client* who has *not previously spoken with Dana* → you should be routed to the fit-call (Calendly) link. In HubSpot, a **Contact** appears (lifecycle = lead, `vgp_pathway = qualified`) **and** an associated **Deal**.
- [ ] **Advisory form, non-qualifying path** (e.g. existing client / already met): Contact still captured with the matching `vgp_pathway`, **no** fit-call link shown, **no** deal.
- [ ] **Institutional inquiry** + **Partner/contributor** forms: each creates/updates a Contact with the right `vgp_source`.
- [ ] Delete your test contact/deal from HubSpot to leave the CRM clean.
> If a submission doesn't appear: check the Vercel deployment's **Function logs** for `/api/qualify` or `/api/lead`. A missing/invalid token logs a soft skip (the form still succeeds for the visitor); a 401/403 there means the token or its scopes are wrong.

## 5 · Wire Calendly → HubSpot (5 min, optional but recommended)
- [ ] Calendly → Integrations → **Webhooks** → subscribe **`invitee.created`** to `https://<your-domain>/api/calendly-webhook`.
- [ ] Book a test slot → the Contact flips to `vgp_pathway = booked_fit_call`. Cancel the test booking after.

## 6 · Go live (when you're ready to be public)
- [ ] **Domain:** if `valugrowthpartners.com` is registered *through Wix*, transfer it to a registrar (Cloudflare Registrar = at-cost) **before** cancelling Wix. Then in Vercel → Project → **Domains**, add `valugrowthpartners.com` and follow the DNS records shown.
- [ ] **Remove `noindex`:** two edits, then redeploy —
  - `src/layouts/Base.astro`: delete the `<meta name="robots" content="noindex" />` line.
  - `public/robots.txt`: replace the disallow block with `User-agent: *` / `Allow: /` and add a `Sitemap:` line.
- [ ] Redeploy; confirm the live domain resolves and the site is indexable.

## 7 · Migrate the 2 subscription clients (HubSpot Commerce)
- [ ] Enable **HubSpot Payments** (bank/processor onboarding) — required to send payment links/subscriptions.
- [ ] For each client: create their subscription in HubSpot Commerce → send a payment link to re-enter their card → cancel the Wix subscription at their next billing boundary. Short heads-up note to each about the platform move.
- [ ] **Cancel Wix** only after the site is live on the new domain *and* both clients are billing through HubSpot.

---

### Rollback / safety
- Every HubSpot call **fails soft**: no token or an API error never breaks a form submission for the visitor — it just skips capture and logs it. So a misconfigured env can't take the site down.
- The fit-call URL is server-only (verified: absent from all client build output). Changing `FIT_CALL_URL` in Vercel updates it everywhere without a code change.
- To pause indexing again at any time, restore the `noindex` meta line and redeploy.

### One-look env summary (copy to Vercel)
```
DEPLOY_TARGET=vercel
HUBSPOT_TOKEN=***rotated***
FIT_CALL_URL=https://calendly.com/valugrowthpartners/vgp-insight-session
BB_URL=https://the-brand-blueprint.myshopify.com
# optional:
# PUBLIC_HUBSPOT_PORTAL_ID=246956537
# HUBSPOT_PIPELINE=...    HUBSPOT_DEALSTAGE=...
# CALENDLY_WEBHOOK_KEY=...
```
