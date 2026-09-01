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

## Step C — "Partner updated their profile" automation — BUILT (draft, needs turning on)
Automation: `wflRyKwRt4pHyZ8g6` — https://airtable.com/appXvHjHVMzNmDqdf/wflRyKwRt4pHyZ8g6
Built via API and validated; it is **off** until you review and toggle it **On** in the Airtable UI.

What it does: on any new row (which is what a form submission creates) it (1) sets that row's
**Status → "Updated by Partner"** and (2) emails Dana with the partner's name + email to review and merge
the submission into that partner's draft row, then set Status → Confirmed.

> Note: it triggers on `recordCreated` (fires on every new row, so avoid adding manual rows while it's on, or
> it'll flag them too). This is deliberately the simple, robust version — a native Airtable form always
> creates a *new* row, and a reliable auto-dedup (find the old draft by email and merge into it) needs the
> form view's `viw…` ID and dynamic filters that can't be built blind. If you want that fuller auto-merge,
> send the form view ID once Step A is done and it can be wired in.

**Optional fuller auto-merge (manual build in the UI, if you want zero-dedup):** Trigger *When form submitted*
→ Find records where **Email =** the submission's Email **and Status is one of** Draft/Sent for Review (this
isolates the original draft, since form rows have no Status) → Update that record with the submitted values +
Status "Updated by Partner" → Delete the submission row → email Dana.

## Step D — Pull confirmed data to the site
When a partner's `Status = Confirmed`: copy their fields into `vgp-headless/src/lib/content.ts`, drop their
logo/headshot/images into `vgp-headless/public/assets/partners/`, set `review: false`, rebuild + deploy.
