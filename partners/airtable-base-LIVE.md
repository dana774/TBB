# VGP Referral Partners — LIVE Airtable base

**Status: base + table + all 10 partner records are built and live.** Two UI-only steps remain (form + automation).

## What's built (via API, done)
- **Base:** `VGP Referral Partners` — `appXvHjHVMzNmDqdf` (workspace: TBB Ecosystem)
- **Table:** `Partners` — `tbl8EuTmDHztzZrj3`, 25 fields (partner-facing + internal, per the spec)
- **10 records seeded**, all `Status = Draft`, `Funding?` checked for Ark-La-Tex and C2FO:
  Ark-La-Tex Financial Consultants · Veri-Core Systems · Patrice Malloy · Heloise Lanoix · Kaylee McFerson ·
  Sengo · Nudge · Product Society · Sarah Horowitz Parfums · C2FO — Lending Connections
- Each row's **Preview Page URL** = `https://STAGING/network/<slug>` — swap `STAGING` for the real host once the branch deploys.

Open it: https://airtable.com/appXvHjHVMzNmDqdf

---

## Step A — Create the partner form (UI, ~2 min; no API exists for this)
1. In the `Partners` table, click **+ (Add view) → Form**. Name it **"Update your VGP partner profile."**
2. **Show only these fields** (drag the rest to "hidden"): Partner Name, Partner Type, Category, Focus,
   Description, Best Fit For, Typical Engagement, Contact Name, Email, Phone, Website, LinkedIn, Location,
   Logo, Headshot, Work Images, Services & Rates, Consent to Publish.
3. **Hide (never on the form):** Slug, Status, Why VGP Recommends, Referral Arrangement, Preview Page URL,
   Internal Notes, Funding?.
4. Intro text:
   > "We're finalizing the new Value Growth Partners ecosystem and website, and you're a big part of it.
   > Please review the draft we prepared, correct anything, and add your logo/headshot and any images. This
   > is what will appear on your partner page."
   Footer: "© 2026 Value Growth Partners · Referral partner profile · Not for redistribution."
5. Copy the form's **Share link** — that's the base URL for the prefill links below.

## Step B — Per-partner prefill links
Airtable prefill syntax: append to the form share URL. Pattern (URL-encode spaces as `%20` or `+`):
```
<FORM_SHARE_URL>?prefill_Partner+Name=<name>&prefill_Email=<email>&hide_Partner+Name=true
```
Per partner (drop into the `[FORM]` slot of each outreach email):
| Partner | suffix to append to the form share URL |
|---|---|
| Ark-La-Tex Financial Consultants | `?prefill_Partner+Name=Ark-La-Tex+Financial+Consultants&prefill_Email=nthompson@altfc.net&hide_Partner+Name=true` |
| Veri-Core Systems | `?prefill_Partner+Name=Veri-Core+Systems&prefill_Email=hello@vericoresystems.com&hide_Partner+Name=true` |
| Patrice Malloy | `?prefill_Partner+Name=Patrice+Malloy+—+The+Affluent+CFO&hide_Partner+Name=true` |
| Heloise Lanoix | `?prefill_Partner+Name=Heloise+Lanoix&hide_Partner+Name=true` |
| Kaylee McFerson | `?prefill_Partner+Name=Kaylee+McFerson&hide_Partner+Name=true` |
| Sengo | `?prefill_Partner+Name=Sengo&hide_Partner+Name=true` |
| Nudge | `?prefill_Partner+Name=Nudge&hide_Partner+Name=true` |
| Product Society | `?prefill_Partner+Name=Product+Society&prefill_Email=philip@productsociety.com&hide_Partner+Name=true` |
| Sarah Horowitz Parfums | `?prefill_Partner+Name=Sarah+Horowitz+Parfums&prefill_Email=sarah@sarahhorowitz.com&hide_Partner+Name=true` |
| C2FO — Lending Connections | `?prefill_Partner+Name=C2FO+—+Lending+Connections&prefill_Email=jay.lott@c2fo.com&hide_Partner+Name=true` |

## Step C — Dedup automation ("partner updated their profile")
A native Airtable form **creates a new row** per submission; this automation folds that submission back into
the partner's existing draft row (matched by email) instead of leaving a duplicate.

Build in **Automations → Create automation**:
1. **Trigger:** *When form submitted* → form = "Update your VGP partner profile."
2. **Action — Find records:** table `Partners`, condition **Email is** = the trigger's Email, AND
   **Record ID is not** the trigger's record ID (so it finds the *old* draft, not the new submission).
3. **Action — Update record:** the found record → copy each submitted field over, and set
   **Status → "Updated by Partner."**
4. **Action — Delete record** (optional but recommended): the newly-created submission row, so only the
   updated original remains.
5. **Action — Send email** to Dana: "‹Partner› updated their profile — ready to review."
6. Turn the automation **On**.

> Claude can build this automation via the API once the form view exists — just send the form view's `viw…`
> ID and confirm Airtable is connected. (It's saved as a draft you'd still review + enable.)

## Step D — Pull confirmed data to the site
When a partner's `Status = Confirmed`: copy their fields into `vgp-headless/src/lib/content.ts`, drop their
logo/headshot/images into `vgp-headless/public/assets/partners/`, set `review: false`, rebuild + deploy.
