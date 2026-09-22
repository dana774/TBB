from style import *

OUT = "/tmp/claude-0/-home-user-TBB/ab62350a-c683-5f9e-8199-204331d5ec27/scratchpad/out/"
import os; os.makedirs(OUT, exist_ok=True)

FRAMING = ("The Brand Blueprint is your founder-facing ecosystem, Value Growth Partners is the "
           "advisory and execution engine behind it, and Growth OS turns plans into operating "
           "infrastructure.")

EDU = ("Educational content only. Nothing here is a promise of a specific business, funding, or "
       "revenue outcome; results depend on your own execution, market, and circumstances. Verify "
       "any legal, tax, insurance, or financing question with a qualified advisor before acting.")

# ─────────────────────────────── SH-01 ───────────────────────────────
def sh01(s):
    header(s, "SH-01 · Start Here", "Member Orientation: How to Use the Hub",
           FRAMING + " This orientation shows you how the member library is organized and how to "
           "find the one resource that fits what you are working on right now.")

    h2(s, "What this membership is")
    para(s, "The Founder Network is a working library, not a course. Nothing here is sequenced for "
            "you to complete end to end. Each resource is built to be picked up at a specific "
            "moment in a specific decision, used, and put down again.")

    h2(s, "How the library is organized")
    para(s, "Resources are grouped into nine collections. Each collection has a README that states "
            "who it is for, where it fits in the founder journey, and a recommended path through "
            "its contents. Read the README first — it will usually save you opening three files "
            "you did not need.")
    grid(s, [
        ["Collection", "Use it when"],
        ["Start Here + Founder Operating Cadence", "You are new, or your week has lost its shape."],
        ["Funding + Capital Access", "Funding is your active priority."],
        ["Retail, Buyers + Distribution", "You are preparing for or managing retail accounts."],
        ["Product, Packaging + Operations", "You are building or fixing how the product gets made and moved."],
        ["Growth OS + Founder Systems", "The work depends on you personally and needs to stop doing so."],
        ["Marketing, Content + Customer Growth", "You need demand, positioning, or a clearer message."],
        ["Events, Market Signals + Opportunities", "You are looking for timely openings and market context."],
        ["Partner Network + Expert Routing", "You need a vetted operator, not another document."],
        ["Accelerator + Alumni Continuity", "You are in a cohort, or you have finished one."],
    ], [2.5, 4.3])

    h2(s, "How resource codes work")
    para(s, "Every resource carries a code — SH-02, CAP-09, RET-10, BRD-04. Codes are stable. "
            "Documents cross-reference each other by code, so when a worksheet tells you to bring "
            "your numbers from CAP-04, that is a precise pointer to one file, not a category. "
            "Codes do not change when a file is revised; the version suffix does.")

    h2(s, "Three ways in")
    bullets(s, [
        "<b>By pressure.</b> Something is urgent — cash, a buyer meeting, a launch date. Go "
        "straight to the collection that names it and use the README's recommended path.",
        "<b>By stage.</b> You want to know what you should be strengthening next. Each README "
        "carries a <i>Founder journey fit</i> line — read those to place yourself.",
        "<b>By rhythm.</b> Nothing is on fire and you want to build the habit that prevents the "
        "next fire. Start with SH-02, the Founder Operating Cadence.",
    ])

    h2(s, "What membership includes")
    bullets(s, [
        "Access to all nine collections and every resource in them, including revisions.",
        "New and updated resources as they are published, announced in the hub.",
        "Templates and worksheets you fill in privately — your copies are yours.",
        "Routing to vetted partners and experts through the Partner Network collection.",
    ])

    h2(s, "A note on how to actually use it")
    para(s, "The most common failure is downloading nine files in week one and opening none of "
            "them in week six. Take one resource, finish it, and let the next be pulled by an "
            "actual decision. SH-03 gives you a first-30-days path if you would rather be told "
            "where to start.")

    notices(s, EDU)

# ─────────────────────────────── SH-03 ───────────────────────────────
def sh03(s):
    header(s, "SH-03 · Start Here", "Member Quick-Start Checklist",
           FRAMING + " This is a first-30-days path through the hub. It is deliberately short. "
           "Work it in order and tick as you go.")

    h2(s, "Week 1 — Orient")
    grid(s, [
        ["✓", "Action", "Resource"],
        ["☐", "Read the orientation end to end.", "SH-01"],
        ["☐", "Skim all nine collection READMEs — headers only, not the files.", "Each collection"],
        ["☐", "Name the one pressure you most want relieved in 90 days. Write it down.", "SH-05"],
        ["☐", "Open the collection that matches that pressure. Read only its README.", "—"],
    ], [0.35, 4.15, 2.3])

    h2(s, "Week 2 — Set the rhythm")
    grid(s, [
        ["✓", "Action", "Resource"],
        ["☐", "Fill in the weekly tab of the operating cadence. Pick real days and real blocks.", "SH-02"],
        ["☐", "Put the weekly review block in your calendar as a recurring hold.", "SH-02"],
        ["☐", "Map your current operating system — what only you can do today.", "SH-04"],
        ["☐", "Choose one thing from that map to stop doing personally this quarter.", "SH-04"],
    ], [0.35, 4.15, 2.3])

    h2(s, "Week 3 — Work one resource properly")
    grid(s, [
        ["✓", "Action", "Resource"],
        ["☐", "From your priority collection, take the first item on its recommended path.", "Collection README"],
        ["☐", "Complete it. Not skim — complete it, including the parts you want to skip.", "—"],
        ["☐", "Write the single decision it changed. If it changed none, note that too.", "SH-05"],
    ], [0.35, 4.15, 2.3])

    h2(s, "Week 4 — Close the loop")
    grid(s, [
        ["✓", "Action", "Resource"],
        ["☐", "Run your first monthly review using the monthly tab.", "SH-02"],
        ["☐", "Set quarterly priorities — no more than three.", "SH-05"],
        ["☐", "Identify one gap the library does not close, and route it to a partner.", "Partner Network"],
        ["☐", "Book the next quarter's reset date now.", "SH-02"],
    ], [0.35, 4.15, 2.3])

    h2(s, "If you only do one thing")
    para(s, "Do Week 2. A founder with a working cadence and no other resource will outperform a "
            "founder with every resource and no cadence.")

    notices(s, EDU)

# ─────────────────────────────── SH-04 ───────────────────────────────
def sh04(s):
    header(s, "SH-04 · Start Here", "The Founder Operating System — One-Page Map",
           FRAMING + " This map names the five layers a founder-led company runs on, and what it "
           "looks like when each one is carried by the founder personally instead of by the "
           "business.")

    grid(s, [
        ["Layer", "What it covers", "Founder-dependent looks like", "Business-carried looks like"],
        ["Direction",
         "Where the company is going and what it will not do.",
         "Priorities change with whoever spoke to you last.",
         "Three written quarterly priorities the team can recite."],
        ["Demand",
         "How customers find you and decide to buy.",
         "Revenue tracks your personal selling hours.",
         "A repeatable path that runs when you are away."],
        ["Delivery",
         "How the product gets made, packed, and shipped.",
         "You are the escalation point for every exception.",
         "Documented steps and a named owner per step."],
        ["Money",
         "Cash, margin, runway, and the numbers behind them.",
         "You know the balance, not the forecast.",
         "A rolling forecast reviewed on a fixed date."],
        ["Rhythm",
         "The meetings and reviews that keep the other four honest.",
         "Reviews happen when something breaks.",
         "Weekly, monthly, and quarterly loops that hold."],
    ], [0.85, 1.75, 2.1, 2.1])

    h2(s, "How to use this map")
    bullets(s, [
        "Score each layer honestly today: founder-dependent, partly carried, or business-carried.",
        "Expect two or three to be founder-dependent. That is normal and not a failing.",
        "Choose <b>one</b> to move this quarter. Moving one layer properly beats nudging five.",
        "Re-score at each quarterly reset. The map is a trend line, not a verdict.",
    ])

    h2(s, "Where each layer is served in the library")
    grid(s, [
        ["Layer", "Collection"],
        ["Direction", "Start Here + Founder Operating Cadence · Growth OS + Founder Systems"],
        ["Demand", "Marketing, Content + Customer Growth · Retail, Buyers + Distribution"],
        ["Delivery", "Product, Packaging + Operations"],
        ["Money", "Funding + Capital Access"],
        ["Rhythm", "Start Here + Founder Operating Cadence"],
    ], [1.0, 5.8])

    para(s, "A layer that stays founder-dependent for four consecutive quarters is usually a "
            "hiring or partner question rather than a documentation question. The Partner Network "
            "collection exists for exactly that case.")

    notices(s, EDU)

# ─────────────────────────────── ACC-01 ───────────────────────────────
def acc01(s):
    header(s, "ACC-01 · Accelerator", "Accelerator Overview & Curriculum Map",
           FRAMING + " This overview describes how a Founder Network accelerator cohort is "
           "structured, what each module is meant to produce, and what is expected of "
           "participants.")

    h2(s, "How a cohort runs")
    bullets(s, [
        "Cohorts are working sessions, not lectures. Each session produces an artifact you keep.",
        "Pre-work is required. Sessions assume it is done and start from your actual numbers.",
        "Peer review is built in — founders read each other's work and respond.",
        "Progress is assessed against the published rubric (ACC-03), shared at the start.",
    ])

    h2(s, "Curriculum map")
    grid(s, [
        ["Module", "Focus", "Produces", "Library support"],
        ["01 · Position", "Who you serve, what you refuse, why you win.",
         "A written positioning statement and a not-for list.", "Marketing, Content + Customer Growth"],
        ["02 · Demand", "The path from stranger to customer.",
         "One documented acquisition path with named steps.", "Marketing, Content + Customer Growth"],
        ["03 · Channel", "Retail, wholesale, direct, or a mix.",
         "A channel decision with the economics written down.", "Retail, Buyers + Distribution"],
        ["04 · Operations", "How the product is made and moved.",
         "A process map with owners and exception handling.", "Product, Packaging + Operations"],
        ["05 · Money", "Margin, cash cycle, and funding fit.",
         "A rolling forecast and a capital-path decision.", "Funding + Capital Access"],
        ["06 · Systems", "What stops depending on the founder.",
         "One layer moved off the founder, documented.", "Growth OS + Founder Systems"],
        ["07 · Readiness", "Assessment against the rubric.",
         "A scored rubric and a named next commitment.", "Accelerator + Alumni Continuity"],
    ], [0.95, 1.7, 2.2, 1.95])

    h2(s, "What is expected of participants")
    bullets(s, [
        "Attend the working sessions; send someone with authority if you genuinely cannot.",
        "Complete pre-work before the session, not during it.",
        "Bring real figures. Sessions built on placeholder numbers produce placeholder decisions.",
        "Respect the confidentiality of what other founders share in the room.",
    ])

    h2(s, "What this is not")
    para(s, "Participation does not guarantee funding, buyer placement, partnership, or any "
            "commercial result. The accelerator is a structured working environment; what it "
            "produces depends on the work you put through it.")

    notices(s, EDU + " Cohort structure, module order, and session dates may change; the schedule "
                     "issued to your cohort supersedes this overview.")

# ─────────────────────────────── ACC-04 ───────────────────────────────
def acc04(s):
    header(s, "ACC-04 · Accelerator", "Alumni Continuity Guide",
           FRAMING + " This guide covers what continues after a cohort ends, what changes, and "
           "how to keep the operating gains from decaying once the weekly structure is gone.")

    h2(s, "What ends and what continues")
    grid(s, [
        ["", "During the cohort", "After graduation"],
        ["Cadence", "Set by the session schedule.", "Yours to hold — SH-02 replaces the schedule."],
        ["Accountability", "Peer group and facilitator.", "Alumni peer pairing, if you arrange it."],
        ["Library access", "Full member access.", "Full member access, unchanged."],
        ["Partner routing", "Available.", "Available."],
        ["Assessment", "Rubric scored at module 07.", "Self-scored at each quarterly reset."],
    ], [1.1, 2.6, 3.1])

    h2(s, "The decay problem")
    para(s, "The most common post-cohort pattern is a strong first month, a quiet second, and a "
            "return to pre-cohort operating by the fourth. The cause is almost never motivation. "
            "It is that the cohort supplied the rhythm, and when it ended nothing replaced it.")
    bullets(s, [
        "Within one week of graduating, put your weekly and monthly blocks in the calendar as "
        "recurring holds. Do it before the last session's energy fades.",
        "Pair with one alumni founder for a monthly thirty-minute check. Short and regular beats "
        "long and occasional.",
        "Re-score the rubric (ACC-03) at each quarterly reset. It is the same instrument used at "
        "graduation, so the comparison is honest.",
        "Pick the next single layer to move from SH-04. One per quarter.",
    ])

    h2(s, "Staying useful to the network")
    bullets(s, [
        "Keep your directory entry current (ACC-05) so routing to you actually works.",
        "Take the peer-review seat for a later cohort if invited — reviewing others' work is the "
        "cheapest way to see your own blind spots.",
        "Flag gaps you hit that the library does not close. That is how the library improves.",
    ])

    h2(s, "A realistic expectation")
    para(s, "Graduating means you have been through a structured process and produced a set of "
            "artifacts. It is not a credential, a certification, or a signal to third parties "
            "about your company's prospects. What it is worth is what you keep doing with it.")

    notices(s, EDU + " Alumni participation, pairing, and directory inclusion are voluntary and "
                     "may be limited or changed at any time. Inclusion in the alumni directory is "
                     "not an endorsement, recommendation, or vetting of any founder or company.")


build(OUT + "BB_StartHere_Member-Orientation_v1.pdf", "Member Orientation: How to Use the Hub", sh01)
build(OUT + "BB_StartHere_Member-Quick-Start-Checklist_v1.pdf", "Member Quick-Start Checklist", sh03)
build(OUT + "BB_StartHere_Founder-Operating-System-Map_v1.pdf", "The Founder Operating System — One-Page Map", sh04)
build(OUT + "BB_Accelerator_Accelerator-Overview-Curriculum-Map_v1.pdf", "Accelerator Overview & Curriculum Map", acc01)
build(OUT + "BB_Accelerator_Alumni-Continuity-Guide_v1.pdf", "Alumni Continuity Guide", acc04)
