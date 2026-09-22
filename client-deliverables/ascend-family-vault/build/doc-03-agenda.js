const {
  Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber,
  TabStopType, BorderStyle,
} = require('docx');
const fs = require('fs');
const T = require('./theme');
const { C, F, PAGE, CONTENT } = T;

const DOCNAME = 'Ascend Family Vault — Working Session Agenda';
const BLANK = { text: '', fill: C.softGray };

const runHeader = () => new Header({
  children: [new Paragraph({
    spacing: { after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT }],
    children: [
      new TextRun({ text: DOCNAME.toUpperCase(), font: F.sans, size: 13, bold: true, color: C.bodyLight, characterSpacing: 18 }),
      new TextRun({ text: '\tAUGUST 27, 2026', font: F.sans, size: 13, bold: true, color: C.bodyLight, characterSpacing: 18 }),
    ],
  })],
});

const runFooter = () => new Footer({
  children: [new Paragraph({
    spacing: { before: 60, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT }],
    children: [
      new TextRun({ text: 'Facilitated by Dana Ammons · Value Growth Partners', font: F.sans, size: 13, color: C.bodyLight }),
      new TextRun({ text: '\t', font: F.sans, size: 13 }),
      new TextRun({ children: [PageNumber.CURRENT], font: F.sans, size: 13, bold: true, color: C.navy }),
      new TextRun({ text: ' / ', font: F.sans, size: 13, color: C.bodyLight }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], font: F.sans, size: 13, color: C.bodyLight }),
    ],
  })],
});

const children = [
  T.coverBand({
    kicker: 'On-screen working session agenda',
    title: ['Ascend Family Vault', 'Working Session'],
    subtitle: 'A concept development session run to a decision standard: one lead customer, one lead workflow, one set of guardrails, and named owners before we close.',
    meta: [
      { label: 'Date', value: 'Thursday, August 27, 2026' },
      { label: 'Time', value: '1:30–3:30 PM Eastern · 10:30 AM–12:30 PM Pacific · optional extension to 4:30 PM ET' },
      { label: 'In the room', value: 'Eric Rice · Isaiah Harrison · Dana Ammons · Serena Boykin (observing)' },
    ],
  }),
  T.spacer(260),
  T.statStrip([
    { value: '1', label: 'Lead customer' },
    { value: '1', label: 'Lead workflow' },
    { value: '90', label: 'Day validation window' },
    { value: '7', label: 'Day commitment list' },
  ]),
  T.spacer(280),
  T.callout('By the close of this session',
    'Decide whether Class of 1997 becomes the first service-led pilot, define the first complete prototype workflow, confirm the Oklahoma consent test and the payment and data guardrails, and assign Eric, Isaiah and Dana’s next seven days.'),

  T.h2('Timed agenda', { pageBreakBefore: true, before: 0 }),
  T.dataTable(
    ['Time (ET)', 'Conversation', 'Facilitator prompt', 'Required output'],
    [
      ['1:30 – 1:40', 'Opening and team roles', 'What decisions do Eric, Isaiah and Dana own? What is Serena observing?', 'Decision list and roles'],
      ['1:40 – 2:00', 'New evidence and origin cases', 'Where do consent, working capital and coordination break down?', 'Core pain and pilot criteria'],
      ['2:00 – 2:20', 'Prototype walkthrough', 'What works, what partly works, and what does not work?', 'Stabilize-versus-rebuild inputs'],
      ['2:20 – 2:45', 'Market entry choice', 'Which use case is closest to pain, proof and payment?', 'Lead wedge'],
      ['2:45 – 3:10', 'MVP and guardrails', 'What must the product do — and what must it never imply?', 'MVP, exclusions and boundaries'],
      ['3:10 – 3:25', '90-day validation', 'What evidence must the Class of 1997 pilot and the Oklahoma consent test produce?', 'Research and pilot plan'],
      ['3:25 – 3:30', 'Commitments', 'Who owns what, by when?', 'Seven-day action list'],
    ],
    [0.85, 1.35, 2.5, 1.3],
  ),

  T.h2('Guardrails that hold all session', { before: 420 }),
  T.dataTable(
    ['Ownership', 'Payments', 'Data', 'Partners and capital'],
    [
      [
        'Family-supplied project allocations are not automatically verified legal title.',
        'Use qualified payment infrastructure. Do not assume Ascend should hold pooled funds.',
        'Collect only what is needed. Define access, consent, retention, deletion and prohibited uses.',
        'Use permission-based introductions. Do not sell family financial data or promise outcomes.',
      ],
    ],
    [1, 1, 1, 1],
    { boldFirst: false },
  ),
  T.spacer(250),
  T.callout('Parking lot rule',
    'A valuable idea does not have to enter the MVP. Capture it, name the evidence it would require, and assign a future review date.'),

  T.eyebrow('Decision board', { pageBreakBefore: true }),
  T.h1('Six Decisions We Need to Make Today'),
  T.lead('Work down the board in order. A decision is made when it has a named answer, an owner and a review date — not when the room agrees it is important.'),
  T.dataTable(
    ['#', 'Decision', 'Options to consider', 'The question that resolves it', 'Decided'],
    [
      ['01', 'Lead customer', 'Family project organizer · Reunion committee · Other affinity group', 'Who has urgent pain, access and willingness to pay?', BLANK],
      ['02', 'Lead workflow', 'Contributions · Budget visibility · Tasks and approvals · Vendor coordination', 'Which workflow saves the most organizer time and improves trust?', BLANK],
      ['03', 'First proving ground', 'Class of 1997 paid service pilot · Oklahoma consent and requirements case · Sequenced test', 'Which test produces credible evidence without assuming family agreement?', BLANK],
      ['04', 'MVP boundary', 'Service-led · Software-led · Hybrid', 'What is the smallest complete experience we can validate?', BLANK],
      ['05', 'Risk posture', 'Ownership display · Payment partner · Data permissions · Partner access', 'What will Ascend record, facilitate, exclude and refer out?', BLANK],
      ['06', 'Team model', 'Eric · Isaiah (1+ hr/week) · Dana · Serena (observer) · Developers · Outside professionals', 'Who decides, builds, validates and protects each workstream?', BLANK],
    ],
    [0.42, 1.0, 1.8, 1.85, 1.05],
  ),

  T.eyebrow('Facilitator close', { pageBreakBefore: true }),
  T.h1('Commitments, Open Questions and the Next Seven Days'),
  T.lead('Fill this in live, on screen, before anyone leaves. What is not captured here does not exist.'),

  T.h2('Decision recap', { before: 200 }),
  T.dataTable(
    ['Decision made', 'Owner', 'Review date', 'Evidence required'],
    [
      [{ text: 'Lead customer, use case and proving ground', color: C.navy }, BLANK, BLANK, BLANK],
      [{ text: 'MVP boundary, plus ownership, payment and data posture', color: C.navy }, BLANK, BLANK, BLANK],
      [{ text: 'Homecoming validation and team plan', color: C.navy }, BLANK, BLANK, BLANK],
    ],
    [2.1, 1.1, 1.1, 1.7],
    { rowHeight: 500 },
  ),

  T.h2('Next seven days', { before: 280 }),
  T.dataTable(
    ['Action', 'Suggested owner', 'Complete by'],
    [
      ['Provide prototype access, Class of 1997 order assumptions and Oklahoma project inputs.', 'Eric', BLANK],
      ['Document the current technical build, the stabilize-versus-rebuild view and a one-hour weekly work plan.', 'Isaiah', BLANK],
      ['Issue the decision summary, interview guide, evidence tracker and information request.', 'Dana', BLANK],
      ['Schedule Class of 1997 discovery and identify five interview candidates.', 'Eric + Dana', BLANK],
      ['Confirm the weekly working cadence and the shared source of truth.', 'Full team', BLANK],
    ],
    [3.1, 1.1, 1.1],
    { rowHeight: 420 },
  ),

  T.h2('Parking lot', { before: 280 }),
  T.dataTable(
    ['Idea or question raised', 'Evidence it would need', 'Review date'],
    [
      [BLANK, BLANK, BLANK],
      [BLANK, BLANK, BLANK],
      [BLANK, BLANK, BLANK],
    ],
    [2.4, 2.0, 0.9],
    { rowHeight: 540 },
  ),
  T.spacer(170),
  T.callout('Close question',
    [{ t: 'What will we deliberately not build, not promise and not pursue during the next 90 days?', i: true }]),
];

const doc = new Document({
  creator: 'Dana Ammons · Value Growth Partners',
  title: DOCNAME,
  description: 'On-screen working session agenda, decision board and facilitator close.',
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

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(process.argv[2], b); console.log('written'); });
