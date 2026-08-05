# 21 — VGP Go-Forward Architecture (Wix-free, HubSpot-centric)

Decision (Dana, 2026-08-05): **retire Wix for VGP.** Headless site on external hosting; **HubSpot** as primary CRM; **HubSpot Commerce** as primary commerce (payments/invoices/subscriptions). This supersedes the Wix-as-VGP-backend references in earlier docs (03, 13–16, 18–20) for anything go-forward.

## The stack
| Function | Home | Cost |
|---|---|---|
| Marketing site (frontend) | **Vercel/Netlify** — the headless Astro app in `vgp-headless/` | Free |
| Content / CMS | **In-repo** (`src/lib/content.ts`); optional no-code CMS later (HubDB/Sanity) | Free |
| Forms | Custom forms → **HubSpot** (server endpoints) | Free tier |
| CRM / contacts / leads | **HubSpot** (portal 246956537) | Free tier |
| Payments / invoices / subscriptions | **HubSpot Commerce** | Transaction fees only |
| Scheduling | **Calendly** (the approved vgp-insight-session) | Existing |
| Domain | Registrar (transfer out of Wix first — see below) | ~$10–20/yr |
Wix Premium for VGP is eliminated once migration completes.

**Subscription clients:** stay separate from the Brand Blueprint Shopify store (brand + tool separation). VGP advisory subscriptions live in **HubSpot Commerce**; BB memberships live in **Shopify/Appstle**.

## Built this session (code-side, build-verified)
- **HubSpot lead-capture backbone** in the headless site:
  - `src/lib/hubspot.ts` — upserts a Contact by email via the CRM API using `HUBSPOT_TOKEN`; no-ops gracefully without the token; retries with standard properties if custom `vgp_*` props don't exist yet.
  - `src/pages/api/lead.ts` — endpoint for the institutional & partner forms.
  - `src/pages/api/qualify.ts` — now also captures the advisory lead with its **pathway** (qualified / institutional / partner / existing_client / human_review).
  - Advisory form now collects name + email; both inquiry forms POST to HubSpot.
  - Segmentation properties (optional, create in HubSpot): `vgp_pathway`, `vgp_source`, `vgp_message`. Lifecycle stage set to `lead`.
- Verified: build passes; endpoints return correctly; capture skips cleanly with no token; the fit-call URL remains absent from all static page source (server-gated).

## Dana's account-level steps (sequence)
Account/identity/banking steps only you can do — I do all the code + HubSpot object setup:
1. **HubSpot Private App token:** Settings → Integrations → Private Apps → create (scope `crm.objects.contacts.write`) → give me the token to set as `HUBSPOT_TOKEN` (deploy env; never in Git). Optionally create custom contact properties `vgp_pathway`, `vgp_source`, `vgp_message` for full segmentation.
2. **HubSpot Commerce / Payments:** enable Payments (bank/processor onboarding) so you can send payment links, invoices, and recurring subscriptions from HubSpot.
3. **Protect the domain:** in Wix, check if `valugrowthpartners.com` is *registered through Wix*. If so, **transfer it to a registrar** (Cloudflare Registrar = at-cost) **before** cancelling Wix. If registered elsewhere, just repoint DNS later.
4. **Hosting:** create a Vercel (or Netlify) account; I'll provide the deploy config. Set env: `HUBSPOT_TOKEN`, `FIT_CALL_URL`, `BB_URL`. Keep `noindex` until launch.
5. **Migrate the 2 subscription clients:** set up their subscription in HubSpot Commerce, send each a payment link to re-enter their card, cancel the Wix subscription at their next cycle boundary. Short note to each about the platform move.
6. **Launch:** repoint `valugrowthpartners.com` DNS → Vercel; remove `noindex`; confirm live.
7. **Cancel Wix** once everything is confirmed live and clients are migrated.

## What I can still build when you're ready
- Optional: create a HubSpot **Deal** on qualified advisory leads (pipeline for advisory).
- Optional: Calendly ↔ HubSpot sync so booked fit-calls log automatically.
- HubSpot tracking script on the site for attribution.
- Content: replace `[SOURCED — confirm]` / `[EDITORIAL REVIEW]` with approved copy; real case studies; your photo.
- Deploy config for Vercel/Netlify (swap adapter) on your word.

## Guardrails preserved
Fit-call URL server-gated (qualified branch only) · no private/program scheduling URLs · Dana sole creator/founder/host · PepsiCo $ figure gated · nothing published / `noindex` while staging · existing subscription clients not disrupted (migrated deliberately, not dropped).
