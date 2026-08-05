"""Create the VGP relationship-model schema in HubSpot: property group, all custom
properties (contacts, companies, deals) and the VGP Commercial Pipeline.

Idempotent: skips anything that already exists. Safe to re-run.
Usage:  HUBSPOT_TOKEN=pat-... python3 01_create_schema.py [--dry-run]
"""
import sys, hs_api as h

DRY = "--dry-run" in sys.argv
GROUP = "vgp_relationship_model"
GROUP_LABEL = "VGP Relationship Model"

def opts(*labels):
    return [{"label": l, "value": l, "displayOrder": i} for i, l in enumerate(labels)]

REL_TYPES = ["Active Client","Former Client","Consulting Prospect","Founder","Institutional Partner",
 "Investor or Capital Provider","Retail or Corporate Contact","Referral Partner","Specialist or Service Partner",
 "Podcast or Media Contact","Sponsor Prospect","Speaker or Event Organizer","Program Participant",
 "Professional Peer","Vendor","Personal Network","Automated or Publication Contact","Other"]
BUSINESS_UNITS = ["Value Growth Partners","The Brand Blueprint","Podcast","RED Academy","Accelerator or Ecosystem","Speaking and Media"]
PROGRAMS = ["RED Academy","CIC","Build in Tulsa","SEED SPOT","W.E. Build","Black Ambition","JumpStart","Other"]
SOURCES = ["Google Contacts","Gmail","Popl","LinkedIn","Referral","Conference","Website","Podcast","Shopify","Calendly","Program"]

# (name, label, type, fieldType, options)
CONTACT_PROPS = [
 ("vgp_primary_relationship_type","Primary Relationship Type","enumeration","select",REL_TYPES),
 ("vgp_additional_relationship_types","Additional Relationship Types","enumeration","checkbox",REL_TYPES),
 ("vgp_business_unit","Business Unit","enumeration","checkbox",BUSINESS_UNITS),
 ("vgp_relationship_status","Relationship Status","enumeration","select",["New","Warm","Active","Strategic","Dormant","Closed"]),
 ("vgp_primary_interest","Primary Interest","enumeration","select",["Consulting","Retail","Capital","Founder Resources","Speaking","Partnership","Podcast","Sponsorship"]),
 ("vgp_program_affiliation","Program or Ecosystem Affiliation","enumeration","checkbox",PROGRAMS),
 ("vgp_original_relationship_source","Original Relationship Source","enumeration","select",SOURCES),
 ("vgp_latest_relationship_source","Latest Relationship Source","enumeration","select",SOURCES),
 ("vgp_follow_up_priority","Follow-Up Priority","enumeration","select",["Urgent","High","Normal","Low","None"]),
 ("vgp_next_follow_up_date","Next Follow-Up Date","date","date",None),
 ("vgp_last_meaningful_interaction","Last Meaningful Interaction","date","date",None),
 ("vgp_scheduling_eligibility","Scheduling Eligibility","enumeration","select",["Public intake only","Qualified prospect","Active client","Institutional","Podcast guest","Program participant","No scheduling"]),
 ("vgp_consent_status","Consent Status","enumeration","select",["Explicit opt-in","Implied (existing relationship)","Unknown","Do not market"]),
 ("vgp_legacy_source_lists","Legacy Source Lists","enumeration","checkbox",["Active Clients","Founder Prospects","All Founders","Inner Circle Investors","Past Clients","Partners","Friends and Family","TBB Guests"]),
 ("vgp_data_review_status","Data Review Status","enumeration","select",["Unreviewed","Manual review","Approved","Imported","Hold"]),
 ("vgp_additional_phones","Additional Phone Numbers","string","text",None),
 ("vgp_attr_site","Attribution — Site","string","text",None),
 ("vgp_attr_page","Attribution — Page","string","text",None),
 ("vgp_attr_campaign","Attribution — Campaign","string","text",None),
 ("vgp_attr_source","Attribution — Source","string","text",None),
 ("vgp_attr_audience","Attribution — Audience","string","text",None),
 ("vgp_attr_route","Attribution — Route","string","text",None),
 ("vgp_attr_offer","Attribution — Offer","string","text",None),
 ("vgp_attr_referral","Attribution — Referral","string","text",None),
]
COMPANY_PROPS = [
 ("vgp_organization_type","Organization Type","enumeration","select",["Founder Brand","Client Company","Accelerator","University","Retailer","Investor or Fund","Government","Nonprofit","Media","Service Partner","Other"]),
 ("vgp_business_unit_rel","Business Unit Relationship","enumeration","checkbox",BUSINESS_UNITS),
 ("vgp_strategic_priority","Strategic Priority","enumeration","select",["Tier 1","Tier 2","Tier 3","Monitor"]),
 ("vgp_company_program_affiliation","Program Affiliation","enumeration","checkbox",PROGRAMS),
 ("vgp_institutional_status","Institutional Relationship Status","enumeration","select",["Prospective","Active","Historical","Dormant"]),
 ("vgp_company_review_status","Data Review Status","enumeration","select",["Unreviewed","Manual review","Approved","Imported","Hold"]),
]
DEAL_PROPS = [
 ("vgp_opportunity_type","Opportunity Type","enumeration","select",["VGP Advisory","Retainer","Institutional Program","Workshop or Speaking","Brand Blueprint Partnership","Sponsorship","Founder Program","Strategic Project","Other"]),
]

PIPELINE_LABEL = "VGP Commercial Pipeline"
STAGES = [  # (label, probability, isClosedWon-ish)
 ("New Opportunity","0.1"),("Qualification Required","0.2"),("Discovery Scheduled","0.3"),
 ("Qualified","0.4"),("Scope Development","0.5"),("Proposal Submitted","0.6"),
 ("Decision or Negotiation","0.75"),("Contracting","0.9"),("Closed Won","1.0"),
 ("Closed Lost","0.0"),("Nurture or Deferred","0.1")]

def ensure_group(obj):
    r = h.get(f"/crm/v3/properties/{obj}/groups/{GROUP}")
    if h.ok(r): print(f"  group exists ({obj})"); return
    if DRY: print(f"  [dry] create group {GROUP} on {obj}"); return
    r = h.post(f"/crm/v3/properties/{obj}/groups", {"name":GROUP,"label":GROUP_LABEL,"displayOrder":-1})
    print(f"  group {obj}: {r.status_code}")

def ensure_prop(obj, name, label, ptype, ftype, options):
    r = h.get(f"/crm/v3/properties/{obj}/{name}")
    if h.ok(r): print(f"  exists: {name}"); return
    body = {"name":name,"label":label,"type":ptype,"fieldType":ftype,"groupName":GROUP}
    if options: body["options"] = opts(*options)
    if DRY: print(f"  [dry] create {obj}.{name} ({ptype}/{ftype})"); return
    r = h.post(f"/crm/v3/properties/{obj}", body)
    print(f"  {'OK' if h.ok(r) else 'ERR '+str(r.status_code)}: {name}" + ("" if h.ok(r) else f" {h.j(r)}"))

def ensure_pipeline():
    r = h.get("/crm/v3/pipelines/deals")
    existing = [p for p in h.j(r).get("results",[]) if p.get("label")==PIPELINE_LABEL] if h.ok(r) else []
    if existing: print(f"  pipeline exists: {PIPELINE_LABEL}"); return
    stages=[{"label":lbl,"displayOrder":i,
             "metadata":{"probability":prob,"isClosed":"true" if lbl.startswith("Closed") else "false"}}
            for i,(lbl,prob) in enumerate(STAGES)]
    body={"label":PIPELINE_LABEL,"displayOrder":1,"stages":stages}
    if DRY: print(f"  [dry] create pipeline {PIPELINE_LABEL} with {len(stages)} stages"); return
    r=h.post("/crm/v3/pipelines/deals", body)
    print(f"  pipeline: {'OK' if h.ok(r) else 'ERR '+str(r.status_code)} {'' if h.ok(r) else h.j(r)}")

if __name__ == "__main__":
    acct = h.j(h.get("/account-info/v3/details"))
    print("Account portalId:", acct.get("portalId"), "(expect 246956537)")
    print("== Contacts =="); ensure_group("contacts")
    for p in CONTACT_PROPS: ensure_prop("contacts", *p)
    print("== Companies =="); ensure_group("companies")
    for p in COMPANY_PROPS: ensure_prop("companies", *p)
    print("== Deals =="); ensure_group("deals")
    for p in DEAL_PROPS: ensure_prop("deals", *p)
    print("== Pipeline =="); ensure_pipeline()
    print("Schema step complete.")
