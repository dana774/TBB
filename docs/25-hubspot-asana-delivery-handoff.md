# 25 — HubSpot → Asana delivery handoff

When a commercial opportunity is won, the relationship/commercial record stays in **HubSpot** and the
**delivery/execution** moves to **Asana**. This doc is the handoff contract: the trigger, the field
mapping, the Asana project template, and the SOP — plus the supporting HubSpot fields (already built)
and a copy-paste prompt for an Asana-managing agent.

- HubSpot account **246956537** (na2). Asana workspace **1200319959281435** (Dana Ammons).
- System ownership: **HubSpot** = person/company/relationship + deal pipeline + commercial status.
  **Asana** = the delivery project, tasks, milestones, and execution status. Asana never becomes the
  relationship system of record; HubSpot never tracks task-level delivery.

## Trigger
A HubSpot deal in **VGP Commercial Pipeline** reaches **Closed Won** (or an Active Client engagement
formally starts). That is the only moment a delivery project is created — not at earlier stages.

## HubSpot side (built)
Three Deal properties now carry the handoff (group *VGP Relationship Model*):

| Property | Internal name | Values |
|---|---|---|
| Delivery Handoff Status | `vgp_delivery_status` | Not started; Handed off to Asana; In delivery; On hold; Delivered / Closed |
| Delivery Project (Asana URL) | `vgp_delivery_project_url` | URL of the Asana delivery project |
| Delivery Owner | `vgp_delivery_owner` | Who owns execution |

Flow: on Closed Won → set `vgp_delivery_status = Handed off to Asana`, create the Asana project (below),
paste its link into `vgp_delivery_project_url`, set the owner. As delivery progresses, `vgp_delivery_status`
moves to *In delivery* → *Delivered / Closed*. That single field is how delivery state rolls back up to
the relationship record without HubSpot tracking tasks.

## Field mapping (HubSpot deal → Asana project)

| HubSpot | → | Asana |
|---|---|---|
| Deal / associated company name | → | Project name: `VGP Delivery — {Client}` |
| `vgp_opportunity_type` | → | Project field **Engagement Type** (VGP Advisory, Retainer, Institutional Program, …) |
| Close date / amount | → | Project **Start** + **Target** dates; brief |
| Associated primary contact + company | → | Project **Client** field + brief (do not import the contact list into Asana) |
| Deal record URL | → | Project field **HubSpot Deal** (link back) |
| ← Asana project URL | ← | `vgp_delivery_project_url` |
| ← Asana status | ← | `vgp_delivery_status` |

## Asana delivery template — "VGP Client Delivery — TEMPLATE"
A reusable project (copied per engagement). Sections and starter tasks, mapped to the VGP service lines:

**0 · Handoff & Setup**
- Confirm scope & deliverables from the HubSpot deal
- Create client folder in Google Drive (delivery docs system of record)
- Add kickoff invite (Active Client Strategy Session link, not a public scheduler)
- Set engagement dates, milestones, and owner

**1 · Kickoff & Discovery**
- Kickoff call + notes
- Data / document intake
- Baseline, goals & success metrics

**2 · Workstreams (enable only what the engagement covers)**
- Growth readiness · Capital readiness · Retail & distribution · Digital/AI operating system ·
  Operations & sourcing · Partner/investor orchestration

**3 · Delivery & Milestones**
- Milestone 1 / 2 / 3 deliverables
- Client reviews / recurring check-ins

**4 · Wrap & Handback**
- Final deliverable + engagement summary
- **Update HubSpot**: set `vgp_delivery_status = Delivered / Closed`; set next relationship action
- Flag renewal / upsell back to HubSpot (new deal if warranted)

Project custom fields: **Client**, **Engagement Type**, **HubSpot Deal** (URL), **Owner**,
**Start**, **Target**, **Status**.

> This template project is created via the Asana API once its connector is stable; until then it can be
> built by hand from the structure above, or Claude will create it on request.

## Automation note (Starter plan)
HubSpot **Starter has no workflows**, so the handoff runs as the SOP above (manual, ~2 minutes per won
deal). To automate later: HubSpot **Professional** workflow ("Deal → Closed Won → create Asana project"),
the native **HubSpot ⇄ Asana** integration, or a **Zapier** bridge. Whichever is chosen, keep the field
mapping above and the one-way status rollup via `vgp_delivery_status`.

## Copy-paste prompt — for an Asana-managing agent
> You manage VGP's delivery execution in Asana (workspace 1200319959281435). HubSpot (portal 246956537)
> owns relationships and the commercial pipeline; you own delivery. When told a HubSpot deal is **Closed
> Won**, copy the **"VGP Client Delivery — TEMPLATE"** project to `VGP Delivery — {Client}`, set the
> project fields from the deal (Engagement Type = `vgp_opportunity_type`, Client, HubSpot Deal URL,
> Owner, Start/Target dates), enable only the workstream sections the engagement covers, and return the
> new project URL so it can be written back to the deal's `vgp_delivery_project_url` and
> `vgp_delivery_status = Handed off to Asana`. Do not copy the CRM contact list into Asana; reference the
> client via the brief. On completion, report so HubSpot's `vgp_delivery_status` can be set to
> **Delivered / Closed** and any renewal/upsell flagged back as a new HubSpot deal. Keep HubSpot the
> system of record for the relationship; Asana the system of record for delivery tasks.
