# 38 — Round-2 execution, consent/permissions package + automation plan (2026-09-01)

Follow-through on Dana's decisions after the doc-37 content sweep. All changes on the
unpublished BB Preview theme / metaobjects; nothing published to a live storefront.

## A. Executed this round
### Founder Chapters — unified policy applied (all 5)
All five set to `status = editorial-review` **and** `publishable = DRAFT` (none renders publicly).
Documented consent values (`consent_story` etc.) left intact — not reset.

| Founder | Was | Now |
|---|---|---|
| Dr. Michelle Cromwell | published / ACTIVE | editorial-review / DRAFT |
| Logan Cuvo | published / ACTIVE | editorial-review / DRAFT |
| Jeremy Chow | published / ACTIVE | editorial-review / DRAFT |
| Sruti Baz | editorial-review / ACTIVE | editorial-review / DRAFT |
| Kanicka Joseph | editorial-review / ACTIVE | editorial-review / DRAFT |

Theme confirms the result: `bb-founder-grid` renders only `status=='published'`, so published_count = 0
→ the friendly public empty state shows ("New Founder Chapters publish with each founder's
permission…"). No chapter is exposed.

### Resources — all 9 collections stay live (Dana's decision)
No relabeling; the "Coming soon / empty-collection" instructions are retired (they assumed empty
collections). **CAP-11 retained** as an additional capital resource. CAP-10 remains a YouTube
playlist (video). 65 resources across 9 collections, all member/published/active.

### Page copy placed (preview theme template settings)
- `templates/page.founders.json` → `bb-founder-grid.intro` set to the approved Founder Chapters intro.
- `templates/page.hot-list.json` → `bb-hot-list.intro` set to the approved Hot List intro (replaced the
  prior placeholder intro).
- `pages/events` body → cleared the visible staging text "[EDITORIAL REVIEW] … full build in Phase 2".

### Decouple — already done in the theme (no change needed)
`bb-hot-list.liquid` reads from **`hot_list_founder`** metaobjects (documented pipeline: Founder update
form → Airtable Founders/Weekly Updates → `hot_list_founder` → section), governed by
`status=='published'` + Airtable Approved+consent. It does **not** read `founder_chapter.hot_list`.
The legacy `founder_chapter.hot_list` boolean is simply unused — left in place (removal is destructive).

### Earlier-round changes (recap, still in place)
`founder_chapter` +7 consent/rights fields · `hot_list_founder` +8 approved fields · `sample-funding`
funding_opportunity unpublished (DRAFT) · both DRAFT events refreshed to the approved descriptions.

## B. Missing episode links (Cuvo & Chow) — need Dana's canonical URLs
No `episode` metaobjects exist for either founder, so `related_episode` can't be linked until the
episode records are created. Web search found candidates but **multiple other podcasts also interviewed
Logan Cuvo** (Hockey Journey, Positively WV, TechConnect WV), and YouTube is blocked from this
environment so the channel can't be verified here. **To avoid linking the wrong show, no episode record
was created.**

Candidates to confirm:
- **Logan Cuvo / Best Dam Tape** — "Building the 'Best Dam Tape' Company with Founder Logan Cuvo"
  (Apple `id1820644102?i=1000717005784`); a YouTube `watch?v=hNEwDvoPyBM` also exists — **confirm it's
  The Brand Blueprint channel**.
- **Jeremy Chow / Tactus** — episode confirmed to exist (accessible-music vibrating wearable) but no
  canonical Brand Blueprint URL surfaced.

**Action:** Dana provides the two canonical Brand Blueprint episode URLs (YouTube + Spotify each). Then:
create two `episode` metaobjects (title, guest, publish_date, youtube_url, media_url) and set
`related_episode` on the Cuvo and Chow chapters. No metadata will be invented.

## C. Guest / founder / partner / investor consent + permissions package
Approved core language (guests / Founder Chapters):
> "I authorize The Brand Blueprint and Value Growth Partners to feature my name, likeness, company,
> approved submitted assets, and excerpts from my recorded podcast interview in a Founder Chapter and
> in related promotion across their websites, email, and social channels. I confirm that I have the
> right to provide the submitted materials. Confidential, off-record, or expressly restricted
> information may not be included."

### Recommended automation (so it never has to be chased)
The consent that governs publishing already lives in Airtable ("Founder Network — Hot List &
Directory" → Founders / Referral Partners: *Consent to feature*, *Consent scope*, *Consent date*,
*Status*). The website sync only writes/publishes Approved + consented records. Close the loop into
those exact fields:

1. **One permission form → Airtable.** A short form (Airtable form on the Founders table, plus a
   partner/investor variant on Referral Partners) presenting the approved language with: explicit "I
   agree", typed signature, date, scope checkboxes (website / email / social), asset-rights
   confirmation, and a restricted-info acknowledgment. Submissions set *Consent to feature*, *Consent
   scope*, *Consent date* — the fields the sync already checks.
2. **Calendly Workflows (the interview funnel).** On the podcast-interview event type:
   - Booking confirmation email → include the permission-form link ("Before we can publish your Founder
     Chapter, please complete your feature permission: <link>").
   - Post-interview follow-up (+1 day) → same link.
   (Optionally add a required consent acknowledgment as a Calendly *invitee question* at booking for a
   timestamped first touch; the full release still runs through the form.)
3. **Airtable automation (the no-chase engine).** When Status → Approved but *Consent date* is empty,
   auto-send a reminder with the form link on a cadence until consent is recorded. When consent is on
   file, the record becomes sync-eligible automatically.
4. **Publish gate (already true).** No consent → no sync → no publish, across Chapters and Hot List.

Audience variants: podcast guests → guest release (above) via Calendly + Airtable; founders posting
Hot List updates → the Weekly Update form's "Reaffirm consent" restates scope; referral partners /
investors → Referral Partners form variant (name/logo use on the Partners page).

### BUILT (2026-09-01) — Dana approved "build now"
Base: **Founder Network — Hot List & Directory** (`app7t9MsEK8ESGRsG`).

1. **Airtable no-chase reminder automation** — created and **saved OFF** (Airtable saves all
   API-created automations disabled until reviewed/enabled). ID `wflHKWjS2VCL6wRuS` ·
   https://airtable.com/app7t9MsEK8ESGRsG/wflHKWjS2VCL6wRuS
   - Trigger: a **Founders** record matches **Status = Approved AND Consent date is empty**.
   - Action: emails the founder (their `Email`) the approved permission request (fromName "The Brand
     Blueprint", reply-to dana@valugrowthpartners.com), containing the approved consent language and a
     **`[PASTE PERMISSION FORM LINK HERE]`** placeholder.
2. **Consent-capture fields** added to **Founders** and **Referral Partners** (so the permission form
   has somewhere to write): `Feature permission signed` (checkbox), `Signature (typed name)`,
   `Consent language version`. (Existing `Consent to feature` / `Consent scope` / `Consent date` retained.)
3. **Calendly event descriptions** updated (only API-editable field; questions/duration preserved):
   - **The Brand Blueprint | Guest Interview** — added the Founder Chapter feature-permission paragraph.
   - **VGP | Partner & Institutional Introduction** — added the partner/investor feature-permission paragraph.

### Remaining manual steps (Dana / not API-possible)
- **Create the permission Form view** on the Founders table (and a Referral Partners variant) exposing:
  Founder Name(s), Brand/Client Name, Email, the approved consent language with an "I agree" checkbox,
  Signature (typed name), Consent scope (Website / Newsletter / Social & marketing), Consent date,
  Feature permission signed, Consent language version (default `BB-2026-09`), and asset-rights
  confirmation. (Airtable form-view creation isn't exposed to the API.)
- **Paste the form's URL** into the automation email (replace the placeholder) and into the two
  Calendly descriptions, then **turn the automation ON**.
- **Calendly Workflow** (follow-up email) — not API-manageable: in Calendly → Workflows, add a
  post-event follow-up on "The Brand Blueprint | Guest Interview" that sends the permission-form link.
- **Legal read** of the consent language before external send (Dana-approved wording, pending counsel).

## D. Theme section copy — PLACED (2026-09-01, preview theme, Dana said "take over")
Applied directly via `themeFilesUpsert` on the unpublished BB Preview theme (both upserts returned
success; a post-write re-read to eyeball them was blocked by the session's auto-mode classifier, so
verification is by the mutation's success response, not a second read — changes are text-level only,
no liquid logic touched):

1. **Hot List routing notice** — DONE. Added after the intro in `sections/bb-hot-list.liquid`:
   "Information reflects founder-approved updates as of the date shown. Please route introductions and
   support through the designated Brand Blueprint pathway rather than using or distributing private
   founder information." (with a `.bb-hotlist-notice` fine-print style).
2. **Events empty-state + Date TBA** — DONE in `sections/bb-events-index.liquid`: the no-events callout
   now reads "New Brand Blueprint events and founder sessions are being scheduled. Join the Founder
   Network or subscribe for verified announcements as dates are confirmed." (+ a Join button), and the
   `{% else %}Date TBA{% endif %}` fallback was removed so no "Date TBA" can appear in the active grid.
3. **Hot List card fields (future).** `bb-hot-list.liquid` renders stage/sector/headline/traction/
   current_ask/website/updated. To surface the new approved fields, extend the card to show `image`
   (approved photo/logo), `requested_intro`, `opportunity_tags`, `geo_market`, and to respect `expires`
   (hide past-dated asks) and `visibility`/`approval_status`.

## E. Live member-gate access test — cannot run from here
The storefront (`the-brand-blueprint.myshopify.com`) is blocked by this environment's egress proxy
(WebFetch and Playwright both), so no live browser test is possible here. It also isn't meaningful
while the **store password is ON** — the password wall precedes the member gate for every visitor.

Verified in theme code instead (logic is sound):
- Store password wall gates the whole storefront; `bb-member-gate.liquid` then gates member content on
  `customer.tags contains "Founder Network"`.
- `resource`, `founder_chapter`, and `hot_list_founder` sections render only `status=='published"`;
  DRAFT metaobjects and `[EDITORIAL REVIEW]`/`[PLACEHOLDER]` titles are excluded.

**Owner procedure to run the real test** (when ready to validate, password still on for the public):
1. In an incognito window, open a `member-*` page → expect the store password page (nothing exposed).
2. Enter the storefront password, then view a member resource page while **logged out** → expect the
   sign-in / "compare memberships" gate, not the resource.
3. Log in as a customer **without** the `Founder Network` tag → still gated.
4. Add the `Founder Network` tag to that test customer (interim, until Flow A/B) → reload → resources
   visible. Remove the tag → gated again.
