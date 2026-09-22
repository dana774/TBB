"""Create the VGP segment lists that back the dashboards.
Requires the token to have crm.lists.read + crm.lists.write scopes (add them to the
Private App, no re-paste needed). Idempotent-ish: skips a list whose name already exists.
Usage:  HUBSPOT_TOKEN=pat-... python3 03_create_lists.py [--dry-run]
"""
import sys, hs_api as h
DRY="--dry-run" in sys.argv
C="0-1"  # contacts

def enum(prop, values):
    return {"filterType":"PROPERTY","property":prop,
            "operation":{"operationType":"ENUMERATION","operator":"IS_ANY_OF","values":values}}

def branch(*filters):
    return {"filterBranchType":"AND","filterBranches":[],"filters":list(filters)}

def OR(*branches):
    return {"filterBranchType":"OR","filters":[],"filterBranches":list(branches)}

REL="vgp_primary_relationship_type"; ADD="vgp_additional_relationship_types"; DRS="vgp_data_review_status"
PROG="vgp_program_affiliation"
PROGS=["RED Academy","CIC","Build in Tulsa","SEED SPOT","W.E. Build","Black Ambition","JumpStart","Other"]

LISTS=[
 ("VGP · Active Clients", OR(branch(enum(REL,["Active Client"])))),
 ("VGP · Consulting Prospects (open)", OR(branch(enum(REL,["Consulting Prospect"])))),
 ("VGP · Founder Prospect Pipeline", OR(branch(enum(REL,["Founder"])), branch(enum(ADD,["Founder"])))),
 ("VGP · Institutional & Referral Partners", OR(branch(enum(REL,["Institutional Partner","Referral Partner","Specialist or Service Partner"])))),
 ("VGP · Investor & Capital Relationships", OR(branch(enum(REL,["Investor or Capital Provider"])), branch(enum(ADD,["Investor or Capital Provider"])))),
 ("VGP · Podcast & Media Contacts", OR(branch(enum(REL,["Podcast or Media Contact"])), branch(enum(ADD,["Podcast or Media Contact"])))),
 ("VGP · Program Participants", OR(branch(enum(PROG,PROGS)))),
 ("VGP · Managed Relationships (curated)", OR(branch(enum(DRS,["Approved"])))),
 ("VGP · Needs Manual Review", OR(branch(enum(DRS,["Manual review"])))),
 ("VGP · Needs Classification (Google import)", OR(branch(enum(DRS,["Unreviewed"])))),
]

def existing_names():
    r=h.post("/crm/v3/lists/search",{"query":"VGP ·","count":100})
    return {l["name"] for l in h.j(r).get("lists",[])} if h.ok(r) else set()

if __name__=="__main__":
    have=existing_names()
    for name, fb in LISTS:
        if name in have: print("exists:",name); continue
        if DRY: print("[dry] create:",name); continue
        r=h.post("/crm/v3/lists",{"name":name,"objectTypeId":C,"processingType":"DYNAMIC","filterBranch":fb})
        print(("OK   " if h.ok(r) else f"ERR {r.status_code} ")+name+("" if h.ok(r) else f" {str(h.j(r))[:160]}"))
    print("Lists step complete.")
