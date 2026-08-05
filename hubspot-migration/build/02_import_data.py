"""Import the deduplicated master contacts + companies into HubSpot with full taxonomy,
reconciling against existing records (upsert by email). Creates priority follow-up tasks.

Prereq: run 01_create_schema.py first (properties + pipeline must exist).
Data: expects the delivered CSVs in --data-dir (default ./data):
      01_hubspot_contacts_ALL.csv, 04_hubspot_companies_import.csv
Usage: HUBSPOT_TOKEN=pat-... python3 02_import_data.py [--data-dir DIR] [--dry-run] [--pilot]
       --pilot limits to the 10 pilot rows (02_hubspot_contacts_PILOT_10.csv).
"""
import sys, os, csv, hs_api as h

DRY = "--dry-run" in sys.argv
PILOT = "--pilot" in sys.argv
DATA = "./data"
if "--data-dir" in sys.argv: DATA = sys.argv[sys.argv.index("--data-dir")+1]
OWNER_ID = "96660188"  # Dana Ammons

LIFECYCLE = {"Lead":"lead","Sales Qualified Lead":"salesqualifiedlead","Customer":"customer",
             "Subscriber":"subscriber","Marketing Qualified Lead":"marketingqualifiedlead","Opportunity":"opportunity"}
# email -> existing HubSpot contact id, for the 2 secondary-email merges (do not duplicate)
SECONDARY_MERGE = {"aron_thompson@gspnet.com":"530999109366", "lisa@braintrustfund.vc":"530935030504"}
PRIORITY_TYPES = {"Active Client","Consulting Prospect","Institutional Partner","Investor or Capital Provider"}

def semi(v): return ";".join(p.strip() for p in (v or "").split(";") if p.strip())

def rows(fn):
    with open(os.path.join(DATA, fn)) as f:
        return list(csv.DictReader(f))

def contact_props(r):
    p = {
     "email": r["Email"].strip().lower(),
     "firstname": r.get("First Name","").strip(),
     "lastname": r.get("Last Name","").strip(),
     "jobtitle": r.get("Job Title","").strip(),
     "phone": r.get("Phone Number","").strip(),
     "vgp_primary_relationship_type": r.get("Primary Relationship Type","").strip(),
     "vgp_additional_relationship_types": semi(r.get("Additional Relationship Types","")),
     "vgp_business_unit": semi(r.get("Business Unit","")),
     "vgp_legacy_source_lists": semi(r.get("Legacy Source Lists","")),
     "vgp_original_relationship_source": r.get("Original Relationship Source","Google Contacts").strip() or "Google Contacts",
     "vgp_data_review_status": {"Ready for pilot":"Approved","Manual review":"Manual review"}.get(r.get("Data Review Status","").strip(),"Unreviewed"),
     "lifecyclestage": LIFECYCLE.get(r.get("Lifecycle Stage","").strip(),"lead"),
    }
    if r.get("Company name","").strip(): p["company"] = r["Company name"].strip()
    if semi(r.get("Additional email addresses","")): p["hs_additional_emails"] = semi(r.get("Additional email addresses",""))
    if semi(r.get("Additional Phone Numbers","")): p["vgp_additional_phones"] = semi(r.get("Additional Phone Numbers",""))
    return {k:v for k,v in p.items() if v not in ("", None)}

def upsert_contacts(data):
    # Split off secondary merges (update by id) from the rest (upsert by email)
    to_upsert, to_update = [], []
    for r in data:
        email = r["Email"].strip().lower()
        if email in SECONDARY_MERGE:
            to_update.append((SECONDARY_MERGE[email], contact_props(r)))
        else:
            to_upsert.append({"idProperty":"email","id":email,"properties":contact_props(r)})
    print(f"Contacts: {len(to_upsert)} upsert-by-email, {len(to_update)} secondary-merge updates")
    id_by_email = {}
    for i in range(0, len(to_upsert), 100):
        batch = to_upsert[i:i+100]
        if DRY:
            for b in batch: print("  [dry] upsert", b["id"], "|", b["properties"].get("vgp_primary_relationship_type"))
            continue
        r = h.post("/crm/v3/objects/contacts/batch/upsert", {"inputs":batch})
        res = h.j(r)
        if not h.ok(r): print("  ERR batch upsert", r.status_code, res); continue
        for obj in res.get("results",[]):
            id_by_email[obj["properties"].get("email","").lower()] = obj["id"]
        print(f"  upserted {i+len(batch)}/{len(to_upsert)}")
    for cid, props in to_update:
        if DRY: print("  [dry] update existing id", cid); continue
        props.pop("email", None)  # don't fight the existing primary email
        r = h.patch(f"/crm/v3/objects/contacts/{cid}", {"properties":props})
        print(f"  merge->{cid}: {r.status_code}")
    return id_by_email

def upsert_companies(companies):
    print(f"Companies: {len(companies)}")
    id_by_name = {}
    inputs = []
    for c in companies:
        props = {"name":c["Company name"].strip()}
        if c.get("Company Domain Name","").strip(): props["domain"] = c["Company Domain Name"].strip()
        if semi(c.get("Business Unit Relationship","")): props["vgp_business_unit_rel"] = semi(c.get("Business Unit Relationship",""))
        inputs.append(props)
    if DRY:
        for p in inputs: print("  [dry] company", p["name"]);
        return id_by_name
    for i in range(0, len(inputs), 100):
        batch = inputs[i:i+100]
        r = h.post("/crm/v3/objects/companies/batch/create", {"inputs":[{"properties":p} for p in batch]})
        res = h.j(r)
        if not h.ok(r): print("  ERR company batch", r.status_code, res); continue
        for obj in res.get("results",[]):
            id_by_name[obj["properties"]["name"].strip().lower()] = obj["id"]
    return id_by_name

def associate(contacts, cid_by_email, coid_by_name):
    n=0
    for r in contacts:
        email=r["Email"].strip().lower(); org=r.get("Company name","").strip().lower()
        cid=cid_by_email.get(email); coid=coid_by_name.get(org)
        if not (cid and coid): continue
        if DRY: n+=1; continue
        rr=h.post(f"/crm/v4/objects/contacts/{cid}/associations/default/companies/{coid}", {})
        n+= 1 if h.ok(rr) else 0
    print(f"Associations: {n}")

def make_tasks(contacts, cid_by_email):
    prio=[r for r in contacts if r.get("Primary Relationship Type","").strip() in PRIORITY_TYPES]
    print(f"Priority follow-up tasks: {len(prio)}")
    for r in prio:
        cid=cid_by_email.get(r["Email"].strip().lower())
        if not cid: continue
        subj=f"Confirm relationship & next step — {r.get('First Name','')} {r.get('Last Name','')}".strip()
        if DRY: print("  [dry] task:", subj); continue
        body={"properties":{"hs_task_subject":subj,"hs_task_status":"NOT_STARTED","hs_task_priority":"HIGH",
                            "hubspot_owner_id":OWNER_ID,"hs_task_body":f"Imported {r.get('Primary Relationship Type')} — review taxonomy and set next action."},
              "associations":[{"to":{"id":cid},"types":[{"associationCategory":"HUBSPOT_DEFINED","associationTypeId":204}]}]}
        rr=h.post("/crm/v3/objects/tasks", body)
        if not h.ok(rr): print("  task ERR", rr.status_code, h.j(rr))

if __name__ == "__main__":
    print("portalId:", h.j(h.get("/account-info/v3/details")).get("portalId"))
    cfile = "02_hubspot_contacts_PILOT_10.csv" if PILOT else "01_hubspot_contacts_ALL.csv"
    contacts = rows(cfile)
    print(f"Loaded {len(contacts)} contacts from {cfile}" + (" [DRY RUN]" if DRY else ""))
    cid_by_email = upsert_contacts(contacts)
    if not PILOT:
        companies = rows("04_hubspot_companies_import.csv")
        coid_by_name = upsert_companies(companies)
        associate(contacts, cid_by_email, coid_by_name)
    make_tasks(contacts, cid_by_email)
    print("Import step complete." if not DRY else "Dry run complete — no writes made.")
