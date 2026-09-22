/**
 * Ascend Family Vault — Updated Working Session deck
 * Value Growth Partners design system (see ../../docs/08-studio-build-spec.md §1).
 */
const pptxgen = require('pptxgenjs');

const C = {
  navy: '071E41', deepBlue: '0B2D57', blue: '3978D7', gold: 'C89B2C',
  pale: 'EFF5FF', soft: 'F5F8FC', body: '4B5563', light: '6B7280',
  border: 'E5EAF2', borderMid: 'D8E6FF', white: 'FFFFFF',
  navyLine: '1E3C63', navySub: 'C7D6EE', navyLabel: '8FA9CC',
};
const SERIF = 'Cambria';
const SANS = 'Arial';

const M = 0.62;                 // slide margin
const W = 13.33, H = 7.5;
const CW = W - M * 2;           // 12.09 content width

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Dana Ammons · Value Growth Partners';
pres.company = 'Value Growth Partners';
pres.title = 'Ascend Family Vault — Updated Working Session';

let idx = 0;
const RUNNING = 'ASCEND FAMILY VAULT   ·   AUGUST 27, 2026';

/* ---------- primitives ---------- */

function chrome(slide, dark) {
  idx += 1;
  slide.addText(RUNNING, {
    x: M, y: H - 0.52, w: 7, h: 0.28, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 8, bold: true, charSpacing: 1.4,
    color: dark ? C.navyLabel : C.light, valign: 'middle',
  });
  slide.addText(String(idx).padStart(2, '0'), {
    x: W - M - 1.2, y: H - 0.52, w: 1.2, h: 0.28, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 8, bold: true, charSpacing: 1.4, align: 'right',
    color: dark ? C.navyLabel : C.light, valign: 'middle',
  });
}

/** Standard light content slide: gold eyebrow + serif headline. */
function head(slide, eyebrow, title, opts = {}) {
  slide.addText(eyebrow.toUpperCase(), {
    x: M, y: 0.46, w: CW, h: 0.24, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 10, bold: true, charSpacing: 2.2, color: C.gold, valign: 'middle',
  });
  slide.addText(title, {
    x: M, y: 0.74, w: opts.titleW || CW, h: opts.titleH || 0.62, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: opts.size || 30, color: C.navy, valign: 'middle',
  });
  if (opts.sub) {
    slide.addText(opts.sub, {
      x: M, y: 1.42, w: opts.subW || CW * 0.78, h: 0.42, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 12.5, color: C.body, lineSpacing: 17, valign: 'top',
    });
  }
}

function card(slide, o) {
  slide.addShape(pres.ShapeType.rect, {
    x: o.x, y: o.y, w: o.w, h: o.h,
    fill: { color: o.fill || C.white },
    line: { color: o.line || C.border, width: o.lineW ?? 0.75 },
  });
}

/** Card with a small label and body copy. */
function labelCard(slide, o) {
  card(slide, o);
  const px = 0.28;
  let cy = o.y + 0.24;
  if (o.kicker) {
    slide.addText(o.kicker.toUpperCase(), {
      x: o.x + px, y: cy, w: o.w - px * 2, h: 0.22, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 8.5, bold: true, charSpacing: 1.8,
      color: o.kickerColor || C.gold, valign: 'middle',
    });
    cy += 0.3;
  }
  if (o.title) {
    slide.addText(o.title, {
      x: o.x + px, y: cy, w: o.w - px * 2, h: o.titleH || 0.3, isTextBox: true, margin: 0,
      fontFace: o.titleSerif ? SERIF : SANS, fontSize: o.titleSize || 13.5, bold: !o.titleSerif,
      color: o.titleColor || C.navy, valign: 'middle',
    });
    cy += (o.titleH || 0.3) + 0.08;
  }
  if (o.body) {
    slide.addText(o.body, {
      x: o.x + px, y: cy, w: o.w - px * 2, h: o.y + o.h - cy - 0.2, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: o.bodySize || 11, color: o.bodyColor || C.body,
      lineSpacing: o.lineSpacing || 15.5, valign: 'top',
    });
  }
}

/** Full-width closing/summary band. */
function band(slide, o) {
  card(slide, { x: M, y: o.y, w: CW, h: o.h, fill: o.fill || C.pale, line: o.line || C.borderMid });
  slide.addText(o.kicker.toUpperCase(), {
    x: M + 0.32, y: o.y + 0.2, w: CW - 0.64, h: 0.22, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 8.5, bold: true, charSpacing: 1.8, color: o.kickerColor || C.gold, valign: 'middle',
  });
  slide.addText(o.text, {
    x: M + 0.32, y: o.y + 0.48, w: CW - 0.64, h: o.h - 0.66, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: o.size || 11.5, color: o.color || C.deepBlue, lineSpacing: 16, valign: 'top',
  });
}

/** Simple data table drawn as cells (full control over the design system). */
function table(slide, o) {
  const { x, y, w, cols, rows, headerH = 0.36, rowH = 0.52 } = o;
  const total = cols.reduce((a, c) => a + c.w, 0);
  const cw = cols.map((c) => (c.w / total) * w);
  slide.addShape(pres.ShapeType.rect, { x, y, w, h: headerH, fill: { color: C.navy }, line: { color: C.navy, width: 0.75 } });
  let cx = x;
  cols.forEach((c, i) => {
    slide.addText(c.label.toUpperCase(), {
      x: cx + 0.16, y, w: cw[i] - 0.32, h: headerH, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 8.5, bold: true, charSpacing: 1.5, color: C.white, valign: 'middle',
    });
    cx += cw[i];
  });
  rows.forEach((r, ri) => {
    const ry = y + headerH + ri * rowH;
    slide.addShape(pres.ShapeType.rect, {
      x, y: ry, w, h: rowH,
      fill: { color: ri % 2 ? C.soft : C.white }, line: { color: C.border, width: 0.75 },
    });
    let rx = x;
    r.forEach((cell, ci) => {
      const isObj = cell && typeof cell === 'object';
      slide.addText(isObj ? cell.t : cell, {
        x: rx + 0.16, y: ry, w: cw[ci] - 0.32, h: rowH, isTextBox: true, margin: 0,
        fontFace: SANS, fontSize: (isObj && cell.size) || 10.5, bold: !!(isObj && cell.b),
        color: (isObj && cell.c) || (ci === 0 ? C.navy : C.body), valign: 'middle', lineSpacing: 13.5,
      });
      rx += cw[ci];
    });
  });
}

const notes = (s, t) => s.addNotes(t);

/* =================== 01 · TITLE =================== */
{
  const s = pres.addSlide();
  s.background = { color: C.navy };
  s.addText('UPDATED WORKING SESSION', {
    x: M + 0.28, y: 1.28, w: 8, h: 0.28, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 11, bold: true, charSpacing: 3, color: C.gold, valign: 'middle',
  });
  s.addText('Ascend Family Vault', {
    x: M + 0.28, y: 1.72, w: 8.4, h: 0.92, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 46, color: C.white, valign: 'middle',
  });
  s.addText('From a broad concept to a focused 90-day validation plan.', {
    x: M + 0.28, y: 2.72, w: 7.8, h: 0.42, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 15, color: C.navySub, valign: 'middle',
  });
  s.addShape(pres.ShapeType.rect, {
    x: M + 0.28, y: 3.5, w: 5.9, h: 0.012, fill: { color: C.navyLine }, line: { color: C.navyLine, width: 0 },
  });
  [['Date', 'Thursday, August 27, 2026'],
   ['In the room', 'Eric Rice · Isaiah Harrison · Dana Ammons'],
   ['Observing', 'Serena Boykin']].forEach(([k, v], i) => {
    const yy = 3.78 + i * 0.36;
    s.addText(k.toUpperCase(), {
      x: M + 0.28, y: yy, w: 1.5, h: 0.28, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 8.5, bold: true, charSpacing: 1.6, color: C.navyLabel, valign: 'middle',
    });
    s.addText(v, {
      x: M + 1.86, y: yy, w: 5.6, h: 0.28, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 11, color: C.white, valign: 'middle',
    });
  });
  labelCard(s, {
    x: 8.5, y: 1.72, w: 4.21, h: 3.32, fill: C.deepBlue, line: C.navyLine,
    kicker: 'Today’s decision standard', kickerColor: C.gold,
    body: 'Select one commercial pilot, one complete product workflow, clear risk boundaries, and named ownership for the next seven days.\n\nWe are not approving a platform architecture today.',
    bodyColor: C.white, bodySize: 13, lineSpacing: 19,
  });
  chrome(s, true);
  notes(s, 'Open by validating the origin story, then set the decision standard out loud. Nothing on the agenda requires approving a finished platform.');
}

/* =================== 02 · AGENDA =================== */
{
  const s = pres.addSlide();
  head(s, 'How we will spend the time', 'Two hours, run to a decision standard',
    { sub: 'Each block ends with a named output. If a block does not produce its output, it gets an owner and a date rather than more discussion.' });
  table(s, {
    x: M, y: 2.14, w: CW,
    cols: [{ label: 'Time (ET)', w: 1.1 }, { label: 'Conversation', w: 2.3 }, { label: 'Facilitator prompt', w: 4.6 }, { label: 'Required output', w: 2.4 }],
    rows: [
      ['1:30 – 1:40', 'Opening and team roles', 'What decisions do Eric, Isaiah and Dana own? What is Serena observing?', 'Decision list and roles'],
      ['1:40 – 2:00', 'New evidence and origin cases', 'Where do consent, working capital and coordination break down?', 'Core pain and pilot criteria'],
      ['2:00 – 2:20', 'Prototype walkthrough', 'What works, what partly works, and what does not work?', 'Stabilize-versus-rebuild inputs'],
      ['2:20 – 2:45', 'Market entry choice', 'Which use case is closest to pain, proof and payment?', 'Lead wedge'],
      ['2:45 – 3:10', 'MVP and guardrails', 'What must the product do — and what must it never imply?', 'MVP, exclusions and boundaries'],
      ['3:10 – 3:25', '90-day validation', 'What evidence must the Class of 1997 pilot and the Oklahoma consent test produce?', 'Research and pilot plan'],
      ['3:25 – 3:30', 'Commitments', 'Who owns what, by when?', 'Seven-day action list'],
    ],
    rowH: 0.5,
  });
  band(s, {
    y: 6.02, h: 0.82, fill: C.soft, line: C.border, kicker: 'Optional extension · 3:30 – 4:30 PM ET', kickerColor: C.deepBlue,
    text: 'Product, team and engagement: technical reality, capacity, working cadence and scope.',
  });
  chrome(s);
  notes(s, 'Hold the extension only if the core two hours produced their outputs.');
}

/* =================== 03 · NEW EVIDENCE =================== */
{
  const s = pres.addSlide();
  head(s, 'New evidence', 'What Eric’s answers changed',
    { sub: 'Three follow-up answers replaced assumptions with operating facts — and they move the decision.' });
  const cw = (CW - 0.44) / 3;
  [['Prototype reality', 'Projects can be created and partly configured. A four-person insurance-bill project exists. App email works.'],
   ['Not operational', 'Stripe is not connected. Vaults, document handling and estate functions are not set up.'],
   ['Commercial signal', 'Class of 1997 accepted a $75-per-person graduation-box concept, subject to a minimum quantity.'],
  ].forEach(([t, b], i) => {
    labelCard(s, {
      x: M + i * (cw + 0.22), y: 2.24, w: cw, h: 2.06,
      kicker: ['Confirmed', 'Blocked', 'Demand'][i], title: t, titleSize: 15, titleH: 0.32,
      body: b, bodySize: 11.5, lineSpacing: 16.5,
    });
  });
  band(s, {
    y: 4.62, h: 1.42, kicker: 'Revised conclusion',
    text: 'Ascend is an early functional prototype — not yet a secure, transaction-ready MVP. The fastest validation path is a service-led Class of 1997 pilot paired with a disciplined prototype audit.',
    size: 13,
  });
  chrome(s);
  notes(s, 'Do not debate the vision here. Establish the facts, then let the facts choose the pilot.');
}

/* =================== 04 · CAPABILITY MAP =================== */
{
  const s = pres.addSlide();
  head(s, 'Product readiness', 'Current capability map',
    { sub: 'Separate what the site does today from what is mocked up and what is still an idea.' });
  const cw = (CW - 0.44) / 3;
  [['Working now', 'Create projects · populate some criteria · receive app emails', C.blue, C.pale, C.borderMid],
   ['Partial or unknown', 'End-to-end project flow · roles · dashboards · reminders · data persistence', C.gold, C.soft, C.border],
   ['Not working', 'Stripe connection · vaults · document handling · estate functions', C.body, C.white, C.border],
  ].forEach(([t, b, kc, fill, line], i) => {
    labelCard(s, {
      x: M + i * (cw + 0.22), y: 2.14, w: cw, h: 1.9, fill, line,
      kicker: t, kickerColor: kc, body: b, bodySize: 12, lineSpacing: 18,
    });
  });
  labelCard(s, {
    x: M, y: 4.34, w: CW, h: 1.68, fill: C.navy, line: C.navy,
    kicker: 'Decision today', kickerColor: C.gold,
    title: 'Stabilize the current build, or rebuild around one complete workflow',
    titleColor: C.white, titleSerif: true, titleSize: 19, titleH: 0.36,
    body: 'Required walkthrough for every screen:  working screen  →  data captured  →  manual workaround  →  break point  →  owner.',
    bodyColor: C.navySub, bodySize: 11.5,
  });
  chrome(s);
  notes(s, 'Isaiah owns the inventory. One hour a week is enough to document, not to build.');
}

/* =================== 05 · CLASS OF 1997 ECONOMICS =================== */
{
  const s = pres.addSlide();
  head(s, 'Commercial pilot', 'Class of 1997: real demand, incomplete economics',
    { sub: 'The demand signal is credible. The margin is not yet a number we can stand behind.' });
  const cw = (CW - 0.44) / 3;
  [['Initial offer', '$75', 'Graduation box, per person'],
   ['Product estimate', '~$50', 'Approximate product ideas'],
   ['Visible spread', '$25', 'Per person, before omitted costs'],
  ].forEach(([k, v, l], i) => {
    const x = M + i * (cw + 0.22);
    card(s, { x, y: 2.2, w: cw, h: 1.62, fill: i === 2 ? C.pale : C.soft, line: i === 2 ? C.borderMid : C.border });
    s.addText(k.toUpperCase(), {
      x: x + 0.28, y: 2.42, w: cw - 0.56, h: 0.22, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 8.5, bold: true, charSpacing: 1.8, color: C.gold, valign: 'middle',
    });
    s.addText(v, {
      x: x + 0.28, y: 2.72, w: cw - 0.56, h: 0.6, isTextBox: true, margin: 0,
      fontFace: SERIF, fontSize: 34, color: C.navy, valign: 'middle',
    });
    s.addText(l, {
      x: x + 0.28, y: 3.34, w: cw - 0.56, h: 0.26, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: C.light, valign: 'middle',
    });
  });
  s.addText('Do not call the $25 spread profit yet — eight costs are still unpriced', {
    x: M, y: 4.06, w: CW, h: 0.32, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 16, color: C.deepBlue, valign: 'middle',
  });
  const items = ['Freight and duties', 'Design labor', 'Licensing', 'Samples and QA',
    'Packing and fulfillment', 'Payment fees', 'Refunds and rework', 'Eric’s project time'];
  const chipW = (CW - 0.21 * 3) / 4;
  items.forEach((t, i) => {
    const cx = M + (i % 4) * (chipW + 0.21);
    const cy = 4.52 + Math.floor(i / 4) * 0.66;
    card(s, { x: cx, y: cy, w: chipW, h: 0.54, fill: C.white, line: C.border });
    s.addText(t, {
      x: cx + 0.2, y: cy, w: chipW - 0.4, h: 0.54, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 11, color: C.body, valign: 'middle',
    });
  });
  band(s, {
    y: 5.94, h: 0.88, fill: C.navy, line: C.navy, kicker: 'Before we approve a price', kickerColor: C.gold,
    text: 'Confirm quantity   ·   minimum order   ·   deposit terms   ·   landed cost   ·   licensing pathway   ·   decision maker',
    color: C.white, size: 12,
  });
  chrome(s);
  notes(s, 'Ask Eric for quantity, deposit terms, decision maker and the licensing pathway before any price is confirmed.');
}

/* =================== 06 · OKLAHOMA =================== */
{
  const s = pres.addSlide();
  head(s, 'Origin case', 'Oklahoma land: trust before transactions',
    { sub: 'The land case is the reason this concept exists. It is not yet a committed pilot.' });
  const cw = (CW - 0.44) / 3;
  [['What is true', 'Eric can create the project. The family has not agreed. He expects pushback, because the request involves money and a new process.'],
   ['What that means', 'The first design challenge is consent, clarity and trust — not payment collection or automated ownership.'],
   ['First test', 'A one-page family project charter: purpose, benefit, scope, estimated cost, decision method, contribution options, reporting promise and opt-in process.'],
  ].forEach(([t, b], i) => {
    labelCard(s, {
      x: M + i * (cw + 0.22), y: 2.24, w: cw, h: 2.24,
      kicker: `0${i + 1}`, title: t, titleSize: 15, titleH: 0.32, titleSerif: false,
      body: b, bodySize: 11.5, lineSpacing: 16.5,
    });
  });
  band(s, {
    y: 4.8, h: 1.24, fill: C.navy, line: C.navy, kicker: 'Boundary', kickerColor: C.gold,
    text: 'Record family-approved project information. Do not infer or certify legal ownership.',
    color: C.white, size: 14,
  });
  chrome(s);
  notes(s, 'Listening conversations come before any fundraising request. Consent is the product problem here.');
}

/* =================== 07 · OPERATING MODEL =================== */
{
  const s = pres.addSlide();
  head(s, 'Operating model', 'One engine, two sequenced proving grounds',
    { sub: 'Two markets, one product. Sequence the tests rather than forcing both into the same launch.' });
  labelCard(s, {
    x: M, y: 2.2, w: CW, h: 1.24, fill: C.navy, line: C.navy,
    kicker: 'Common engine', kickerColor: C.gold,
    body: 'Goal  ·  roles  ·  budget  ·  commitments  ·  tasks  ·  approvals  ·  expenses  ·  progress  ·  closeout',
    bodyColor: C.white, bodySize: 14, lineSpacing: 20,
  });
  const cw = (CW - 0.26) / 2;
  [['1  Commercial proving ground', 'Class of 1997 graduation-box service pilot — tests willingness to pay, sourcing workflow, deposits, cost control, communications and fulfillment.', C.pale, C.borderMid],
   ['2  Requirements proving ground', 'Oklahoma land case — tests consent, roles, shared decisions, transparency and reporting, without legal-title claims or platform custody of funds.', C.soft, C.border],
  ].forEach(([t, b, fill, line], i) => {
    labelCard(s, {
      x: M + i * (cw + 0.26), y: 3.7, w: cw, h: 1.92, fill, line,
      title: t, titleSize: 15, titleH: 0.34, titleColor: C.deepBlue,
      body: b, bodySize: 11.5, lineSpacing: 17,
    });
  });
  s.addText('Sequence the tests. Do not force both into the same launch.', {
    x: M, y: 5.82, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 14, italic: true, color: C.deepBlue, valign: 'middle',
  });
  chrome(s);
  notes(s, 'The engine is the asset. Each proving ground stresses a different part of it.');
}

/* =================== 08 · MARKET ENTRY =================== */
{
  const s = pres.addSlide();
  head(s, 'Market entry', 'Where to lead, and what to park',
    { sub: 'Five candidates, ranked on pain, founder advantage, revenue speed and complexity.' });
  table(s, {
    x: M, y: 2.14, w: CW,
    cols: [{ label: 'Candidate', w: 2.6 }, { label: 'Pain', w: 1.9 }, { label: 'Founder advantage', w: 1.9 },
           { label: 'Revenue speed', w: 1.5 }, { label: 'Complexity', w: 1.9 }, { label: 'Internal read', w: 2.5 }],
    rows: [
      ['Reunion and Homecoming concierge', 'High for volunteer organizers', 'Very high', 'Near term', 'Moderate', { t: 'Lead commercial proving ground', b: true, c: C.navy }],
      ['Family property improvement', 'High but episodic', 'High authenticity', 'Slower', 'High', { t: 'Design partner and requirements case', b: true, c: C.navy }],
      ['General trips and shared goals', 'Variable', 'Limited differentiation', 'Unclear', 'Moderate', 'Do not lead'],
      ['College or family fund', 'Meaningful', 'Unproven', 'Slower', 'High financial sensitivity', 'Later validation lane'],
      ['Business or startup funding', 'Potentially high', 'Unproven', 'Longer term', 'Very high regulatory complexity', 'Exclude from initial MVP'],
    ],
    rowH: 0.62,
  });
  band(s, {
    y: 5.5, h: 0.94, fill: C.soft, line: C.border, kicker: 'Parking lot rule', kickerColor: C.deepBlue,
    text: 'A valuable idea does not have to enter the MVP. Capture it, name the evidence it would require, and assign a review date.',
  });
  chrome(s);
  notes(s, 'The point of this slide is the parking, not the ranking. Get an explicit "we are not doing this yet".');
}

/* =================== 09 · MVP BOUNDARY =================== */
{
  const s = pres.addSlide();
  head(s, 'Product definition', 'The MVP boundary: in, and deliberately out',
    { sub: 'The MVP must reduce organizer burden and increase participant confidence. It does not need to become a bank, title company or marketplace.' });
  const cw = (CW - 0.3) / 2;
  card(s, { x: M, y: 2.3, w: cw, h: 3.5, fill: C.pale, line: C.borderMid });
  card(s, { x: M + cw + 0.3, y: 2.3, w: cw, h: 3.5, fill: C.white, line: C.border });
  s.addText('IN THE FIRST TESTABLE WORKFLOW', {
    x: M + 0.3, y: 2.54, w: cw - 0.6, h: 0.24, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 9, bold: true, charSpacing: 1.8, color: C.blue, valign: 'middle',
  });
  s.addText('EXPLICITLY LATER, OR OUT OF SCOPE', {
    x: M + cw + 0.6, y: 2.54, w: cw - 0.6, h: 0.24, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 9, bold: true, charSpacing: 1.8, color: C.gold, valign: 'middle',
  });
  const inList = ['Project setup — goal, target, dates, milestones, organizer',
    'Member roles — organizer, approver, contributor, viewer, vendor',
    'Commitment ledger — amount, due date, status, reminders',
    'Budget and expense log — approved, actual, receipt, remaining',
    'Task and decision log — owner, due date, approval, evidence',
    'Progress dashboard — milestones, variance, updates',
    'Closeout — final budget, open items, archive'];
  const outList = ['Automated legal ownership determination from deeds or probate',
    'Ascend custody of pooled money, stored value or direct lending',
    'Investment returns, securities matching or a fundraising marketplace',
    'A broad vendor marketplace before repeatable demand exists',
    'Inventory ownership, travel operations or unlicensed institutional marks',
    'AI recommendations on sensitive family data without consent and governance'];
  s.addText(inList.map((t, i) => ({ text: t, options: { bullet: { characterCode: '2014' }, breakLine: i < inList.length - 1 } })), {
    x: M + 0.3, y: 2.92, w: cw - 0.6, h: 2.7, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 11, color: C.deepBlue, lineSpacing: 15, paraSpaceAfter: 7, valign: 'top',
  });
  s.addText(outList.map((t, i) => ({ text: t, options: { bullet: { characterCode: '2014' }, breakLine: i < outList.length - 1 } })), {
    x: M + cw + 0.6, y: 2.92, w: cw - 0.6, h: 2.7, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 11, color: C.body, lineSpacing: 15, paraSpaceAfter: 7, valign: 'top',
  });
  s.addText('MVP job to be done: help an organizer turn one shared objective into a transparent plan participants can understand, support, monitor and complete.', {
    x: M, y: 6.02, w: CW, h: 0.4, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 13.5, italic: true, color: C.deepBlue, valign: 'middle',
  });
  chrome(s);
  notes(s, 'The right-hand column is the more valuable half of this slide. Get agreement on the exclusions.');
}

/* =================== 10 · GUARDRAILS =================== */
{
  const s = pres.addSlide();
  head(s, 'Risk architecture', 'Four guardrails to confirm today',
    { sub: 'These are design decisions, not reasons to stop. Define the boundary early, then validate it with qualified counsel.' });
  const cw = (CW - 0.3) / 2, ch = 1.5;
  [['Ownership', 'Family-supplied project allocations are not automatically verified legal title. Display them with clear status and source.'],
   ['Payments', 'Use qualified payment infrastructure. Do not assume Ascend should hold pooled funds or stored value.'],
   ['Data', 'Collect only what is needed. Define access, consent, retention, deletion and prohibited uses before launch.'],
   ['Partners and capital', 'Use permission-based introductions. Do not sell family financial data or promise outcomes.'],
  ].forEach(([t, b], i) => {
    labelCard(s, {
      x: M + (i % 2) * (cw + 0.3), y: 2.22 + Math.floor(i / 2) * (ch + 0.24), w: cw, h: ch,
      fill: i % 3 === 0 ? C.soft : C.white, line: C.border,
      kicker: `0${i + 1}`, kickerColor: C.blue,
      title: t, titleSerif: true, titleSize: 18, titleH: 0.34, titleColor: C.navy,
      body: b, bodySize: 11.5, lineSpacing: 16,
    });
  });
  band(s, {
    y: 5.68, h: 1.06, fill: C.navy, line: C.navy, kicker: 'Language guardrail', kickerColor: C.gold,
    text: 'Ascend records family-approved information and project activity. It does not determine legal ownership, provide legal advice, hold client funds or promise financial outcomes.',
    color: C.white, size: 12,
  });
  chrome(s);
  notes(s, 'Read the language guardrail out loud. It is the sentence that protects the brand and the client relationship.');
}

/* =================== 11 · TEAM =================== */
{
  const s = pres.addSlide();
  head(s, 'Team capacity', 'Decision rights and realistic ownership',
    { sub: 'Name who decides, who builds, who validates and who protects each workstream.' });
  const cw = (CW - 0.66) / 4;
  [['Eric Rice', 'Founder', 'Founder vision · domain process · family and alumni access · vendor relationships · final decisions'],
   ['Isaiah Harrison', 'Adviser · 1+ hr/week', 'Business and software assessment · prototype inventory · technical recommendations'],
   ['Dana Ammons', 'Value Growth Partners', 'Strategy · validation design · commercial model · operating discipline · decision documentation'],
   ['Serena Boykin', 'Observer today', 'Ongoing role, access, confidentiality and decision authority still to be confirmed'],
  ].forEach(([n, r, b], i) => {
    labelCard(s, {
      x: M + i * (cw + 0.22), y: 2.2, w: cw, h: 2.7,
      fill: i === 3 ? C.soft : C.white, line: C.border,
      kicker: r, kickerColor: i === 3 ? C.light : C.gold,
      title: n, titleSerif: true, titleSize: 18, titleH: 0.36,
      body: b, bodySize: 11, lineSpacing: 16,
    });
  });
  band(s, {
    y: 5.2, h: 1.0, fill: C.pale, line: C.borderMid, kicker: 'Capacity guardrail',
    text: 'One hour per week is advisory capacity — not a development team. Confirm decision rights, IP ownership and who is accountable for the build.',
    size: 12.5,
  });
  chrome(s);
  notes(s, 'Serena’s confidentiality status and ongoing role need an explicit answer today.');
}

/* =================== 12 · 90-DAY PLAN =================== */
{
  const s = pres.addSlide();
  head(s, 'Execution plan', 'Ninety days to a build, partner or pause decision',
    { sub: 'Each stage ends at a gate. The gate is passed with evidence, not enthusiasm.' });
  const steps = [
    ['Days 1–14', 'Aug 27 – Sep 9', 'Focus the concept', 'Approve one lead wedge and positioning'],
    ['Days 15–30', 'Sep 10 – Sep 25', 'Build the validation system', 'Approve top workflows and pilot concept'],
    ['Days 31–45', 'Sep 26 – Oct 10', 'Run the field test', 'Decide whether demand supports a paid pilot'],
    ['Days 46–60', 'Oct 11 – Oct 26', 'Convert evidence', 'Approve pilot scope, architecture and terms'],
    ['Days 61–75', 'Oct 27 – Nov 10', 'Prepare the pilot', 'Confirm burden reduction and repeatability'],
    ['Days 76–90', 'Nov 11 – Nov 25', 'Build and capital decision', 'Bootstrap, partner, accelerate, fundraise or pause'],
  ];
  const cw = (CW - 0.15 * 5) / 6;
  steps.forEach(([d, dates, obj, gate], i) => {
    const x = M + i * (cw + 0.15);
    card(s, { x, y: 2.2, w: cw, h: 3.06, fill: i === 2 ? C.pale : C.white, line: i === 2 ? C.borderMid : C.border });
    s.addText(d, {
      x: x + 0.2, y: 2.42, w: cw - 0.4, h: 0.28, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 11.5, bold: true, color: C.navy, valign: 'middle',
    });
    s.addText(dates, {
      x: x + 0.2, y: 2.7, w: cw - 0.4, h: 0.24, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 9, color: C.light, valign: 'middle',
    });
    s.addText(obj, {
      x: x + 0.2, y: 3.06, w: cw - 0.4, h: 0.76, isTextBox: true, margin: 0,
      fontFace: SERIF, fontSize: 15, color: C.deepBlue, valign: 'top', lineSpacing: 18,
    });
    s.addText('GATE', {
      x: x + 0.2, y: 3.94, w: cw - 0.4, h: 0.22, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 8, bold: true, charSpacing: 1.6, color: C.gold, valign: 'middle',
    });
    s.addText(gate, {
      x: x + 0.2, y: 4.2, w: cw - 0.4, h: 1.0, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 10.5, color: C.body, lineSpacing: 14.5, valign: 'top',
    });
  });
  band(s, {
    y: 5.5, h: 1.16, fill: C.navy, line: C.navy, kicker: 'Evidence targets by November 25', kickerColor: C.gold,
    text: '75+ survey responses   ·   15 interviews   ·   5 qualified pilot candidates   ·   2 written commitments   ·   1 paid or fully scoped pilot',
    color: C.white, size: 12,
  });
  chrome(s);
  notes(s, 'October 10 Morehouse Homecoming is a structured field test, not a launch or a fundraising event.');
}

/* =================== 13 · DECISION BOARD =================== */
{
  const s = pres.addSlide();
  head(s, 'Decision board', 'Six decisions to make before we close',
    { sub: 'A decision is made when it has a named answer, an owner and a review date.' });
  const items = [
    ['First customer', 'Class of 1997, a family organizer, or another affinity group'],
    ['First complete workflow', 'Project setup through closeout — what must work end to end'],
    ['Prototype path', 'Stabilize the current build, or rebuild'],
    ['Pilot economics', 'Quantity, deposit, landed cost, labor and approvals'],
    ['Risk posture', 'Payments, ownership records, sensitive data and partner access'],
    ['Team model', 'Decision rights, IP, weekly capacity and outside experts'],
  ];
  const cw = (CW - 0.5) / 3, ch = 1.86;
  items.forEach(([t, b], i) => {
    const x = M + (i % 3) * (cw + 0.25);
    const y = 2.24 + Math.floor(i / 3) * (ch + 0.26);
    card(s, { x, y, w: cw, h: ch, fill: C.white, line: C.border });
    s.addText(String(i + 1).padStart(2, '0'), {
      x: x + 0.28, y: y + 0.22, w: 0.8, h: 0.36, isTextBox: true, margin: 0,
      fontFace: SERIF, fontSize: 22, color: C.blue, valign: 'middle',
    });
    s.addText(t, {
      x: x + 0.28, y: y + 0.64, w: cw - 0.56, h: 0.32, isTextBox: true, margin: 0,
      fontFace: SERIF, fontSize: 17, color: C.navy, valign: 'middle',
    });
    s.addText(b, {
      x: x + 0.28, y: y + 1.0, w: cw - 0.56, h: 0.56, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 11, color: C.body, lineSpacing: 15, valign: 'top',
    });
  });
  s.addText('Anything we cannot resolve today leaves this room with an owner, an evidence request and a date.', {
    x: M, y: 6.34, w: CW, h: 0.34, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 14, italic: true, color: C.deepBlue, valign: 'middle',
  });
  chrome(s);
  notes(s, 'Work the board in order. Park anything that cannot be resolved with an owner and a date.');
}

/* =================== 14 · CLOSE =================== */
{
  const s = pres.addSlide();
  s.background = { color: C.navy };
  s.addText('CLOSE', {
    x: M + 0.28, y: 0.62, w: 6, h: 0.26, isTextBox: true, margin: 0,
    fontFace: SANS, fontSize: 10, bold: true, charSpacing: 2.6, color: C.gold, valign: 'middle',
  });
  s.addText('The next seven days', {
    x: M + 0.28, y: 0.94, w: 8, h: 0.62, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 34, color: C.white, valign: 'middle',
  });
  const rows = [
    ['Eric', 'Prototype access  ·  Class of 1997 order assumptions  ·  Oklahoma project inputs'],
    ['Isaiah', 'Technical audit  ·  stabilize-versus-rebuild recommendation  ·  one-hour weekly plan'],
    ['Dana', 'Decision summary  ·  interview guide  ·  evidence tracker  ·  pilot scope framework'],
    ['Team', 'Confirm weekly cadence  ·  shared source of truth  ·  next decision date'],
  ];
  rows.forEach(([who, what], i) => {
    const y = 2.0 + i * 0.84;
    s.addShape(pres.ShapeType.rect, {
      x: M + 0.28, y, w: CW - 0.56, h: 0.7,
      fill: { color: C.deepBlue }, line: { color: C.navyLine, width: 0.75 },
    });
    s.addText(String(i + 1).padStart(2, '0'), {
      x: M + 0.56, y, w: 0.5, h: 0.7, isTextBox: true, margin: 0,
      fontFace: SERIF, fontSize: 17, color: C.gold, valign: 'middle',
    });
    s.addText(who.toUpperCase(), {
      x: M + 1.16, y, w: 1.5, h: 0.7, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 11, bold: true, charSpacing: 2, color: C.white, valign: 'middle',
    });
    s.addText(what, {
      x: M + 2.86, y, w: CW - 3.42, h: 0.7, isTextBox: true, margin: 0,
      fontFace: SANS, fontSize: 12, color: C.navySub, valign: 'middle',
    });
  });
  s.addText('What will Ascend deliberately not build, not promise and not pursue during the next 90 days?', {
    x: M + 0.28, y: 5.68, w: CW - 0.56, h: 0.46, isTextBox: true, margin: 0,
    fontFace: SERIF, fontSize: 19, italic: true, color: C.white, valign: 'middle',
  });
  chrome(s, true);
  notes(s, 'End on the close question. The answer becomes the first line of the decision summary.');
}

pres.writeFile({ fileName: process.argv[2] }).then((f) => console.log('written', f));
