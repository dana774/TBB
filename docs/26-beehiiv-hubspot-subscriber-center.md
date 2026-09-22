# 26 — Beehiiv → HubSpot subscriber center

The Brand Blueprint / founder-network newsletter lives in **Beehiiv**; HubSpot is the relationship
system of record. This wires Beehiiv subscribers into HubSpot as the **Subscriber** layer of the CRM,
deduped and tagged, without letting a bulk list flood or overwrite the structured relationships.

- HubSpot account **246956537** (na2). Beehiiv = newsletter/subscription system of record.
- Ownership: **Beehiiv** owns sending, list management, and subscription mechanics. **HubSpot** mirrors
  the person as a contact with subscriber status + attribution, so newsletter audience is visible
  alongside clients/prospects/founders. Sending stays in Beehiiv; HubSpot does not email the list.

## HubSpot side (built)
- `vgp_original_relationship_source` / `vgp_latest_relationship_source` — options **Newsletter** and
  **Beehiiv** added.
- `vgp_newsletter_status` (new) — Active subscriber; Unsubscribed; Pending; Cleaned / bounced.
- Existing: `lifecyclestage` (Subscriber), `vgp_business_unit` (The Brand Blueprint), `vgp_consent_status`.

## Sync mapping (Beehiiv subscriber → HubSpot contact)

| Beehiiv | → | HubSpot |
|---|---|---|
| email | → | email (upsert key — never duplicate) |
| status active/inactive/pending/… | → | `vgp_newsletter_status` |
| subscribed → | → | `lifecyclestage = Subscriber` (only if not already a higher stage) |
| — | → | `vgp_original_relationship_source = Newsletter` (first touch), `vgp_latest = Beehiiv` |
| — | → | `vgp_business_unit = The Brand Blueprint` |
| marketing consent / opt-in | → | `vgp_consent_status` (Explicit opt-in when opted in) |
| paid tier (if any) | → | `lifecyclestage = Customer` + note the tier |
| utm/referral (if present) | → | `vgp_attr_source` / `vgp_attr_referral` |

## Rules (protect the CRM)
1. **Upsert by email.** A subscriber who's already a contact (client, prospect, founder) is **enriched**
   with newsletter status — **not** duplicated and **never** downgraded from Customer/relationship to
   Subscriber. Only set `lifecyclestage = Subscriber` when the contact has no higher stage.
2. **Scale check before bulk import.** Newsletter lists can be large; confirm the count first (avoids a
   Google-Contacts-style flood, and HubSpot marketing-contact billing implications). If the list is big
   and mostly cold, sync **active subscribers** first and treat the rest as a separate segment.
3. **Suppression respect.** Unsubscribed/cleaned in Beehiiv → `vgp_newsletter_status` set accordingly and
   `vgp_consent_status = Do not market`; never re-market to them from HubSpot.
4. **One direction for sending.** HubSpot mirrors status; it does not send the newsletter. If HubSpot
   ever suppresses someone, reflect that back to Beehiiv manually (or via the chosen bridge).

## Mechanism options
- **Beehiiv native integration / API → HubSpot** (preferred if Beehiiv plan supports HubSpot).
- **Claude-run sync** via the Beehiiv + HubSpot connectors (one-time backfill + periodic top-up) — ready
  to run once the Beehiiv connector is stable; it will scope the count and confirm before a large import.
- **Zapier** "new Beehiiv subscriber → HubSpot contact upsert" for ongoing real-time adds.

## Dashboard tie-in
Feeds Dashboard #9 (Shopify **&** newsletter subscriber growth) in `docs/24`: new subscribers over time,
active vs unsubscribed, and subscribers who convert to prospects/clients (lifecycle progression).

## Run checklist (when Beehiiv connector is stable)
- [ ] Pull publication + **subscriber count** (scope the import; confirm with Dana if large)
- [ ] Backfill active subscribers → upsert into HubSpot with the mapping above
- [ ] Set `vgp_newsletter_status`, source, business unit, consent
- [ ] Verify no duplicates / no downgraded relationships
- [ ] Establish ongoing top-up (Claude periodic, native, or Zapier)
