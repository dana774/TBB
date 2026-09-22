# VGP Commercial Pipeline — spec

Create **one** pipeline in Settings → Objects → Deals → Pipelines. A deal exists **only** for a
defined commercial/funded opportunity — never auto-created from a relationship, list membership,
or meeting.

## Stages

| # | Stage | Notes |
|---|---|---|
| 1 | New Opportunity | Commercial intent identified |
| 2 | Qualification Required | Fit/scope not yet confirmed |
| 3 | Discovery Scheduled | Fit & Reconnect or discovery booked |
| 4 | Qualified | Confirmed fit; SQL |
| 5 | Scope Development | Defining engagement |
| 6 | Proposal Submitted | Proposal/SOW out |
| 7 | Decision or Negotiation | — |
| 8 | Contracting | Paperwork |
| 9 | Closed Won | Won |
| 10 | Closed Lost | Lost |
| 11 | Nurture or Deferred | Real but not now |

## Deal property — Opportunity Type (`vgp_opportunity_type`, dropdown, required)

VGP Advisory; Retainer; Institutional Program; Workshop or Speaking; Brand Blueprint Partnership;
Sponsorship; Founder Program; Strategic Project; Other.

## Lifecycle governance

Lifecycle stage stays broad and does **not** carry the relationship taxonomy (that lives in
`vgp_primary_relationship_type`). Import defaults: Founder → Lead; Consulting Prospect → Sales
Qualified Lead; Active Client → Customer; Shopify/newsletter → Subscriber. Do not bulk-promote
lifecycle after import — reclassify deliberately once the taxonomy is live.

## Future split

If volume justifies, break Institutional Program and Sponsorship into their own pipelines later.
