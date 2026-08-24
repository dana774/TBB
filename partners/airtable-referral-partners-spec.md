# Airtable base — "VGP Referral Partners" (source of truth)

Recreates the referral-partner Google Sheet as the system of record, with a **partner-facing update
form** and a documented **pull-to-site** process. Build this in Airtable (≈10 min); the automation and
form are all native. Claude can create it via the Airtable connector once that's authorized — until then
this is the click-to-build spec.

## Table 1 — `Partners` (one row per partner)

| Field | Type | On partner form? | Notes |
|---|---|---|---|
| **Partner Name** | Single line (primary) | ✅ | |
| Slug | Single line | — | matches the site page `/network/<slug>` |
| Partner Type | Single select | ✅ | Financing & Lending · Financial & Tax Strategy · Creative & Digital · Paid Media & Digital · Capital Intelligence · Commerce Intelligence · Enterprise Tech & Automation · Funding Partner · Other |
| Category | Single line | ✅ | the digest "category" line |
| Focus | Single line | ✅ | one-line positioning |
| Description | Long text | ✅ | |
| Best Fit For | Long text | ✅ | one item per line |
| Typical Engagement | Long text | ✅ | one item per line |
| Contact Name | Single line | ✅ | |
| Email | Email | ✅ | **match key for the update automation** |
| Phone | Phone | ✅ | |
| Website | URL | ✅ | |
| LinkedIn | URL | ✅ | |
| Location | Single line | ✅ | |
| Logo | Attachment | ✅ | |
| Headshot | Attachment | ✅ | |
| Work Images | Attachment | ✅ | |
| Services & Rates | Long text | ✅ (optional) | partner's choice to list |
| Consent to Publish | Checkbox | ✅ | partner confirms the profile can go live |
| **Status** | Single select | — (internal) | Draft · Sent for Review · Updated by Partner · Confirmed · Live |
| Why VGP Recommends | Long text | — (internal) | VGP editorial, not partner-editable |
| Referral Arrangement | Single select | — (internal) | Standard 15% · Visibility-only · None · Custom |
| Preview Page URL | URL | — | `https://<staging>/network/<slug>` |
| Internal Notes | Long text | — (internal) | |
| Last Modified | Last modified time | — | auto |

Seed rows now: Ark-La-Tex Financial Consultants, Veri-Core Systems, Patrice Malloy (The Affluent CFO),
Heloise Lanoix, Kaylee McFerson, Sengo, Nudge. (Data already drafted in `vgp-headless/src/lib/content.ts`.)

## Table 2 — `Funding Partners` (optional, for /network/funding-partners)
Same shape, minus the referral-fee field; add **Capital Type** (Non-dilutive · Debt · Equity · Grant · Mixed)
and **Stage Focus**. Populate when Dana sends names/details.

## The partner-facing form
Create a **Form view** on `Partners` exposing only the "✅ On partner form" fields above. Title it
**"Update your VGP partner profile."** Intro text:

> "We're finalizing the new Value Growth Partners ecosystem and website, and you're a big part of it.
> Please review the draft we prepared, correct anything, and add your logo/headshot and any images. This
> is what will appear on your partner page."

Include the standard access/disclosure line and the footer
"© 2026 Value Growth Partners · Referral partner profile · Not for redistribution."

**Per-partner prefill:** generate a prefilled form link per partner so they see their current draft, e.g.
`…/form?prefill_Partner+Name=Sengo&prefill_Email=…`. (Airtable supports `?prefill_<Field>=<value>`.)

## Automation — "Partner updated their profile"
Trigger: **form submission**. Action: **find the `Partners` record where Email matches** the submission,
update its fields with the submitted values, set **Status → "Updated by Partner,"** and notify Dana. (If no
email match, create a new row flagged for review.) This keeps one row per partner instead of duplicate
submissions.

## Views
- **All Partners** (grid) · **Needs Review** (Status = Draft / Sent for Review) · **Updated — awaiting
  confirmation** (Status = Updated by Partner) · **Ready to Publish** (Status = Confirmed) · the **Form**.

## Pull-to-site (Airtable → website)
1. When a partner's Status = **Confirmed**, copy their fields into `vgp-headless/src/lib/content.ts`
   (`partners` array), drop their **logo/headshot/images** into `vgp-headless/public/assets/partners/`, and
   set `review: false` on that partner.
2. Rebuild + deploy. The page flips from draft to live.
3. **Later automation:** a build step can read the `Confirmed` rows via the Airtable API and generate the
   `partners` data automatically, so "Confirmed in Airtable" → "live on site" needs no hand-editing.

## Guardrails
- Internal fields (Status, Why VGP Recommends, Referral Arrangement, Internal Notes) are **never** on the
  partner form and never shown on the public page.
- Nothing goes `Live` without **Consent to Publish** checked.
