const {
  Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber,
  TabStopType, BorderStyle,
} = require('docx');
const fs = require('fs');
const T = require('./theme');
const { C, F, PAGE, CONTENT } = T;

const DOCNAME = 'Ascend Family Vault — Opportunity Strategy Book';

const runHeader = () => new Header({
  children: [new Paragraph({
    spacing: { after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT }],
    children: [
      new TextRun({ text: DOCNAME.toUpperCase(), font: F.sans, size: 13, bold: true, color: C.bodyLight, characterSpacing: 18 }),
      new TextRun({ text: '\tCONFIDENTIAL · INTERNAL', font: F.sans, size: 13, bold: true, color: C.gold, characterSpacing: 18 }),
    ],
  })],
});

const runFooter = () => new Footer({
  children: [new Paragraph({
    spacing: { before: 60, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT }],
    children: [
      new TextRun({ text: 'Value Growth Partners · Internal opportunity assessment · Not for distribution', font: F.sans, size: 13, color: C.bodyLight }),
      new TextRun({ text: '\t', font: F.sans, size: 13 }),
      new TextRun({ children: [PageNumber.CURRENT], font: F.sans, size: 13, bold: true, color: C.navy }),
      new TextRun({ text: ' / ', font: F.sans, size: 13, color: C.bodyLight }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], font: F.sans, size: 13, color: C.bodyLight }),
    ],
  })],
});

const SECTIONS = [
  ['Internal view',            'Executive Call Objective'],
  ['Opportunity read',         'Strategic Read on Ascend'],
  ['New founder evidence',     'Eric’s August 27 Responses'],
  ['Architecture',             'One Engine, Two Proving Grounds'],
  ['Product definition',       'Recommended MVP Boundary'],
  ['Risk architecture',        'Regulatory, Financial and Data Decisions'],
  ['Commercial model',         'Revenue and Partner Strategy'],
  ['Commercial proving ground','Reunion and Homecoming Opportunity'],
  ['Field validation',         'Morehouse Homecoming Research Strategy'],
  ['Execution plan',           '90-Day Validation and Launch Readiness'],
  ['Engagement architecture',  'Proposed Value Growth Partners Scope'],
  ['Dana notes',               'Talk Track and Risk Signals'],
  ['After meeting',            'Decision Capture and Next Steps'],
];

const contentsRow = (i, [kicker, title]) => new Paragraph({
  spacing: { after: 150, line: 260 },
  indent: { left: 620, hanging: 620 },
  tabStops: [{ type: TabStopType.LEFT, position: 620 }],
  children: [
    new TextRun({ text: String(i + 1).padStart(2, '0'), font: F.sans, size: 16, bold: true, color: C.blue }),
    new TextRun({ text: '\t' + title, font: F.serif, size: 22, color: C.navy }),
    new TextRun({ text: '   ' + kicker.toUpperCase(), font: F.sans, size: 12, bold: true, color: C.bodyLight, characterSpacing: 18 }),
  ],
});

const SEC = (i, lead) => [
  T.eyebrow(`${String(i).padStart(2, '0')} · ${SECTIONS[i - 1][0]}`, { pageBreakBefore: true }),
  T.h1(SECTIONS[i - 1][1]),
  ...(lead ? [T.lead(lead)] : []),
];

const children = [
  T.coverBand({
    kicker: 'Confidential · internal strategy prep',
    title: ['Ascend Family Vault', 'Opportunity Strategy Book'],
    subtitle: 'Internal opportunity assessment, working hypotheses, decision architecture and a 90-day validation plan — prepared to run the August 27 working session and to hold the line on scope afterward.',
    meta: [
      { label: 'Document type', value: 'Internal opportunity strategy and call-prep book' },
      { label: 'Audience', value: 'Dana Ammons / Value Growth Partners only' },
      { label: 'Working session', value: 'Thursday, August 27, 2026 · 1:30–3:30 PM ET' },
      { label: 'Version', value: 'Updated August 27, 2026' },
    ],
  }),
  T.spacer(260),
  T.statStrip([
    { value: '2', label: 'Commercial proving grounds' },
    { value: '90', label: 'Days to a build decision' },
    { value: 'Oct 10', label: 'Morehouse field test' },
  ]),
  T.spacer(300),
  T.callout('How to use this book',
    'Sections 01–03 set up the meeting. Sections 04–09 are the analysis Dana draws from when the conversation opens up. Sections 10–13 are what has to be true when it closes. Nothing here should be presented to Eric as a finished conclusion.',
    { fill: C.softGray, borderColor: C.border, labelColor: C.deepBlue }),

  T.eyebrow('Contents', { pageBreakBefore: true }),
  T.h1('What Is in This Book'),
  T.spacer(200),
  ...SECTIONS.map((s, i) => contentsRow(i, s)),
  T.spacer(240),
  T.callout('Standing caution',
    'This is an opportunity assessment and planning tool. It is not legal, tax, securities, title, software engineering or investment advice. Every assumption below needs validation with Eric, his teammate, prospective users and qualified professionals.',
    { fill: C.paleBlue, labelColor: C.gold }),

  /* 01 ------------------------------------------------------------ */
  ...SEC(1, 'Move Eric, his project teammate and Dana from a broad opportunity into a disciplined discovery and validation structure. The meeting should clarify the problem Ascend must solve first, distinguish product hypotheses from verified needs, and establish the legal, financial and data boundaries that protect the concept as it develops.'),
  T.callout('What this call must accomplish',
    'Confirm one lead customer, one lead problem, one 90-day proving ground, one MVP boundary and a working division of responsibility. The goal is not to approve a finished platform architecture during the first session.'),

  T.h2('Key call priorities'),
  T.dataTable(
    ['Focus area', 'What to establish', 'Why it matters'],
    [
      ['Founder intent', 'What Eric ultimately wants Ascend to become, and what outcome matters most in three years.', 'Prevents short-term features from defining the company by accident.'],
      ['Origin case', 'The Oklahoma land facts, family workflow, current ownership documentation and immediate improvement objective.', 'Separates the authentic problem from assumptions about the broader market.'],
      ['Lead market wedge', 'Whether the first proving ground is reunion and Homecoming coordination, family project coordination, or a narrower combination.', 'Concentrates validation and near-term revenue.'],
      ['MVP boundary', 'The smallest workflow that reduces organizer burden and increases participant trust.', 'Prevents an expensive mix of project management, payments, legal and marketplace features.'],
      ['Risk architecture', 'What the product records, what it never determines, and which activities require qualified partners.', 'Protects trust and avoids preventable legal or regulatory exposure.'],
      ['Team model', 'Eric, Isaiah Harrison and Dana roles, capacity, decision rights and the next 90-day cadence.', 'Turns the concept into accountable work.'],
    ],
    [1, 2.3, 2],
  ),

  T.h2('Internal success test'),
  ...T.bullets([
    'Eric confirms the problem and founder vision in his own language.',
    'The group approves one lead wedge and explicitly parks the others.',
    'The team defines what the existing site actually does today versus what remains conceptual.',
    'The group agrees on ownership, payment and data guardrails before new build work begins.',
    'Every open issue leaves the meeting with an owner, an evidence request and a decision date.',
  ]),

  /* 02 ------------------------------------------------------------ */
  ...SEC(2, 'Ascend has the potential to become a shared project operating system for families and affinity groups. The strongest opportunity is not a generic family finance application. It is a trust-centered coordination layer that makes distributed projects easier to understand, fund, approve and complete.'),
  T.callout('Recommended internal frame',
    'One operating engine, two proving grounds. Use Eric’s reunion and Homecoming expertise as the faster commercial validation lane, while the Oklahoma family land project informs the more complex long-term product requirements.'),

  T.h2('What Eric confirms the current prototype can do'),
  ...T.bullets([
    'The site was vibe coded and can create projects and populate portions of a project record.',
    'Eric can configure some project criteria, and has created a four-person family project for paying his parents’ insurance bill.',
    'The application can send or route emails to Eric.',
    'Stripe is requested but not connected; payment collection and settlement have not been validated.',
    'Vaults, document handling and estate-related functions are not set up and are not operational.',
    'The product is therefore an early functional prototype — not yet a secure or transaction-ready MVP.',
  ]),

  T.h2('Proof, hypothesis and unknown'),
  T.dataTable(
    ['Type', 'Current position', 'Required validation'],
    [
      ['Founder proof', 'Eric has repeated operational success coordinating Class of 1995 Homecoming hospitality, vendors, licensing and swag.', 'Document the process, economics, hours, failure points and repeat demand.'],
      ['Demand signal', 'The Class of 1997 accepted Eric’s initial $75 per-person graduation-box concept, built around an estimated $50 product cost and a minimum quantity.', 'Confirm order count, deposit, final contents, freight, duties, design, QA, fulfillment, payment fees and decision authority.'],
      ['Problem proof', 'A 25- to 30-person family ownership group creates real communication, labor, consent and contribution complexity.', 'Create a plain-language project case, then interview family stakeholders before requesting money or designing around assumed agreement.'],
      ['Market hypothesis', 'Other families and affinity groups will pay for transparent shared project coordination.', 'Test pain frequency, existing tools, buyer identity and willingness to pay.'],
      ['Platform hypothesis', 'One core engine can support family property projects and reunion programs.', 'Identify the common workflow and the use-case-specific modules.'],
    ],
    [0.9, 2.3, 2.3],
  ),

  /* 03 ------------------------------------------------------------ */
  ...SEC(3, 'The new information replaces several assumptions with concrete operating facts, and exposes the decisions that should control the working session.'),
  T.dataTable(
    ['Eric’s answer', 'Strategic meaning', 'Decision or follow-up today'],
    [
      ['Prototype creates and partly configures projects; one live example is a four-person insurance-bill project.', 'There is enough functionality for a guided walkthrough and usability test, but not enough for unsupervised use.', 'List every working screen, broken step, data field and manual workaround. Decide whether to stabilize or rebuild.'],
      ['Stripe is not connected. Vault, document and estate functions do not work.', 'Payments, custody, sensitive documents and ownership workflows remain conceptual and high risk.', 'Keep them outside the first pilot until architecture, partner and compliance decisions are made.'],
      ['The Oklahoma family project can be created, but the family has not agreed, and Eric expects resistance to contributing.', 'Consent and trust are the first design problem. The land case is not yet a committed pilot.', 'Draft a one-page family project charter and hold listening conversations before any fundraising request.'],
      ['Homecoming sourcing begins about 3.5 months ahead, uses Eric’s or prior-year funds, and requires overnight China-vendor negotiation plus design work.', 'The real pain includes working capital, vendor management, QA, design, minimum quantities and founder dependency.', 'Map cash timing, hours, vendor steps, failure points and a deposit policy before scaling.'],
      ['Class of 1997 accepted a $75 per-person box concept based on approximately $50 of product cost.', 'A credible paid-pilot lead, and a preliminary 33% gross-margin-on-revenue hypothesis before omitted costs.', 'Validate quantity, contents, landed cost, labor, licensing, fulfillment, refunds — and who signs off.'],
      ['Isaiah Harrison is a business and software consultant with at least one hour per week; Serena Boykin will observe.', 'Isaiah can advise and document, but one hour weekly is not development capacity. Serena’s role and confidentiality status are undefined.', 'Confirm decision rights, IP ownership, technical ownership, weekly cadence and Serena’s intended role.'],
    ],
    [1.6, 1.75, 1.75],
  ),
  T.spacer(250),
  T.callout('Revised internal recommendation',
    'Use today to select a service-led Class of 1997 pilot and a prototype stabilization audit. Treat the Oklahoma project as a consent and requirements case until family participation is independently validated.'),

  /* 04 ------------------------------------------------------------ */
  ...SEC(4, 'The concept should be organized around a common operating layer rather than two unrelated products. Each proving ground tests different parts of the same engine.'),
  T.dataTable(
    ['Layer', 'Shared engine capability', 'Family project expression', 'Reunion and Homecoming expression'],
    [
      ['People and roles', 'Organizer, approver, contributor, viewer and vendor permissions.', 'Family branches, project committee and participating relatives.', 'Class committee, attendees, suppliers and volunteers.'],
      ['Goal and budget', 'One objective, funding target, milestones and variance visibility.', 'Pavilion, land maintenance or education fund.', 'Tent, hospitality, food, beverage, swag and contingency.'],
      ['Contribution visibility', 'Commitments, payment status, reminders and exceptions.', 'Family contribution plan based on agreed allocation.', 'Deposits, participation tiers and package cutoffs.'],
      ['Work and approvals', 'Tasks, owners, quotes, decisions and evidence.', 'Site work, contractors, permits and family approvals.', 'Licensing, designs, quantities, vendors and event logistics.'],
      ['Reporting', 'Dashboard, updates, budget actuals and closeout.', 'Family progress and project-use reporting.', 'Attendee updates, fulfillment and final reconciliation.'],
      ['Partner access', 'Permissioned request for relevant services.', 'Title, legal, contractor, banking or insurance resources.', 'Licensed vendors, travel, venues, merchandise and sponsors.'],
    ],
    [0.95, 1.55, 1.5, 1.5],
  ),

  T.h2('Initial use-case priority test'),
  T.dataTable(
    ['Candidate', 'Pain', 'Founder advantage', 'Revenue speed', 'Complexity', 'Internal read'],
    [
      ['Reunion and Homecoming concierge', 'High for volunteer organizers', 'Very high', 'Near term', 'Moderate', { text: 'Lead commercial proving ground', color: C.navy }],
      ['Family property improvement', 'High but episodic', 'High authenticity', 'Slower', 'High', { text: 'Design partner and requirements case', color: C.navy }],
      ['General trips and shared goals', 'Variable', 'Limited differentiation', 'Unclear', 'Moderate', 'Do not lead'],
      ['College or family fund', 'Meaningful', 'Unproven', 'Slower', 'High financial sensitivity', 'Later validation lane'],
      ['Business or startup funding', 'Potentially high', 'Unproven', 'Longer term', 'Very high regulatory complexity', 'Exclude from initial MVP'],
    ],
    [1.45, 1.0, 1.05, 0.85, 1.15, 1.5],
  ),

  /* 05 ------------------------------------------------------------ */
  ...SEC(5, 'The MVP should prove that Ascend can reduce organizer burden and increase participant confidence. It does not need to become a bank, title company, legal platform, travel agency or investment marketplace.'),
  T.callout('MVP job to be done',
    'Help an organizer turn one shared objective into a transparent plan that participants can understand, support, monitor and complete — without repeated private messages, disconnected spreadsheets or unclear financial updates.'),

  T.h2('Must have in the first testable workflow'),
  T.dataTable(
    ['Capability', 'Minimum expression', 'Evidence it should produce'],
    [
      ['Project setup', 'Goal, description, target amount, dates, milestones and organizer.', 'Time to configure, and participant comprehension.'],
      ['Member roles', 'Organizer, approver, contributor, viewer and vendor visibility.', 'Clear permissions and fewer role disputes.'],
      ['Commitment ledger', 'Promised amount, due date, status and reminder history.', 'Reduced manual follow-up and a visible funding gap.'],
      ['Budget and expense log', 'Approved budget, actual expense, receipt or note, and remaining amount.', 'Higher trust and simpler reconciliation.'],
      ['Task and decision log', 'Owner, due date, status, vote or approval, and supporting file.', 'Fewer lost decisions and unclear assignments.'],
      ['Progress dashboard', 'Milestones, contribution progress, tasks, variance and updates.', 'Participants can self-serve common questions.'],
      ['Closeout', 'Final budget, completed work, unresolved items and archive.', 'Repeatable project learning and accountability.'],
    ],
    [1, 2.2, 2],
  ),

  T.h2('Explicitly later, or out of scope'),
  ...T.bullets([
    'Automated legal ownership determination from deeds, wills or probate records.',
    'Ascend custody of pooled money, stored value, wallet balances or direct lending.',
    'Investment return projections, securities matching or founder fundraising marketplace features.',
    'A broad vendor marketplace before a repeatable demand pattern exists.',
    'Inventory ownership, travel agency operations or unlicensed use of institutional marks.',
    'AI recommendations based on sensitive family data without defined consent and governance.',
  ]),

  /* 06 ------------------------------------------------------------ */
  ...SEC(6, 'These are product design decisions, not reasons to stop. The safest path is to define the boundary early, validate it with qualified counsel, and use regulated partners where appropriate.'),
  T.dataTable(
    ['Decision area', 'Question to resolve', 'Recommended working boundary', 'Required expert or evidence'],
    [
      ['Ownership records', 'Is Ascend displaying family-reported allocations, or asserting legal title?', 'Display user-supplied project allocations with clear status and source. Never label them verified legal ownership without professional review.', 'Oklahoma title or probate counsel; sample redacted documents; family workflow.'],
      ['Payment movement', 'Will Ascend collect, store, pool, split or transmit money?', 'Use a qualified payment provider. Avoid platform custody and stored value in the MVP.', 'Payments counsel; processor capability review; state exposure assessment.'],
      ['Lending and credit', 'Will banks or funders offer loans or credit through Ascend?', 'Start with opt-in introductions. Do not recommend, underwrite or promise approval.', 'Bank or credit union partner; fair lending and disclosure review.'],
      ['Investment', 'Will projects be presented as investments, or offer returns?', 'Exclude investment solicitation and return language from the MVP.', 'Securities counsel before any capital marketplace design.'],
      ['Data governance', 'Which documents and behavior data are truly necessary?', 'Minimize collection, separate sensitive records, define access, consent, retention, deletion and breach response.', 'Privacy counsel; data map; role-based access model.'],
      ['Identity and security', 'How are relatives, organizers and vendors authenticated?', 'Tiered verification based on risk; strong admin controls and activity logs.', 'Security architecture and threat model.'],
      ['Partner marketplace', 'Can vendors or sponsors see user or project data?', 'No data resale. Members actively request introductions or offers, and control what is shared.', 'Consent language; partner terms; referral tracking design.'],
      ['School marks and licensing', 'Who may produce Morehouse, Spelman or other HBCU-branded goods?', 'Use approved licensing pathways and qualified vendors before any branded sale.', 'Institutional licensing office and supplier documentation.'],
    ],
    [1, 1.5, 2, 1.6],
  ),
  T.spacer(250),
  T.callout('Language guardrail',
    [{ t: 'Ascend records family-approved information and project activity. It does not determine legal ownership, provide legal advice, hold client funds or promise financial outcomes.', i: true }]),

  /* 07 ------------------------------------------------------------ */
  ...SEC(7, 'Early revenue should come from solving the organizer’s problem directly. Sponsorship, referrals and embedded finance should follow only after Ascend has earned trust and proved repeatable use.'),
  T.dataTable(
    ['Stage', 'Revenue mechanism', 'What must be true first'],
    [
      ['Concierge pilot', 'Fixed planning fee, sourcing fee, package margin or project management fee.', 'Eric can scope and deliver a repeatable reunion or group project offer.'],
      ['Software-supported service', 'Per-project organizer fee, monthly organizer subscription or tiered service package.', 'The dashboard measurably reduces reminders, reconciliation and organizer hours.'],
      ['Partner referrals', 'Opt-in lead fee, vendor subscription or clearly labeled sponsored resource.', 'Offers are relevant, permissioned, and not based on personal data resale.'],
      ['Institutional distribution', 'Alumni association, nonprofit, family office, bank or credit union program license.', 'Ascend demonstrates repeatable onboarding and safe administration across groups.'],
      ['Embedded finance', 'Revenue share through regulated payment, savings, insurance or lending partners.', 'Counsel-approved design, compliant architecture, partner controls and strong governance.'],
    ],
    [1.15, 2.1, 2.1],
  ),

  T.h2('Pricing hypotheses to test'),
  ...T.bullets([
    'Organizer-paid setup or concierge fee for a defined reunion package.',
    'Committee- or class-paid service fee built into the event budget.',
    'Participant convenience or service fee — only when transparent and value-adding.',
    'Supplier margin or referral fee for sourced products and services.',
    'Institutional sponsorship, only when clearly labeled and separated from family data.',
  ]),
  T.spacer(230),
  T.callout('Trust rule',
    'Family and participant data should never be described as an asset to sell downstream. The defensible model is a permissioned marketplace in which members choose whether to request a quote, resource or financing conversation.'),

  /* 08 ------------------------------------------------------------ */
  ...SEC(8, 'Eric’s operating history is a founder advantage that software alone cannot replicate. The first offer should package that expertise, then use lightweight software to make the process transferable and scalable.'),
  T.dataTable(
    ['Service module', 'What Eric already proves', 'What Ascend should standardize'],
    [
      ['Planning and committee alignment', 'Annual coordination across classmates and multiple contributors.', 'Intake, budget, approvals, roles, deadlines and a decision log.'],
      ['Hospitality sourcing', 'Tent, food, beverage, bartender and event support.', 'Vendor requirements, quotes, contracts, contingency and service levels.'],
      ['Licensed swag', 'Customized Class of 1995 items; sourcing starts about 3.5 months out and includes overseas vendor negotiation and design work.', 'Licensing check, design approvals, landed-cost model, quantity cutoff, QA, personalization and a supplier scorecard.'],
      ['Participant collection', 'Eric often uses his own funds or prior-year balances to start sourcing.', 'Deposits, minimum-order thresholds, payment status, cash timing and no-personal-funding rules.'],
      ['Fulfillment', 'High-quality bags and event-day distribution.', 'Ship-versus-pickup rules, inventory-light sourcing, packing and issue resolution.'],
      ['Post-event closeout', 'Repeated annual delivery and community credibility.', 'Reconciliation, vendor scorecard, participant feedback and repeat booking.'],
    ],
    [1.15, 2.05, 2.05],
  ),

  T.h2('Recommended pilot offer architecture'),
  T.dataTable(
    ['Package', 'Illustrative contents', 'Validation question'],
    [
      ['Sourcing only', 'Approved vendor list, merchandise sourcing, licensing pathway and quote coordination.', 'Will another class pay Eric to reduce sourcing effort and risk?'],
      ['Hospitality coordination', 'Tent, catering, beverage, staffing, budget and committee approvals.', 'Can the operating playbook transfer beyond Class of 1995?'],
      ['Full experience', 'Hospitality plus licensed swag, participant collection, updates and fulfillment.', 'Can Ascend deliver premium quality at a repeatable margin?'],
    ],
    [1.1, 2.2, 1.95],
  ),
  T.spacer(250),
  T.callout('Immediate demand test',
    'Treat the Class of 1997 graduation-box request as the first paid-pilot candidate. Eric has floated $75 per person against about $50 of product cost. Validate minimum quantity and full landed, labor, licensing, payment and fulfillment costs before approving price or margin.'),

  /* 09 ------------------------------------------------------------ */
  ...SEC(9, 'Homecoming on October 10 should be treated as a structured field test — not a public launch or a fundraising event. The team should collect evidence without oversharing sensitive product assumptions.'),
  T.h2('QR pathway A — organizer and participant research'),
  ...T.bullets([
    'Three-minute mobile survey on shared projects, tools used, pain points, budget visibility and organizer burden.',
    'Pilot interest across reunion, trip, family property and other shared goals.',
    'Permission for a 20-minute follow-up interview, and role segmentation.',
    'Questions that identify the buyer, willingness to pay, and the features that save the most time.',
  ]),
  T.h2('QR pathway B — banker, investor and strategic partner interest'),
  ...T.bullets([
    'Short non-confidential concept summary focused on the problem, target user and validation plan.',
    'Interest categories for payments, banking, legal, title, vendors, distribution, investment and accelerator support.',
    'Relevant portfolio, customer or market access, and preferred next conversation.',
    'Permission to receive a post-Homecoming evidence update.',
  ]),
  T.h2('Field activation controls'),
  T.dataTable(
    ['Asset or action', 'Purpose', 'Control'],
    [
      ['20-second pitch', 'Create a consistent opening.', 'Do not mention legal ownership calculation or investment returns.'],
      ['90-second demo', 'Show one workflow, not the entire future vision.', 'Use non-sensitive sample data.'],
      ['Two QR cards', 'Separate user evidence from partner interest.', 'Clearly label the two destinations.'],
      ['Interview calendar', 'Secure deeper conversations while interest is fresh.', 'Limit to qualified organizers and partners.'],
      ['Response dashboard', 'Monitor evidence and follow-up.', 'Restrict access and honor consent choices.'],
    ],
    [1.1, 2.1, 2.1],
  ),

  /* 10 ----------------------------------------------------------- */
  ...SEC(10, 'The 90-day period should end with a build, partner or pause decision grounded in evidence rather than enthusiasm.'),
  T.dataTable(
    ['Timing', 'Objective', 'Key work', 'Decision gate'],
    [
      [{ text: 'Days 1–14', sub: 'Aug 27 – Sep 9' }, 'Focus the concept', 'Founder workshop, prototype audit, 12–15 interviews, target customer, job to be done, MVP exclusions and survey drafts.', 'Approve one lead wedge and positioning statement.'],
      [{ text: 'Days 15–30', sub: 'Sep 10 – Sep 25' }, 'Build the validation system', 'Launch both QR pathways, synthesize interviews, draft requirements, recruit three to five design partners and test the pilot offer.', 'Approve top workflows and pilot concept.'],
      [{ text: 'Days 31–45', sub: 'Sep 26 – Oct 10' }, 'Run the field test', 'Prepare QR cards, short pitch and demo; conduct interviews; test the Class of 1997 offer and capture partner interest.', 'Determine whether demand supports a paid pilot.'],
      [{ text: 'Days 46–60', sub: 'Oct 11 – Oct 26' }, 'Convert evidence', 'Analyze results, revise the prototype, test pricing, consult legal and payments experts, and follow up with strong leads.', 'Approve pilot scope, architecture and commercial terms.'],
      [{ text: 'Days 61–75', sub: 'Oct 27 – Nov 10' }, 'Prepare the pilot', 'Onboard one or two groups, configure the dashboard, secure vendors, document the playbook and test unit economics.', 'Confirm burden reduction and repeatability.'],
      [{ text: 'Days 76–90', sub: 'Nov 11 – Nov 25' }, 'Make the build and capital decision', 'Pilot readout, revised model, 12-month roadmap, partnership pipeline, investor narrative and resource plan.', 'Choose bootstrap, partner, accelerator, fundraise or pause.'],
    ],
    [0.95, 1.2, 2.35, 1.6],
  ),

  T.h2('Evidence targets by November 25'),
  T.dataTable(
    ['Evidence area', 'Target'],
    [
      ['User evidence', 'At least 75 survey responses, 15 interviews, and a clear ranking of the top three pain points.'],
      ['Pilot demand', 'Five qualified candidates, two written commitments or letters of intent, and one paid or fully scoped pilot.'],
      ['Product clarity', 'One lead use case, one buyer, one requirements brief, and one tested prototype or operating workflow.'],
      ['Commercial evidence', 'Documented willingness to pay, initial package pricing and preliminary unit economics.'],
      ['Partner evidence', 'Five qualified vendor or institutional conversations, and three meaningful banker, investor or funder follow-ups.'],
    ],
    [1, 3.1],
  ),

  /* 11 ----------------------------------------------------------- */
  ...SEC(11, 'Dana should lead the strategy, validation architecture, commercial model and operating discipline. Eric and his teammate should supply the founder truth, technical reality, participant access and final approvals.'),
  T.dataTable(
    ['Workstream', 'Dana / VGP lead', 'Eric and teammate ownership'],
    [
      ['Strategy and positioning', 'Facilitate customer, wedge, value proposition, brand architecture and business model decisions.', 'Provide founder vision, domain experience, constraints and approvals.'],
      ['Research and validation', 'Design the interview guide, surveys, QR pathways, evidence dashboard and synthesis.', 'Recruit respondents, conduct assigned interviews and manage Homecoming activation.'],
      ['Product definition', 'Translate evidence into roles, workflows, MVP boundaries, requirements and roadmap.', 'Isaiah audits the current build and documents technical reality; Eric confirms priorities and coordinates development.'],
      ['Commercial model', 'Develop pilot offers, pricing hypotheses, partner model, unit economics framework and go-to-market plan.', 'Validate supplier costs, licensing requirements, fulfillment realities and willingness to pay.'],
      ['Partnership and capital readiness', 'Shape the non-confidential teaser, partner segmentation, meeting narrative and future pitch materials.', 'Open relationships, lead founder conversations and maintain the pipeline.'],
      ['Program management', 'Run the weekly strategy session, milestone reviews, decision log, risk register and executive updates.', 'Complete assigned actions, make timely decisions and maintain the shared workspace.'],
    ],
    [1.15, 2.2, 1.95],
  ),

  T.h2('Proposed 90-day deliverables'),
  ...T.bullets([
    'Approved opportunity and concept brief, with assumptions and exclusions.',
    'Primary customer, job to be done, and positioning statement.',
    'Competitive and product boundary memo.',
    'MVP workflow map and product requirements brief.',
    'Interview guide, surveys, partner interest form and evidence dashboard.',
    'Homecoming activation plan, short pitch and non-confidential concept page.',
    'Reunion and Homecoming pilot offer, operating playbook and preliminary pricing.',
    'Pilot, partner and investor follow-up pipeline.',
    '90-day evidence readout and 12-month recommendation.',
  ]),

  /* 12 ----------------------------------------------------------- */
  ...SEC(12, 'Keep the conversation founder-centered and decision-oriented. Validate Eric’s experience, then pressure-test the concept without presenting internal hypotheses as final answers.'),
  T.h2('Suggested opening sequence'),
  ...T.bullets([
    [{ t: 'Validate the origin. ', b: true, c: C.navy }, { t: '“The land project gives this concept a real human problem and a credible reason to exist.”' }],
    [{ t: 'Set the meeting objective. ', b: true, c: C.navy }, { t: '“Today I want us to decide what we need to prove before we invest in a broader build.”' }],
    [{ t: 'Separate current product from vision. ', b: true, c: C.navy }, { t: '“Let’s identify what the site does today, what is mocked up, and what remains an idea.”' }],
    [{ t: 'Introduce focus. ', b: true, c: C.navy }, { t: '“We can preserve the full vision while selecting one entry point for the next 90 days.”' }],
    [{ t: 'Introduce guardrails. ', b: true, c: C.navy }, { t: '“Ownership, payments and sensitive family data should be designed intentionally from the beginning.”' }],
    [{ t: 'Close with ownership. ', b: true, c: C.navy }, { t: '“Let’s end with decisions, open evidence requests, owners, and the next seven days of work.”' }],
  ], { numbered: true }),

  T.h2('Questions Dana should press'),
  ...T.bullets([
    'What does Eric want to be true in three years, and what is the smallest proof that makes that future credible?',
    'Who feels this problem frequently enough to pay — and who only likes the idea?',
    'What was hardest about the Oklahoma land project: ownership clarity, family decisions, payments, labor, reporting or trust?',
    'How much of the prototype works today, and which parts are conceptual?',
    'Is Eric building software, a managed service, a marketplace, or a service-led software company?',
    'What information would families refuse to share, and what trust promise must never be violated?',
    'Which duties belong to Eric, Isaiah, Dana, developers and licensed professionals, given Isaiah’s stated minimum capacity of one hour per week?',
    'What will the team deliberately stop building during the next 90 days?',
  ]),

  T.h2('Red flags to listen for'),
  ...T.bullets([
    'The platform is expected to serve every family, trip, property, reunion, fund and business at launch.',
    'Family-reported percentages are treated as verified legal ownership.',
    'The business model depends on holding money or selling data before trust and compliance are designed.',
    'Investor access becomes the lead story before customer demand is proven.',
    'The Class of 1997 request is described as revenue without confirming scope and payment.',
    'Eric remains the only person who can deliver the reunion service, because the playbook is undocumented.',
    'Isaiah’s one hour per week is treated as build capacity rather than limited advisory capacity, and development ownership and intellectual property remain unclear.',
  ]),

  /* 13 ----------------------------------------------------------- */
  ...SEC(13, 'The session should conclude with a decision record — not only a productive discussion.'),
  T.dataTable(
    ['Decision', 'Target output', 'Owner after meeting'],
    [
      ['Lead wedge', 'One approved customer and use case for the 90-day sprint.', 'Eric final approval; Dana documents.'],
      ['MVP boundary', 'Must-have workflow, exclusions and current prototype status.', 'Dana and Isaiah.'],
      ['Ownership and payment posture', 'Written working language, plus expert questions.', 'Dana coordinates; Eric identifies counsel or partners.'],
      ['Data governance', 'Initial data inventory, access roles and prohibited uses.', 'Teammate drafts; Dana reviews.'],
      ['Homecoming validation', 'Two QR pathways, target respondents and field roles.', 'Dana designs; Eric activates.'],
      ['Class of 1997 opportunity', 'Discovery call, scope question set and paid-pilot test.', 'Eric leads; Dana supports.'],
      ['Team cadence', 'Weekly meeting, shared workspace, decision log and next milestone.', 'Full team.'],
    ],
    [1.15, 2.3, 1.75],
  ),

  T.h2('First seven days'),
  ...T.bullets([
    'Eric sends prototype access, the four-person insurance project example, current Homecoming cost information and any remaining concept materials.',
    'Isaiah provides a technical assessment, a one-hour weekly work plan, current product status, and a recommendation on stabilize versus rebuild.',
    'Dana circulates the approved decision summary, interview guide and information request.',
    'The team schedules the Class of 1997 discovery conversation and selects five initial interview candidates.',
    'The group confirms the next weekly strategy session and the source of truth.',
  ]),

  T.h2('Sources and working references', { pageBreakBefore: true, before: 0 }),
  T.dataTable(
    ['Reference', 'Location'],
    [
      ['Ascend Family Vault prototype', 'ascendfamilyfinance.com'],
      ['Ascend gallery', 'ascendfamilyfinance.com/gallery'],
      ['Morehouse College 2026 Homecoming FAQ', 'morehouse.edu/events/signature-events/homecoming/faqs'],
      ['USDA heirs property overview', 'farmers.gov/working-with-us/heirs-property-eligibility'],
      ['FinCEN payment platform ruling', 'fincen.gov — administrative ruling on whether a company offering payment services is a money transmitter'],
      ['Cheddar Up reunion collection', 'cheddarup.com/collect-money-reunion'],
      ['HeirShares', 'heirshares.com'],
    ],
    [1.5, 2.6],
  ),
  T.spacer(250),
  T.callout('Internal working note',
    'This document is an opportunity assessment and planning tool. It is not legal, tax, securities, title, software engineering or investment advice. All assumptions should be validated with Eric, his teammate, prospective users and qualified professionals.',
    { fill: C.softGray, borderColor: C.border, labelColor: C.bodyLight, color: C.body, size: 17 }),
];

const doc = new Document({
  creator: 'Dana Ammons · Value Growth Partners',
  title: DOCNAME,
  description: 'Internal opportunity assessment, decision architecture and 90-day validation plan.',
  styles: T.styles,
  numbering: T.numbering,
  sections: [{
    properties: {
      titlePage: true,
      page: {
        size: { width: PAGE.width, height: PAGE.height },
        margin: { top: PAGE.marginTop, right: PAGE.marginX, bottom: PAGE.marginBottom, left: PAGE.marginX, header: 560, footer: 480 },
      },
    },
    headers: { default: runHeader(), first: new Header({ children: [new Paragraph({ children: [] })] }) },
    footers: { default: runFooter(), first: runFooter() },
    children,
  }],
});

Packer.toBuffer(doc).then((b) => {
  fs.writeFileSync(process.argv[2], b);
  console.log('written');
});
