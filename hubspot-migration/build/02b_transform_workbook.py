import openpyxl, csv, os
SRC="/root/.claude/uploads/0a0426d0-8d3b-5ae7-ac85-050256bc4261/579898ce-VGP_HubSpot_Migration_Control_Workbook_v1.xlsx"
OUT="/tmp/claude-0/-home-user-TBB/0a0426d0-8d3b-5ae7-ac85-050256bc4261/scratchpad/hubspot-package"
wb=openpyxl.load_workbook(SRC,data_only=True)

def pipe_to_semi(v):
    if v is None: return ""
    return ";".join(p.strip() for p in str(v).split("|") if p.strip())

def load(sheet):
    ws=wb[sheet]; rows=list(ws.iter_rows(values_only=True))
    hdr=rows[0]; idx={h:i for i,h in enumerate(hdr)}
    out=[]
    for r in rows[1:]:
        if not any(c is not None and str(c).strip()!="" for c in r): continue
        out.append(r)
    return idx,out

# HubSpot contact import columns (map to property internal names in the runbook)
CONTACT_COLS=["Email","First Name","Last Name","Company name","Job Title","Phone Number",
 "Additional email addresses","Additional Phone Numbers","Primary Relationship Type",
 "Additional Relationship Types","Business Unit","Legacy Source Lists","Original Relationship Source",
 "Data Review Status","Lifecycle Stage","Import Notes"]

def contact_row(idx,r):
    g=lambda n: r[idx[n]] if n in idx and r[idx[n]] is not None else ""
    return {
     "Email":g("Primary Email"),
     "First Name":g("First Name"),
     "Last Name":g("Last Name"),
     "Company name":g("Organization"),
     "Job Title":g("Job Title"),
     "Phone Number":g("Primary Phone"),
     "Additional email addresses":pipe_to_semi(g("Additional Emails")),
     "Additional Phone Numbers":pipe_to_semi(g("Additional Phones")),
     "Primary Relationship Type":g("Primary Relationship Type"),
     "Additional Relationship Types":pipe_to_semi(g("Additional Relationship Types")),
     "Business Unit":pipe_to_semi(g("Business Unit")),
     "Legacy Source Lists":pipe_to_semi(g("Source Lists")),
     "Original Relationship Source":"Google Contacts",
     "Data Review Status":g("Data Review Status"),
     "Lifecycle Stage":g("Lifecycle Stage Recommendation"),
     "Import Notes":g("Issues"),
    }

def write_contacts(sheet,fname):
    idx,rows=load(sheet)
    path=os.path.join(OUT,fname)
    with open(path,"w",newline="") as f:
        w=csv.DictWriter(f,fieldnames=CONTACT_COLS); w.writeheader()
        for r in rows: w.writerow(contact_row(idx,r))
    return path,len(rows)

# Contacts (full, pilot)
p1,n1=write_contacts("Master Contacts","01_hubspot_contacts_ALL.csv")
p2,n2=write_contacts("Pilot Candidates","02_hubspot_contacts_PILOT_10.csv")

# Exceptions review (keep richer detail)
idx,rows=load("Exceptions")
EXC=["Email","Full Name","Organization","Primary Relationship Type","Data Review Status",
     "Issues","Additional Emails","Additional Phones","Source Rows"]
path=os.path.join(OUT,"03_exceptions_review.csv")
with open(path,"w",newline="") as f:
    w=csv.DictWriter(f,fieldnames=EXC); w.writeheader()
    for r in rows:
        g=lambda n: r[idx[n]] if r[idx[n]] is not None else ""
        w.writerow({"Email":g("Primary Email"),"Full Name":g("Full Name"),
          "Organization":g("Organization"),"Primary Relationship Type":g("Primary Relationship Type"),
          "Data Review Status":g("Data Review Status"),"Issues":g("Issues"),
          "Additional Emails":g("Additional Emails"),"Additional Phones":g("Additional Phones"),
          "Source Rows":g("Source Rows")})

# Companies derived from Organization field (dedup)
idx,rows=load("Master Contacts")
comp={}
for r in rows:
    g=lambda n: r[idx[n]] if r[idx[n]] is not None else ""
    org=str(g("Organization")).strip()
    if not org: continue
    email=str(g("Primary Email"))
    domain=email.split("@")[-1] if "@" in email and "crm.wix.com" not in email else ""
    key=org.lower()
    if key not in comp:
        comp[key]={"Company name":org,"Company Domain Name":domain,
                   "Business Unit Relationship":g("Business Unit"),
                   "Associated Contact (primary email)":email,"Contact Count":1}
    else:
        comp[key]["Contact Count"]+=1
CCOLS=["Company name","Company Domain Name","Business Unit Relationship","Associated Contact (primary email)","Contact Count"]
path=os.path.join(OUT,"04_hubspot_companies_import.csv")
with open(path,"w",newline="") as f:
    w=csv.DictWriter(f,fieldnames=CCOLS); w.writeheader()
    for v in sorted(comp.values(),key=lambda x:x["Company name"].lower()):
        w.writerow(v)

print("contacts ALL:",n1,"->",p1)
print("contacts PILOT:",n2,"->",p2)
print("exceptions rows:",len(load('Exceptions')[1]))
print("companies:",len(comp))
print("Files:")
for fn in sorted(os.listdir(OUT)):
    print("  ",fn, os.path.getsize(os.path.join(OUT,fn)),"bytes")
