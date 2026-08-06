# 24 — Dashboards & segments

HubSpot reporting has two layers:
1. **Segment lists** — saved, auto-updating views of contacts by `vgp_*` property. **API-creatable**
   (see `hubspot-migration/build/03_create_lists.py`); they are the backbone every dashboard report
   filters on.
2. **Visual dashboards** — the chart tiles. HubSpot does **not** expose report/dashboard chart creation
   to the API, and on the **Starter** plan custom-report building is limited, so these are built in the
   UI (**Reporting → Dashboards → Create dashboard**) from the lists/properties below. This doc is the
   build sheet.

> Scope note: creating the lists needs the token to carry `crm.lists.read` + `crm.lists.write`. Add those
> to the Private App's scopes (same token, no re-paste) and run `03_create_lists.py`.

## Segment lists (built by `03_create_lists.py`)

| List | Filter | Feeds |
|---|---|---|
| VGP · Active Clients | Primary Relationship Type = Active Client | Client health dashboard |
| VGP · Consulting Prospects (open) | Primary = Consulting Prospect | Consulting pipeline |
| VGP · Founder Prospect Pipeline | Primary = Founder **or** Additional contains Founder | Founder pipeline |
| VGP · Institutional & Referral Partners | Primary in {Institutional Partner, Referral Partner, Specialist/Service Partner} | Partnership pipeline |
| VGP · Investor & Capital Relationships | Primary = Investor/Capital **or** Additional contains it | Investor dashboard |
| VGP · Podcast & Media Contacts | Primary/Additional = Podcast or Media Contact | Podcast pipeline |
| VGP · Program Participants | Program Affiliation is set | Program/ecosystem view |
| VGP · Managed Relationships (curated) | Data Review Status = Approved | The actionable 102 |
| VGP · Needs Manual Review | Data Review Status = Manual review | Data-quality queue |
| VGP · Needs Classification (Google import) | Data Review Status = Unreviewed | Triage the 1,826 |

## Dashboards to build (UI)

Each dashboard = a few report tiles. "Source" is the list or object + filter.

### 1. Active Client Relationship Health
- Active clients — count (list: Active Clients)
- Active clients by **Last Meaningful Interaction** (date range buckets) — surfaces going-cold clients
- Open tasks on active clients (Tasks, associated to Active Clients list)
- Active clients by Business Unit

### 2. Open Consulting Opportunities
- Deals in **VGP Commercial Pipeline** by stage (Deals, pipeline = VGP Commercial Pipeline)
- Consulting Prospects count + by Scheduling Eligibility (list: Consulting Prospects)
- Deal Opportunity Type breakdown

### 3. Founder Prospect Pipeline
- Founders by lifecycle stage (list: Founder Prospect Pipeline)
- Founders by Program Affiliation
- New founders over time (createdate)

### 4. Institutional Partnership Pipeline
- Partners by subtype (Primary Relationship Type within the Partners list)
- Institutional deals in pipeline (Deals, Opportunity Type = Institutional Program / Brand Blueprint Partnership)

### 5. Investor & Capital Relationships
- Investors count + by Relationship Status (list: Investor & Capital)
- Last interaction recency

### 6. Networking Contacts Requiring Follow-Up
- Contacts with an **open HIGH-priority task** (Tasks: priority = High, status = Not started)
- Contacts by Follow-Up Priority
- Recently added contacts needing a next action

### 7. Form Conversion by Source & Audience *(after forms are live — docs 22)*
- Submissions by `vgp_attr_source` / `vgp_attr_route` / `vgp_attr_audience`
- New contacts by Original Relationship Source

### 8. Calendly Meetings by Event Type *(after Calendly is live — docs 23)*
- Meetings by event type / by Scheduling Eligibility
- Bookings over time

### 9. Shopify Subscriber & Customer Growth *(after Shopify sync — docs 22)*
- Customers vs Subscribers over time; new customers by month

### 10. Contacts Missing Classification
- **Needs Classification (Google import)** count trending **down** over time (the triage burn-down)
- Contacts with no Primary Relationship Type
- Contacts with no company association

## How to build one report (UI, quick)
Reporting → Dashboards → **Create dashboard** → add report → **Single object** (Contacts/Deals/Tasks) →
pick chart type → set the **filter** to the list or property above → save to the dashboard. Repeat per tile.
Dashboards 7–9 stay empty until their integrations feed data.
