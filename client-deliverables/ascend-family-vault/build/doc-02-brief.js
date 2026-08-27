const {
  Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber,
  TabStopType, BorderStyle, AlignmentType, PageBreak,
} = require('docx');
const fs = require('fs');
const T = require('./theme');
const { C, F, PAGE, CONTENT } = T;

const DOCNAME = 'Ascend Family Vault — Working Session Brief';

const runHeader = () => new Header({
  children: [new Paragraph({
    spacing: { after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT }],
    children: [
      new TextRun({ text: DOCNAME.toUpperCase(), font: F.sans, size: 13, bold: true, color: C.bodyLight, characterSpacing: 18 }),
      new TextRun({ text: '\tVALUE GROWTH PARTNERS', font: F.sans, size: 13, bold: true, color: C.bodyLight, characterSpacing: 18 }),
    ],
  })],
});

const runFooter = () => new Footer({
  children: [new Paragraph({
    spacing: { before: 60, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT }],
    children: [
      new TextRun({ text: 'Prepared by Dana Ammons · Value Growth Partners · Confidential working draft', font: F.sans, size: 13, color: C.bodyLight }),
      new TextRun({ text: '\t', font: F.sans, size: 13 }),
      new TextRun({ children: [PageNumber.CURRENT], font: F.sans, size: 13, bold: true, color: C.navy }),
      new TextRun({ text: ' / ', font: F.sans, size: 13, color: C.bodyLight }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], font: F.sans, size: 13, color: C.bodyLight }),
    ],
  })],
});

const children = [
  T.coverBand({
    kicker: 'Concept development · discussion brief',
    title: ['Ascend Family Vault', 'Working Session Brief'],
    subtitle: 'A focused guide for clarifying the opportunity, choosing the first validation lane, and setting responsible product boundaries before build money is committed.',
    meta: [
      { label: 'Prepared for', value: 'Eric Rice, Isaiah Harrison and the Ascend Family Vault project team' },
      { label: 'Prepared by', value: 'Dana Ammons · Value Growth Partners' },
      { label: 'Working session', value: 'Thursday, August 27, 2026 · 1:30–3:30 PM ET · optional extension to 4:30 PM ET' },
      { label: 'Version', value: 'Updated working draft · August 27, 2026' },
    ],
  }),
  T.spacer(260),
  T.callout('Executive purpose',
    'Give Eric, his project teammate and Dana a shared starting point for the August 27 working session — without treating early strategy hypotheses as final product decisions.'),
  T.spacer(250),
  T.statStrip([
    { value: '1', label: 'Lead customer' },
    { value: '1', label: 'Lead workflow' },
    { value: '90', label: 'Day validation window' },
    { value: '7', label: 'Day commitment list' },
  ]),

  T.rule({ before: 340, after: 300 }),
  T.eyebrow('Working context'),
  T.h1('What Eric Confirmed, and What We Need to Decide'),
  T.lead('Ascend began with a real family challenge: coordinating decisions, work, payments and progress around inherited land shared across many relatives. Eric’s follow-up clarifies that the current site can create and partly configure projects, while payments, vaults, documents and estate functions remain unbuilt. It also gives us a concrete Class of 1997 graduation-box opportunity to evaluate as an initial commercial pilot.'),
  T.spacer(60),
  T.callout('Working hypothesis for discussion',
    'Ascend may be most valuable as a transparent shared-project operating system that helps organizers coordinate people, commitments, tasks, approvals, budgets and progress. This hypothesis still requires founder, customer and market validation.'),

  T.h2('Confirmed inputs for today'),
  T.dataTable(
    ['Area', 'What is confirmed', 'Decision today'],
    [
      ['Prototype', 'Projects can be created and partly configured; app email is available.', 'Stabilize or rebuild — and select the first complete workflow.'],
      ['High-risk functions', 'Stripe, vaults, documents and estate functions do not work.', 'Keep out of the pilot; define the partner and compliance path.'],
      ['Oklahoma case', 'Family agreement is not secured; pushback is expected.', 'Use a consent test and project charter, not a fundraising request.'],
      ['Homecoming', '3.5-month sourcing cycle; Eric fronts funds and negotiates overseas.', 'Set deposits, a landed-cost model, QA standards and workload rules.'],
      ['Class of 1997', '$75 box concept accepted; roughly $50 of product ideas; a minimum applies.', 'Confirm quantity, full cost, approvals, licensing and terms.'],
      ['Team', 'Isaiah: business and software adviser, 1+ hour weekly. Serena: observer.', 'Confirm technical accountability, IP, capacity and access.'],
    ],
    [1.05, 2.2, 2.2],
  ),

  T.h2('Potential opportunity structure'),
  T.body('One shared engine, expressed two ways. The value of this framing is that it lets us test two markets without building two products.'),
  T.dataTable(
    ['Common platform engine', 'Family project application', 'Reunion and Homecoming application'],
    [
      ['Project goal, budget and milestones', 'Property improvement, maintenance or a family fund.', 'Tent, hospitality, travel, swag or class activity.'],
      ['Roles, tasks and approvals', 'Family committee, relatives, contractors and advisers.', 'Class committee, volunteers, vendors and participants.'],
      ['Contribution and expense visibility', 'Commitments, approved spending and progress reporting.', 'Deposits, package status, supplier costs and reconciliation.'],
      ['Permissioned partner access', 'Legal, title, contractor, banking or insurance resources.', 'Licensed vendors, venues, travel, merchandise and sponsors.'],
    ],
    [1.25, 1.35, 1.4],
  ),

  T.h2('Questions this session should answer'),
  ...T.bullets([
    'Which customer and project type experience the strongest and most frequent pain?',
    'What does the existing product do today, and what remains a future concept?',
    'Which workflow would create enough value for an organizer or group to pay?',
    'Can one common engine support the family land and reunion opportunities without forcing both into the same launch?',
    'What should Ascend deliberately exclude during the first 90 days?',
  ]),

  T.eyebrow('Proposed session', { pageBreakBefore: true }),
  T.h1('August 27 Working Agenda'),
  T.lead('A two-hour decision session, with an optional additional hour for product and engagement planning.'),
  T.dataTable(
    ['Time (ET)', 'Topic', 'Desired outcome'],
    [
      ['1:30 – 1:40', 'Opening, objectives and team roles', 'Confirm Eric, Isaiah, Dana and Serena’s roles, decision rights and the decisions required today.'],
      ['1:40 – 2:00', 'Origin story and problem anatomy', 'Document the Oklahoma land case, the Homecoming operating case and the most important pain.'],
      ['2:00 – 2:20', 'Prototype and website walkthrough', 'Separate current capabilities from mockups, assumptions and future features.'],
      ['2:20 – 2:45', 'Market entry discussion', 'Compare family projects, reunion and Homecoming, and broader shared goals.'],
      ['2:45 – 3:10', 'MVP boundary and business model', 'Identify the first workflow, the exclusions, the buyer and an initial revenue hypothesis.'],
      ['3:10 – 3:25', '90-day validation plan', 'Align on the prototype audit, family consent research, Class of 1997 pilot and success measures.'],
      ['3:25 – 3:30', 'Commitments and close', 'Assign the next seven days of work, with owners and dates.'],
      [{ text: '3:30 – 4:30', color: C.bodyLight }, { text: 'Optional extension: product, team and engagement', color: C.bodyLight }, { text: 'Review technical reality, capacity, cadence and working scope.', color: C.bodyLight }],
    ],
    [0.85, 1.9, 2.6],
  ),

  T.h2('Discussion themes we may explore'),
  T.dataTable(
    ['Theme', 'Potential direction to test'],
    [
      ['Lead proving ground', 'Use the reunion and Homecoming service as a faster commercial test, while the family land case informs the more complex requirements.'],
      ['Product shape', 'Begin as a service-supported platform rather than attempting to automate every legal, financial and vendor function.'],
      ['Trust proposition', 'Make transparency, permission and member control central to the product experience.'],
      ['Partner strategy', 'Use qualified providers for title, legal, payments, lending, licensing and specialist services.'],
      ['Homecoming research', 'Use separate QR pathways for potential users and for strategic, banking and investment relationships.'],
    ],
    [1, 3],
  ),

  T.eyebrow('Decision guide', { pageBreakBefore: true }),
  T.h1('Key Decisions and Responsible Design Guardrails'),
  T.lead('These topics are presented for discussion and validation. They are starting positions to pressure-test together, not final legal or technical conclusions.'),
  T.dataTable(
    ['Decision area', 'Question to resolve together', 'Proposed starting guardrail'],
    [
      ['Initial customer and scope', 'Who is the organizer, what project are they managing, and what problem must be solved first?', 'Select one lead customer, one lead workflow and a written exclusion list for the 90-day period.'],
      ['Ownership information', 'Will Ascend record family-supplied allocations, or represent verified legal ownership?', 'Treat user-supplied percentages as project information unless qualified professionals verify title or ownership.'],
      ['Payments and contributions', 'Will Ascend collect, store, split or transmit funds — or connect users to a payment provider?', 'Begin with a qualified payment partner. Avoid holding pooled funds or stored value in the MVP.'],
      ['Financial products', 'How might banking, credit or funding relationships support users later?', 'Start with permission-based introductions. Do not promise approval, returns or investment outcomes.'],
      ['Data governance', 'What documents and personal information are truly required, who can see them, and how long are they retained?', 'Minimize collection. Define consent, permissions, retention, deletion, security and prohibited uses before launch.'],
      ['Partner and sponsor access', 'When can vendors, banks or sponsors communicate with project members?', 'Members choose whether to request an offer or introduction. Personal financial data is not sold.'],
      ['Brand and licensing', 'How will Morehouse, Spelman and other institutional marks be handled?', 'Use approved licensing pathways and qualified vendors before any branded merchandise is sold.'],
      ['Team responsibilities', 'What belongs to Eric, his teammate, Dana, developers and outside professionals?', 'Document roles, decision rights, intellectual property, weekly capacity and escalation rules.'],
    ],
    [1.1, 2.1, 2.3],
  ),
  T.spacer(250),
  T.callout('Proposed product boundary language',
    [{ t: 'Ascend records project information approved by the group. It does not determine legal ownership, provide legal advice, hold client funds or promise financial outcomes.', i: true }],
    { fill: C.softGray, borderColor: C.border, labelColor: C.deepBlue }),

  T.rule({ before: 340, after: 300 }),
  T.eyebrow('Potential path'),
  T.h1('Illustrative 90-Day Validation Plan'),
  T.lead('The goal is to decide what deserves to be built and commercialized based on evidence from prospective users, pilot candidates and qualified partners — rather than on enthusiasm.'),
  T.dataTable(
    ['Phase', 'Focus', 'Illustrative outputs'],
    [
      ['Weeks 1–2', 'Founder alignment and concept focus', 'Approved problem statement, lead customer, MVP boundary, assumptions and interview plan.'],
      ['Weeks 3–4', 'Customer and partner validation', 'Interviews, two survey pathways, pilot recruitment and prototype requirements.'],
      ['Weeks 5–6', 'Homecoming field-test preparation', 'Short pitch, QR cards, non-confidential concept page, demo and scheduled conversations.'],
      ['Weeks 7–8', 'Evidence review and product decisions', 'Prioritized workflows, pricing tests, legal and payment architecture questions, and a revised pilot.'],
      ['Weeks 9–10', 'Pilot preparation', 'One or two organizer groups, dashboard, vendor process, operating playbook and unit economics.'],
      ['Weeks 11–13', 'Build and capital decision', 'Pilot readout, 12-month roadmap, partnership pipeline and recommended resource path.'],
    ],
    [0.8, 1.6, 3],
  ),

  T.h2('Information to capture during or immediately after the meeting', { before: 300 }),
  ...T.bullets([
    'A live prototype walkthrough and an inventory of working, partial and non-working functions.',
    'The technical stack, code ownership, hosting, data model, security status, and a recommendation to stabilize or rebuild.',
    'A plain-language Oklahoma project charter explaining the objective, cost, decision process and family benefit — without assuming consent.',
    'Class of 1997 quantity, box contents, decision maker, deadlines, minimum order, deposits and a complete landed-cost model.',
    'Isaiah’s one-hour weekly work plan, technical deliverables and escalation path; and Serena’s intended ongoing role.',
    'Eric’s definition of success for November 25, and the resources he is prepared to commit.',
  ], { after: 55 }),

  T.eyebrow('Close', { pageBreakBefore: true }),
  T.h1('Expected Meeting Outputs'),
  T.lead('Five things should exist by 3:30 PM that did not exist at 1:30 PM. If any of them is still open at the close, name the owner and the date rather than leaving it to the next conversation.'),
  ...T.bullets([
    'One approved 90-day lead use case and customer.',
    'A preliminary MVP boundary and a parked-feature list.',
    'An agreed approach to ownership information, payments and sensitive data, for further expert validation.',
    'A Homecoming research plan and a Class of 1997 discovery step.',
    'Named owners, immediate information requests and the next working date.',
  ], { after: 55 }),

  T.spacer(330),
  T.callout('Working document note',
    'This brief supports a concept development discussion. It is not legal, tax, securities, title, software engineering or investment advice. Final decisions will require founder input, customer validation and, where appropriate, qualified professional review.',
    { fill: C.softGray, borderColor: C.border, labelColor: C.bodyLight, color: C.body, size: 17 }),
];

const doc = new Document({
  creator: 'Dana Ammons · Value Growth Partners',
  title: DOCNAME,
  description: 'Concept development discussion brief for the Ascend Family Vault working session.',
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
  fs.writeFileSync(process.argv[2] || '../02_Ascend_Family_Vault_Client_Discussion_Brief.docx', b);
  console.log('written');
});
