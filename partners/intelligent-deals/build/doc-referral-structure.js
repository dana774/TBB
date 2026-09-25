/**
 * Intelligent Deals × Value Growth Partners — proposed referral partnership structure.
 * Partner-facing. Reuses the VGP document design system.
 *
 *   npm install docx && node doc-referral-structure.js
 */
const {
  Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber,
  TabStopType, BorderStyle,
} = require('docx');
const fs = require('fs');
const T = require('./theme');
const { C, F, PAGE, CONTENT } = T;

const DOCNAME = 'Intelligent Deals × VGP — Referral Partnership Structure';

const runHeader = () => new Header({
  children: [new Paragraph({
    spacing: { after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT }],
    children: [
      new TextRun({ text: 'REFERRAL PARTNERSHIP STRUCTURE', font: F.sans, size: 13, bold: true, color: C.bodyLight, characterSpacing: 18 }),
      new TextRun({ text: '\tINTELLIGENT DEALS × VALUE GROWTH PARTNERS', font: F.sans, size: 13, bold: true, color: C.bodyLight, characterSpacing: 18 }),
    ],
  })],
});

const runFooter = () => new Footer({
  children: [new Paragraph({
    spacing: { before: 60, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border } },
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT }],
    children: [
      new TextRun({ text: 'Value Growth Partners · The Brand Blueprint · Proposed for discussion — not a binding agreement', font: F.sans, size: 13, color: C.bodyLight }),
      new TextRun({ text: '\t', font: F.sans, size: 13 }),
      new TextRun({ children: [PageNumber.CURRENT], font: F.sans, size: 13, bold: true, color: C.navy }),
      new TextRun({ text: ' / ', font: F.sans, size: 13, color: C.bodyLight }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], font: F.sans, size: 13, color: C.bodyLight }),
    ],
  })],
});

const children = [
  T.coverBand({
    kicker: 'Partner-facing · proposed for discussion',
    title: ['Referral Partnership', 'Structure'],
    subtitle: 'A simple, reciprocal referral framework between Intelligent Deals and Value Growth Partners — one principle, two lanes, and terms that pay each side on what it actually collects.',
    meta: [
      { label: 'Prepared for', value: 'Kyle Benus · SVP, Business Development · Intelligent Deals' },
      { label: 'Prepared by', value: 'Dana Ammons · Founder & Managing Partner · Value Growth Partners' },
      { label: 'Version', value: 'Version 1.0 · Proposed September 25, 2026' },
      { label: 'Status', value: 'Draft for review. Nothing here takes effect until both parties confirm in writing.' },
    ],
  }),

  T.spacer(260),
  T.callout('The principle',
    [{ t: 'Each side pays the other a share of what it actually collects on a referred relationship. ', b: true },
     'Nothing is owed on projections, introductions that go nowhere, or business that does not settle. Neither party changes how it prices or bills, and no founder ever pays more because the introduction came through a partner.']),

  T.spacer(250),
  T.h1('Why This Works'),
  T.lead('Value Growth Partners and Intelligent Deals sit next to each other in a founder\'s growth path without overlapping. VGP works upstream — readiness, economics, inventory planning, channel strategy, and the founder relationship itself. Intelligent Deals works downstream — channel access, placement, pricing, and sell-through across subscription box, e-commerce discount, marketplace, and televised retail.'),
  T.body('The result is a cleaner pipeline in both directions. Brands arrive at Intelligent Deals already screened for category fit, inventory depth, margin tolerance, and fulfillment capability, with realistic expectations about what a promotional channel is and is not. Brands that are not ready arrive at VGP instead, and come back when they are.'),

  T.spacer(120),
  T.h2('Lanes'),
  T.dataTable(
    ['', 'Value Growth Partners', 'Intelligent Deals'],
    [
      ['Owns', 'Founder relationship, growth strategy, readiness, unit economics, inventory and channel planning, capital preparation.', 'Channel access and relationships, placement strategy, deal pricing, sale execution, fulfillment coordination, performance reporting.'],
      ['Decides', 'Whether a brand is ready to be introduced, and what the founder should expect from a promotional channel.', 'Whether a brand is a fit, what it is worth, and which channel and window it belongs in.'],
      ['Does not', 'Price, scope, contract, or represent any Intelligent Deals placement.', 'Advise on or contract for VGP advisory, retainer, or consulting work.'],
    ],
    [1.1, 2.6, 2.6],
    { tint: true },
  ),

  T.spacer(340),
  T.h1('How a Referral Moves'),
  T.lead('Five steps. The only one that creates an obligation is step two.'),
  ...T.bullets([
    [{ t: 'Pre-qualification. ', b: true }, 'VGP screens the brand for category fit, inventory depth, margin tolerance, fulfillment capability, and readiness for a promotional channel.'],
    [{ t: 'Registration. ', b: true }, 'VGP emails Intelligent Deals the brand name, a short context note, and a line sheet. Intelligent Deals responds within five business days: yes, not now, or not a fit — and says so plainly if the brand is already an active account or an open conversation, in which case no fee applies. Registration is what establishes attribution; nothing else does.'],
    [{ t: 'Pricing and fit. ', b: true }, 'Intelligent Deals prices the line sheet and scopes the placement. VGP sets the founder\'s expectations: a promotional channel is an investment in awareness, trial, and consumer data — not a margin play.'],
    [{ t: 'Test placement. ', b: true }, 'A small validation sale, in the channel Intelligent Deals recommends. No referral fee is owed on a brand\'s first test in either direction.'],
    [{ t: 'Scale. ', b: true }, 'Larger placements, additional windows, and televised retail where the brand earns it.'],
  ], { numbered: true, after: 110 }),

  T.spacer(200),
  T.callout('Straight feedback, both directions',
    'Where a brand is not a fit — wrong category, wrong stage, pricing that will not work — the fastest answer is the most valuable one. VGP would rather hear "not this one" early than have a founder sit in a queue, and will do the same in return.',
    { fill: C.softGray, borderColor: C.border, labelColor: C.bodyLight, color: C.body, size: 18 }),

  T.spacer(340),
  T.h1('Fee Structure'),
  T.lead('Two directions, one number each. Fees are earned when money is collected or a sale settles — never before.'),
  T.dataTable(
    ['Direction', 'Fee', 'Basis', 'Term'],
    [
      [
        { text: 'VGP refers a brand to Intelligent Deals', sub: 'Product purchase — subscription box, e-commerce discount, marketplace' },
        { text: '5%', size: 22, color: C.navy },
        'Of the net amount Intelligent Deals pays the referred brand for product on each completed sale. Paid from Intelligent Deals\' margin — never added to the brand\'s cost and never a change to how Intelligent Deals prices.',
        '12 months from the brand\'s first completed sale; renews annually while the brand stays active, by mutual written agreement.',
      ],
      [
        { text: 'VGP refers a brand to Intelligent Deals', sub: 'Commission or agency placement — televised retail and similar' },
        { text: '15%', size: 22, color: C.navy },
        'Of the net commission or agency fee Intelligent Deals collects on that placement. Applies where Intelligent Deals is paid a fee rather than purchasing product.',
        '12 months from the brand\'s first completed placement; renews on the same basis.',
      ],
      [
        { text: 'Intelligent Deals refers a founder or company to VGP', sub: 'Advisory, project, or retainer work' },
        { text: '15%', size: 22, color: C.navy },
        'Of net consulting, project, or retainer fees VGP actually collects from that client. New VGP clients only.',
        'First 6 months of the engagement.',
      ],
      [
        { text: 'First test placement', sub: 'Either direction, once per brand' },
        { text: 'No fee', size: 20, color: C.navy },
        'The initial validation sale carries no referral fee. Testing should never carry a cost that discourages it.',
        'One per referred brand.',
      ],
      [
        { text: 'Client incentive', sub: 'Optional, at VGP\'s cost' },
        { text: '10%', size: 22, color: C.navy },
        'Discount on a VGP retainer or paid strategy engagement for any company introduced by Intelligent Deals.',
        'Non-stackable; first engagement only.',
      ],
    ],
    [1.5, 0.6, 3.1, 1.8],
    { tint: true, rowHeight: 300 },
  ),

  T.spacer(220),
  T.h3('What is excluded from every fee basis'),
  T.body('Shipping and freight, drop-ship and fulfillment costs, platform and marketplace fees, media spend, software and licensing, sales tax, duties, returns, chargebacks, and any third-party pass-through. Returns and cancellations net against the following period. Fees apply to net collected or settled amounts only.'),

  T.spacer(120),
  T.callout('A note on the 5%',
    'It is deliberately small and it comes out of the partner\'s side, not the founder\'s. The intent is that this costs Intelligent Deals a fraction of the margin on business it would not otherwise have seen, and costs the brand nothing at all. If the number does not work against your actual deal economics, say so and we will set it where it does.'),

  T.spacer(340),
  T.h1('Invoicing and Payment'),
  T.dataTable(
    ['Item', 'Terms'],
    [
      ['Cadence', 'Invoiced monthly in arrears, covering sales that settled in the prior month.'],
      ['Payment', 'Net 30 from invoice date.'],
      ['Statement', 'A simple line per sale: brand, channel, sale window, units, and the net amount paid to the brand. No access to margin or account-level financials is requested or required.'],
      ['Disputes', 'Raised within 30 days of the statement and resolved between Kyle Benus and Dana Ammons directly.'],
      ['Records', 'Each party keeps its own records of referred brands and registered introductions and shares the relevant summary on request.'],
    ],
    [1, 3.4],
    { tint: true },
  ),

  T.spacer(340),
  T.h1('Guardrails'),
  T.lead('Short list, plain language. These exist so neither side has to guess.'),
  ...T.bullets([
    [{ t: 'Non-exclusive. ', b: true }, 'Neither party is obligated to refer, accept, or represent. Either may decline any referral without explanation.'],
    [{ t: 'No guaranteed volume. ', b: true }, 'Nothing here promises a number of introductions, placements, or outcomes.'],
    [{ t: 'Independent delivery. ', b: true }, 'Each party prices, scopes, contracts, and delivers its own work. Neither speaks for, commits, or contracts on behalf of the other, and neither is an agent, employee, or joint venturer of the other.'],
    [{ t: 'Transparent to the founder. ', b: true }, 'VGP discloses the referral arrangement to the founder when the introduction is made. The founder is never charged more because the referral came through VGP.'],
    [{ t: 'Confidentiality. ', b: true }, 'Founder, brand, client, pricing, and commercial information stays inside the relationship and is not used outside it.'],
    [{ t: 'Attribution. ', b: true }, 'A referral is attributed for 12 months from written registration. A brand already active with, or in an open conversation with, the receiving party at the time of registration is not a referral.'],
    [{ t: 'Documented first. ', b: true }, 'No fee is expected on any referral that was not registered in writing before the conversation began.'],
    [{ t: 'Term and exit. ', b: true }, 'Either party may end the arrangement with 30 days\' written notice. Fees already earned on active referred brands survive through the end of their attribution window.'],
  ], { after: 95 }),

  T.spacer(340),
  T.h1('Ecosystem Access'),
  T.lead('Referral partners are also part of The Brand Blueprint ecosystem. There is no charge for any of this as an initial partner.'),
  T.dataTable(
    ['Benefit', 'What it means'],
    [
      ['Partner directory', 'A page in the Value Growth Partners referral partner network, positioned around when and why a founder should engage you.'],
      ['Founder newsletter', 'Periodic inclusion in a private, subscription newsletter written for founders, investors, and referral partners. Complimentary for initial partners.'],
      ['The Hot List', 'Inclusion, where relevant, in the curated founder and opportunity digest shared across the ecosystem.'],
      ['Ecosystem submissions', 'You may submit programs, events, and opportunities for consideration in Brand Blueprint publications.'],
      ['Accelerator access', 'Introductions into the accelerator and founder networks VGP teaches and advises in, where there is a genuine fit.'],
    ],
    [1, 3],
    { tint: true },
  ),

  T.spacer(340),
  T.h1('Next Steps'),
  ...T.bullets([
    'Review this structure and confirm it, or send back the numbers and terms you would change. Redlines are welcome — the point is a model both sides would sign without hesitating.',
    'Once the terms are settled, VGP begins sending brands with line sheets and context for a straight yes or no.',
    'Both parties confirm in writing. This document is a proposal and creates no obligation until then.',
  ], { numbered: true, after: 110 }),

  T.spacer(280),
  T.callout('Contact',
    [{ t: 'Dana Ammons', b: true }, ' · Founder & Managing Partner · Value Growth Partners · The Brand Blueprint · ',
     'dana@valugrowthpartners.com · +1 229-663-1684 · valugrowthpartners.com/connect'],
    { fill: C.softGray, borderColor: C.border, labelColor: C.bodyLight, color: C.body, size: 18 }),

  T.spacer(200),
  T.body('This document is a commercial proposal for discussion. It is not a contract, and it is not legal, tax, or accounting advice. Final terms should be confirmed in writing by both parties and reviewed by each party\'s own counsel as they see fit.',
    { size: 16, color: C.bodyLight, i: true }),
];

const doc = new Document({
  creator: 'Dana Ammons · Value Growth Partners',
  title: DOCNAME,
  description: 'Proposed reciprocal referral fee structure between Intelligent Deals and Value Growth Partners.',
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
  const out = process.argv[2] || '../Intelligent_Deals_VGP_Referral_Partnership_Structure_v1.docx';
  fs.writeFileSync(out, b);
  console.log('written', out);
});
