# 37 — Content sweep: Founder Chapters, Hot List, Resources, Events (2026-08-31)

Store: **the-brand-blueprint.myshopify.com** (password-protected staging; BB Preview theme owned separately).
Read-only audit + a small set of additive/reversible changes. **No deletions, no consent-value
changes, no publishing, no theme/template edits.** Content lane = metaobjects only.

## Model landscape (Shopify metaobjects)
`episode` (51) · `founder_chapter` (5) · `signal` (10) · `resource` (65) · `event` (2) ·
`funding_opportunity` (15) · `dana_profile` (1) · `partner` (0) · `hot_list_founder` (0, extended here).

---

## 1. Founder Chapter consent & readiness table
All 5 have `publishable = ACTIVE`. None has a portrait or approved image; `consent_image` is
false/unset on all five. No biography, quote, claim, metric, image or date was invented — only
recorded values are reported.

| Founder | Company | Episode link | Assets present | Current consent evidence | Missing for new gate | Proposed status |
|---|---|---|---|---|---|---|
| Sruti Baz | (unset) | ✓ "Scaling Mouma's" (YouTube only) | none; no portrait | consent_story/image/metrics = **false**; title = "[MOVED OUT OF LINEUP … do not publish]" | company, portrait+image consent, all new verification flags | Hold in editorial-review; **recommend unpublish (publishable→DRAFT)** |
| Kanicka Joseph | (unset) | ✓ "K&K Smiles" (Spotify+YouTube) | none; no portrait | consent all **false**; title = "[MOVED OUT OF LINEUP … do not publish]" | company, portrait+image consent, new flags | Hold; **recommend unpublish (DRAFT)** |
| Dr. Michelle Cromwell | Soeur Du Sol | ✓ (Spotify+YouTube) | milestones; no portrait | consent_story **true**, consent_metrics **true**, consent_image false; `status = published` | approved image + consent_image, website_feature_permission, asset_rights, episode/release verified, editorial approve | **Currently public** — recommend revert to editorial-review pending image + new gate (approval needed) |
| Logan Cuvo | Best Dam Tape | ✗ **no linked episode** | pull_quote + milestones; no portrait | consent_story **true**, consent_metrics **true**, consent_image unset; `status = published` | episode link, image + consent_image, new flags | **Currently public** — recommend revert; fix episode link |
| Jeremy Chow | Tactus Technologies | ✗ **no linked episode** | pull_quote + milestones; no portrait | consent_story **true**, consent_metrics **true**, consent_image unset; `status = published` | episode link, image + consent_image, new flags | **Currently public** — recommend revert; fix episode link |

**Key gaps:** 3 chapters (Cromwell, Cuvo, Chow) are `status=published` and would render on the public
Founder Chapters page — contrary to the "keep the five in editorial-review / don't publish merely
because the episode is public" directive. **Not changed** (per "return findings before changing
consent statuses"). Recommend reverting to editorial-review.

### Conditional-automation gate (future workflow)
Publish only when ALL are true: `episode_verified` · `release_verified` · `consent_story` ·
`website_feature_permission` · `asset_rights_verified` · `status = approved` · required
founder/company/episode/image/summary/canonical-URL fields complete · `editorial_risk_flag` = false.
Otherwise retain in editorial-review. Never infer consent from a recording, episode, social post,
headshot, logo, or promo asset.

### Fields ADDED to `founder_chapter` (additive; all default false/empty)
`episode_verified` (bool) · `release_verified` (bool) · `website_feature_permission` (bool) ·
`asset_rights_verified` (bool) · `consent_agreement_version` (text) · `consent_evidence` (multiline,
**internal only — do not expose**) · `editorial_risk_flag` (bool). Existing `consent_story/
consent_image/consent_metrics` retained; `status` vocabulary to standardize as editorial-review →
approved → published.

### Proposed guest consent language — FOR DANA'S LEGAL REVIEW (not applied to any record)
> "I authorize The Brand Blueprint and Value Growth Partners to feature my name, likeness, company,
> approved submitted assets, and excerpts from my recorded podcast interview in a Founder Chapter and
> in related promotion across their websites, email, and social channels. I confirm that I have the
> right to provide the submitted materials. Confidential, off-record, or expressly restricted
> information may not be included."

Do not apply retroactively; do not mark prior guests as accepting it without documented evidence.

### Founder Chapter page copy (ready to place — theme/page-body owner decision)
Intro: "Meet the founders behind the ideas, decisions and inflection points explored on The Brand
Blueprint. Each Founder Chapter connects an episode to the practical lessons, commercial challenges
and lived experience behind the business."
Card supports: founder name · company · approved image · category/focus · concise intro · related
episode · selected themes · direct "Listen to the Episode" (a specific episode URL, **never** a
generic channel link) · "Read the Founder Chapter" when a complete chapter exists.

---

## 2. Hot List source & field-mapping table
**Source of record:** Airtable base "Founder Network — Hot List & Directory" (`app7t9MsEK8ESGRsG`) →
**Founders** table (`tblnNvuFVKYHI7iKb`). Table rule: feeds website only when **Status = Approved and
consent granted**. **Separate content model** = Shopify `hot_list_founder` (extended below) — it does
**not** read from `founder_chapter`.

| Approved Hot List field | Airtable Founders source | `hot_list_founder` field |
|---|---|---|
| Founder | Founder Name(s) | name |
| Company | Brand / Client Name | company |
| Approved image or logo | Logo / Brand Photo | **image** (new) |
| Category | Sector | sector |
| Current business stage | Funding Round (+ Status) | stage |
| Concise traction update | Key Traction to Date / Weekly Updates | traction |
| Current ask | Current Ask (headline) | current_ask (+ headline) |
| Requested introduction/resource | Fundraising Needs / Other Support Needed / Business Needs | **requested_intro** (new) |
| Opportunity tags | (derive / Consent scope) | **opportunity_tags** (new) |
| Geographic market | (add in Airtable) | **geo_market** (new) |
| Date last verified | Consent date / Last Update | updated |
| Publish-through / expiration | (add in Airtable) | **expires** (new) |
| Founder approval status | Status + Consent to feature | **approval_status** (new) |
| Visibility status | (derive) | **visibility** (new) |
| Airtable source-record id | record id | **source_record_id** (new) |

**Never mapped to a public card (internal only):** Email, LinkedIn, Amount Being Raised, Capital
Secured to Date, Use of Funds, Ideal Investor Profile, Additional Notes, raw fundraising figures,
Weekly-Update internal notes, coaching/assessment/CRM/pipeline data.

**Expiration mechanism:** every entry carries `expires` + `approval_status` + `visibility`. On expiry,
remove from display or return to review — no stale asks.

**Decouple:** `founder_chapter` still has a legacy `hot_list` boolean. Recommend the theme read the
Hot List ONLY from `hot_list_founder`. Field left in place (removal is destructive) — theme owner lane.

**Not populated:** no `hot_list_founder` records created — population requires per-founder approval +
consent + expiration; awaiting that evidence.

### Hot List page copy (ready to place)
Intro: "The Founder Hot List surfaces timely opportunities, milestones and specific asks from founders
across the Brand Blueprint ecosystem. Entries are updated regularly and shared to help members
identify relevant introductions, resources and ways to contribute."
Notice: "Information reflects founder-approved updates as of the date shown. Please route
introductions and support through the designated Brand Blueprint pathway rather than using or
distributing private founder information."

---

## 3. Resource access test results
- **Funding + Capital Access = 11 records** (CAP-01…CAP-11), all `access_level=member`,
  `status=published`, publishable ACTIVE. You referenced CAP-01–10; **CAP-11 "Lender Readiness
  Questionnaire" also exists** — flagged, not removed.
- **CAP-10** "Readiness Before Capital: The Funding Rule" → **YouTube playlist link (video, not a
  download)** ✓ already correct.
- CAP-01–09, CAP-11 → Shopify CDN file links present.
- **Gating:** all resources display only through native `bb-member-gate.liquid`
  (`customer.tags contains "Founder Network"`). Definition storefront = PUBLIC_READ; the theme gates
  display. **Live anonymous vs member vs denied states cannot be browser-tested from here** (store
  password-protected; storefront proxy blocked) → owner browser test required.

### ⚠️ Contradiction to resolve
The RESOURCES directive assumes only Funding + Capital Access is populated and the other 8 collections
are empty ("label Coming soon," "don't manufacture placeholder files"). **In the live store all 9
collections are populated — 65 resources — the build you directed and I completed on 2026-08-24.** I
did **not** hide or relabel 54 real member resources. Accurate counts (all member/published/active):

| Collection | Count |
|---|---|
| Start Here + Founder Operating Cadence | 5 |
| Funding + Capital Access | 11 |
| Retail, Buyers + Distribution | 15 |
| Marketing, Content + Customer Growth | 11 |
| Product, Packaging + Operations | 3 |
| Growth OS + Founder Systems | 9 |
| Partner Network + Expert Routing | 4 |
| Events, Market Signals + Opportunities | 3 |
| Accelerator + Alumni Continuity | 5 |

**Decision needed:** show all 9 live, or hold the other 8 as "Coming soon" behind the gate pending
your content verification? The "empty collection / no download button / add count" rules apply only
to genuinely empty collections — none is empty.

---

## 4. Event disposition table
Both `event` records are already DRAFT (not public).

| Record | State | Date | Disposition |
|---|---|---|---|
| CPG Cash Flow Management Seminar | DRAFT | 2026-07-23 (past) | **Description + audience updated to your approved draft** (kept DRAFT). Do not publish; date is past/unconfirmed — do not assume it equals the August Sengo delivery. Needs a confirmed occurrence. |
| Founder Network Orientation | DRAFT | none | **Description + audience updated to your approved draft** (kept DRAFT). Title carries "— Date To Be Confirmed"; publish only when date + access pathway confirmed. |
| "Funding Friday — Weekly Opportunity Brief" | — | — | **No event record exists.** Funding Friday is a published **Page** (`funding-friday`) — its correct home. If it appears on the Events page, that is a theme-template inclusion (owner lane), not an event record — nothing to archive. |
| sample-funding (funding_opportunity) | ACTIVE → **DRAFT (done)** | — | Placeholder "[EDITORIAL REVIEW] Sample" unpublished. |

Events page: no approved upcoming events exist → your empty-state message should show (theme render):
"New Brand Blueprint events and founder sessions are being scheduled. Join the Founder Network or
subscribe for verified announcements as dates are confirmed." No "Date TBA" cards in the active grid.
Do not auto-create weekly events for Funding Friday posts; a live Funding Friday Q&A is an event only
with a real date/time/format/registration.

---

## 5. Placeholder & incomplete-record report
- **founder_chapter** Sruti Baz & Kanicka Joseph — `chapter_title` holds internal staging language
  "[MOVED OUT OF LINEUP 2026-07-20 — retained, not featured, do not publish]"; both editorial-review
  but publishable ACTIVE. Recommend publishable→DRAFT (held pending your OK on chapter changes).
- **founder_chapter** Logan Cuvo & Jeremy Chow — missing `related_episode` link.
- **funding_opportunity** sample-funding — "[EDITORIAL REVIEW] Sample" — **unpublished (done)**.
- **Channel/playlist vs per-episode links** — CAP-10 and the 3 Market-Signal video resources point to
  the channel playlist `PLt97…`, not individual videos. Acceptable interim; per your "no generic
  channel link as an individual destination" rule, recommend repointing to specific video URLs.
- **Episodes** — ~10 historical/blog-imported episode records have null `youtube_url` and `media_url`
  (no embed). Data-completeness gap, not staging language; theme should hide empty embeds (owner check).
- No sample/placeholder **resource** metaobjects remain (prior cleanup verified; 65 clean records).

---

## 6. Exact records changed (this session)
1. `founder_chapter` definition — added 7 fields (episode_verified, release_verified,
   website_feature_permission, asset_rights_verified, consent_agreement_version, consent_evidence,
   editorial_risk_flag).
2. `hot_list_founder` definition — added 8 fields (image, requested_intro, opportunity_tags,
   geo_market, expires, approval_status, visibility, source_record_id).
3. `event` "CPG Cash Flow Management Seminar" — summary + eligibility updated (kept DRAFT).
4. `event` "Founder Network Orientation" — summary + eligibility updated (kept DRAFT).

No consent values changed, nothing published, no founder_chapter records altered.

## 7. Exact records archived / unpublished
1. `funding_opportunity` `sample-funding` — publishable ACTIVE → **DRAFT**.

No deletions.

## 8. Items requiring Dana's approval
1. **Resources contradiction** — show all 9 collections live, or hold 8 as "Coming soon"? (Blocks the
   resource-labeling instructions, which assumed empty collections.)
2. **3 published chapters** (Cromwell, Cuvo, Chow) — revert to editorial-review under the new policy?
   (Changes publication state.)
3. **Unpublish Sruti/Kanicka chapters** (publishable→DRAFT)? They are marked do-not-publish.
4. **CAP-11** (11th Capital Access resource) — retain / renumber / remove?
5. **Missing episode links** for Cuvo & Chow — provide the correct episodes (or confirm none exists →
   fails episode_verified).
6. **Guest consent language** — legal review before use.
7. **Populate `hot_list_founder`** from Airtable — only after per-founder approval/consent/expiration.
8. **Theme-owner items** (not content lane): Founder Chapter + Hot List + Events page intros/notices/
   state labels/empty-state; decouple Hot List from `founder_chapter.hot_list`; remove any Funding
   Friday card from the Events display; repoint video resources to per-video URLs.
9. **Live access test** — anonymous (denied) vs tagged member (visible) in a browser.

## Guardrails honored
No theme publish, no checkout, no password removal, no domain connect, no membership activation, no
private scheduling links exposed. All changes additive/reversible; questionable records unpublished,
not deleted.
