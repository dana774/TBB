# 23 — Gmail + Calendly → HubSpot integration setup

Grounded to the live accounts: HubSpot portal **246956537** (na2), Gmail **dana@valugrowthpartners.com**,
Calendly **calendly.com/valugrowthpartners** (America/New_York). HubSpot is the relationship + activity
system of record; Gmail and Calendly feed it. Supporting properties already exist in HubSpot
(`vgp_scheduling_eligibility`, `vgp_original_relationship_source` [incl. Gmail/Calendly], `vgp_latest_relationship_source`,
`vgp_last_meaningful_interaction`, `vgp_next_follow_up_date`).

> **What is UI vs API.** Connecting an inbox and installing the Calendly app are OAuth/marketplace
> actions performed in the HubSpot UI — they can't be done through the CRM API. The property model they
> write into is already built. On the **Starter** plan there are **no workflows**, so the automation
> below is either the integration's own native field mapping or a light manual step, not a HubSpot workflow.

---

## Part A — Gmail

### A1. Connect the inbox
HubSpot → **Settings → General → Email → Connect personal email** → **Google/Gmail** → authorize
`dana@valugrowthpartners.com`. Then install the **HubSpot Sales Chrome/Gmail extension** for send-from-Gmail
logging and the compose-window tools.

### A2. Logging defaults
- Turn **Log** ON (writes 1:1 email to the contact timeline), **Track** selective (open/click tracking only
  where useful — not on personal or sensitive threads).
- Association: emails auto-associate to the contact (and its company) by address — this is why the
  contact model matters. Meaningful threads should also bump `vgp_last_meaningful_interaction` (set
  manually on Starter, or via the extension's task prompt).

### A3. Never-log / do-not-auto-create list (grounded in the real inbox)
Turn **OFF** "automatically create contacts for people I email," and add a **Never Log** list so bulk/
automated mail doesn't pollute the CRM. Based on the account's actual labels:
- **Google Alerts** (1,305 messages) — never log, never create.
- Newsletters, receipts, and no-reply/automated senders — never log.
- Personal/family threads — never log (respects the same boundary as `vgp_consent_status = Do not market`).
- Existing lead-source labels to preserve as context, not bulk-import: `VGP Info/Arkla Finance/ALTFC – Broker`
  (18), `… Manufacturing Conference Leads` (16), `… Alabama Business Expansion Leads` (5),
  `Brand Blueprint Invites` (1). When one of these becomes a real relationship, create the contact
  deliberately and set `vgp_original_relationship_source = Gmail` (or `Referral`/`Conference` as fits).

### A4. Contact-creation rule
Create contacts **selectively** — from the compose window or by logging a specific thread — not
indiscriminately. This is what prevents a repeat of the 1,826-contact address-book dump.

### A5. Signature architecture (preserve)
Keep the controlled email-signature links pointing at the **owned** scheduling/intake path
(Fit & Reconnect), never raw private Calendly links — same governance as Part B and the business-card system.

### A6. Test
Send/log one real 1:1 email → confirm it appears on the right contact, no new junk contacts created,
Google Alerts stays out.

---

## Part B — Calendly

### B1. Install
HubSpot **App Marketplace → Calendly → Install**, connect the `valugrowthpartners` account. Enable:
create/update contact on booking, log the meeting to the timeline, and (where the plan allows) write the
event type to a contact field. Also connect **Google Calendar** in HubSpot so booked events sync to the
timeline.

### B2. Event-type → routing map (live event types)
On each booking, the contact should carry the right `vgp_scheduling_eligibility` and relationship signal.
Full machine-readable table: [`../hubspot-migration/calendly-eventtype-routing.csv`](../hubspot-migration/calendly-eventtype-routing.csv).

| Calendly event type | Scheduling Eligibility | Relationship signal / deal |
|---|---|---|
| Brand Blueprint \| Fit & Reconnect Call | Qualified prospect | Consulting Prospect (public qualifier) |
| VGP \| Active Client Strategy Session | Active client | Client Status Active — **no** new deal |
| VGP \| Partner & Institutional Introduction | Institutional | Institutional Partner / Investor; possible deal |
| The Brand Blueprint \| Guest Interview | Podcast guest | Podcast or Media Contact |
| Build in Tulsa \| Founder Diagnostic / Exec Coaching | Program participant | Program Affiliation = Build in Tulsa |
| SEED SPOT \| Founder Office Hours | Program participant | Program Affiliation = SEED SPOT |
| W.E. Build Cohort 4 \| Office Hours | Program participant | Program Affiliation = W.E. Build |
| Black Ambition Open Office Hours *(inactive)* | Program participant | Program Affiliation = Black Ambition |
| JumpStart \| Founder Commercialization *(pilot)* | Program participant | activate after eligibility confirmed |
| COECP 1:1 *(legacy/inactive)* | No scheduling | retire or repurpose |

### B3. On each booking
- Upsert contact by email (Calendly integration does this — de-dupes on email).
- Log the event; set `vgp_latest_relationship_source = Calendly`; stamp `vgp_last_meaningful_interaction`.
- Set the audience/eligibility per B2 (native field mapping where available; otherwise a quick manual set,
  since Starter has no workflow to automate it).
- **Create a deal only when commercially appropriate** — Partner/Institutional, paid workshop/speaking,
  sponsorship — never for office hours, program sessions, or podcast guests.

### B4. Private-link governance (do not violate)
Public paths lead only to **Fit & Reconnect** (`.../vgp-insight-session`). **Never** expose the protected
links via a HubSpot page or automated email: Active Client Strategy, all program links (Build in Tulsa,
SEED SPOT, W.E. Build, Black Ambition, JumpStart), the podcast Guest Interview link, and the
Partner/Institutional intro link. Keep separate scheduling actions per audience — not one universal scheduler.

### B5. Test
Book a test on Fit & Reconnect → confirm the contact updates, the meeting logs, eligibility is set, and no
deal is auto-created.

---

## Starter-plan note
Property-setting on booking/logging that would normally be a **workflow** is either handled by each
integration's own field mapping or done as a light manual step — Starter has no workflow engine. If you
later move to **Professional**, convert B3's field-setting and any lead-routing into workflows, and add
sequences off the Gmail integration.
