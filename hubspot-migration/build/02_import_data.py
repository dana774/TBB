import sys, csv, re, collections, hs_lib as h

import os
DATA=os.environ.get("DATA_DIR","./data")
PILOT="--pilot" in sys.argv
QUAR="--quarantine" in sys.argv
OWNER="96660188"
LIFE={"Lead":"lead","Sales Qualified Lead":"salesqualifiedlead","Customer":"customer","Subscriber":"subscriber"}
PRIORITY={"Active Client","Consulting Prospect","Institutional Partner","Investor or Capital Provider"}
SECONDARY={"aron_thompson@gspnet.com":"athompson@ulmt.org","lisa@braintrustfund.vc":"lisa@thebraintrust.com"}

def semi(v): return ";".join(p.strip() for p in (v or "").split(";") if p.strip())
def put(path): return h._req("PUT", path)

def rows(fn):
    with open(f"{DATA}/{fn}") as f: return list(csv.DictReader(f))

def find_by_email(em):
    r=h.post("/crm/v3/objects/contacts/search",{"limit":1,"properties":["email"],
      "filterGroups":[{"filters":[{"propertyName":"email","operator":"EQ","value":em}]}]})
    res=h.j(r).get("results",[]); return res[0]["id"] if res else None

def all_contact_ids():
    ids=[]; after=None
    while True:
        d=h.j(h.get(f"/crm/v3/objects/contacts?limit=100"+(f"&after={after}" if after else "")))
        ids+=[r["id"] for r in d.get("results",[])]
        after=d.get("paging",{}).get("next",{}).get("after")
        if not after: break
    return ids

def quarantine():
    ids=all_contact_ids(); n=0
    for i in range(0,len(ids),100):
        r=h.post("/crm/v3/objects/contacts/batch/update",
            {"inputs":[{"id":c,"properties":{"vgp_data_review_status":"Unreviewed"}} for c in ids[i:i+100]]})
        n+= len(ids[i:i+100]) if r.status_code<300 else 0
    print(f"quarantine: {n}/{len(ids)} contacts flagged Unreviewed")

REL_MAP={"Podcast Guest":"Podcast or Media Contact"}
PROG_FROM_REL={"CIC Relationship":"CIC","RED Academy Relationship":"RED Academy"}

def contact_props(r):
    add_types=[]; progs=[]
    for v in [x.strip() for x in (r.get("Additional Relationship Types","") or "").split(";") if x.strip()]:
        if v in PROG_FROM_REL: progs.append(PROG_FROM_REL[v])
        else: add_types.append(REL_MAP.get(v,v))
    p={"email":r["Email"].strip().lower(),"firstname":r.get("First Name","").strip(),"lastname":r.get("Last Name","").strip(),
       "jobtitle":r.get("Job Title","").strip(),"phone":r.get("Phone Number","").strip(),
       "vgp_primary_relationship_type":r.get("Primary Relationship Type","").strip(),
       "vgp_additional_relationship_types":";".join(add_types),
       "vgp_program_affiliation":";".join(progs),
       "vgp_business_unit":semi(r.get("Business Unit","")),
       "vgp_legacy_source_lists":semi(r.get("Legacy Source Lists","")),
       "vgp_original_relationship_source":"Google Contacts",
       "vgp_data_review_status":{"Ready for pilot":"Approved","Manual review":"Manual review"}.get(r.get("Data Review Status","").strip(),"Approved"),
       "lifecyclestage":LIFE.get(r.get("Lifecycle Stage","").strip(),"lead")}
    if r.get("Company name","").strip(): p["company"]=r["Company name"].strip()
    if semi(r.get("Additional Phone Numbers","")): p["vgp_additional_phones"]=semi(r.get("Additional Phone Numbers",""))
    p["_addl_emails"]=semi(r.get("Additional email addresses",""))  # applied best-effort, separately
    return {k:v for k,v in p.items() if v not in ("",None)}

def upsert_one(props, sec=None):
    email=props["email"]; addl=props.pop("_addl_emails",None)
    cid=None; st=None
    if sec:  # known secondary-email merge: apply taxonomy to the existing person found by secondary email
        cid=find_by_email(sec)
        if cid:
            pp=dict(props); pp.pop("email",None)
            pr=h.patch(f"/crm/v3/objects/contacts/{cid}",{"properties":pp})
            st="merged" if pr.status_code<300 else "err"
            if pr.status_code>=300: print("  MERGE ERR",email,pr.status_code,str(h.j(pr))[:140])
    if cid is None:
        r=h.post("/crm/v3/objects/contacts",{"properties":props})
        if r.status_code<300: cid,st=h.j(r).get("id"),"created"
        elif r.status_code==409:
            m=re.search(r"Existing ID:\s*(\d+)", h.j(r).get("message",""))
            if m:
                cid=m.group(1); pp=dict(props); pp.pop("email",None)
                pr=h.patch(f"/crm/v3/objects/contacts/{cid}",{"properties":pp})
                st="updated" if pr.status_code<300 else "err"
                if pr.status_code>=300: print("  UPDATE ERR",email,pr.status_code,str(h.j(pr))[:140])
        if cid is None: print("  ERR",email,r.status_code,str(h.j(r))[:120]); return None,"err"
    if cid and addl:  # best-effort secondary emails (never blocks taxonomy)
        h.patch(f"/crm/v3/objects/contacts/{cid}",{"properties":{"hs_additional_emails":addl}})
    return cid, st

def upsert_contacts(data):
    idb={}; c=collections.Counter()
    for r in data:
        props=contact_props(r); cid,st=upsert_one(props, SECONDARY.get(props["email"]))
        c[st]+=1
        if cid: idb[props["email"]]=cid
    print("contacts:",dict(c))
    return idb

def find_company(name):
    r=h.post("/crm/v3/objects/companies/search",{"limit":1,"properties":["name"],
      "filterGroups":[{"filters":[{"propertyName":"name","operator":"EQ","value":name}]}]})
    res=h.j(r).get("results",[]); return res[0]["id"] if res else None

def companies(data):
    seen={}
    for r in data:
        org=r.get("Company name","").strip()
        if not org or org.lower() in seen: continue
        cid=find_company(org)
        if not cid:
            dom=r["Email"].split("@")[-1] if "@" in r["Email"] and "crm.wix.com" not in r["Email"] else ""
            props={"name":org,"vgp_company_review_status":"Approved"}
            if dom: props["domain"]=dom
            if semi(r.get("Business Unit","")): props["vgp_business_unit_rel"]=semi(r.get("Business Unit",""))
            cr=h.post("/crm/v3/objects/companies",{"properties":props}); cid=h.j(cr).get("id")
        seen[org.lower()]=cid
    print("companies resolved:",len([v for v in seen.values() if v]))
    return seen

def associate(data,cbid,coid):
    n=0
    for r in data:
        cid=cbid.get(r["Email"].strip().lower()); co=coid.get(r.get("Company name","").strip().lower())
        if cid and co and put(f"/crm/v4/objects/contacts/{cid}/associations/default/companies/{co}").status_code<300: n+=1
    print("associations:",n)

def tasks(data,cbid):
    prio=[r for r in data if r.get("Primary Relationship Type","").strip() in PRIORITY]; n=0
    for r in prio:
        cid=cbid.get(r["Email"].strip().lower())
        if not cid: continue
        body={"properties":{"hs_task_subject":f"Confirm relationship & next step — {r.get('First Name','')} {r.get('Last Name','')}".strip(),
              "hs_task_status":"NOT_STARTED","hs_task_priority":"HIGH","hubspot_owner_id":OWNER,"hs_timestamp":"2026-08-12T15:00:00Z",
              "hs_task_body":f"Imported {r.get('Primary Relationship Type')}. Review taxonomy and set next action."},
              "associations":[{"to":{"id":cid},"types":[{"associationCategory":"HUBSPOT_DEFINED","associationTypeId":204}]}]}
        if h.post("/crm/v3/objects/tasks",body).status_code<300: n+=1
    print("priority tasks:",n)

if __name__=="__main__":
    print("portal", h.j(h.get('/account-info/v3/details')).get('portalId'), "| PILOT" if PILOT else "| FULL")
    if QUAR: quarantine()
    data=rows("02_hubspot_contacts_PILOT_10.csv" if PILOT else "01_hubspot_contacts_ALL.csv")
    print("rows:",len(data))
    cbid=upsert_contacts(data)
    if not PILOT:
        coid=companies(data); associate(data,cbid,coid)
    tasks(data,cbid)
    print("DONE")
