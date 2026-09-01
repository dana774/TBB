'use strict';
/**
 * normalization.test.js — dedup, Candidate/unverified behavior, founder routing
 * safety, DRAFT_ONLY enforcement, missing-email + empty-sheet behavior, and
 * trigger cleanup.
 * Run: node --test
 */

const { test } = require('node:test');
const assert = require('node:assert');
const H = require('./harness');

function fakeMessage(opts) {
  return {
    getSubject: function () { return opts.subject; },
    getBody: function () { return opts.body; },
    getFrom: function () { return opts.from || 'Google Alerts <googlealerts-noreply@google.com>'; },
    getDate: function () { return opts.date || new Date(2026, 6, 1, 9, 0, 0); },
    getId: function () { return opts.id || 'msg-1'; }
  };
}

/* -------------------- Candidate / unverified behavior -------------------- */

test('normalizeMessage_ marks a fresh dated signal Candidate / unverified (never Open now)', function () {
  const { api } = H.load(function (state) {
    state.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    state.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [H.FOUNDER_HEADERS]);
  });
  const msg = fakeMessage({
    subject: 'Applications open: women founders beauty grant',
    body: 'A $50,000 non-dilutive grant for women-owned skincare brands. Deadline September 30, 2026. https://example.org/apply'
  });
  const n = api.normalizeMessage_(msg, 'https://mail.google.com/mail/u/0/#all/msg-1', 'RUN-TEST');
  assert.strictEqual(n.isSignal, true);
  assert.strictEqual(n.opportunity.current_status, 'Candidate / unverified');
  assert.notStrictEqual(n.opportunity.current_status, 'Open now');
  assert.strictEqual(n.opportunity.verification_status, 'Candidate');
  assert.ok(!api.isCurrentStatus_(n.opportunity.current_status)); // cannot be auto-pushed
});

test('noise signals (winners announced, hiring) are filtered out', function () {
  const { api } = H.load(function (state) {
    state.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    state.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [H.FOUNDER_HEADERS]);
  });
  const msg = fakeMessage({ subject: 'Grant winners announced for beauty founders', body: 'recap of winners' });
  const n = api.normalizeMessage_(msg, 'url', 'RUN-TEST');
  assert.strictEqual(n.isSignal, false);
});

/* -------------------- duplicate detection -------------------- */

test('duplicateOpportunity_ detects by source url or by opportunity name', function () {
  const { api } = H.load();
  const master = H.makeSheet('03_Opportunity_Master', [
    H.MASTER_HEADERS,
    (function () { const r = new Array(H.MASTER_HEADERS.length).fill('');
      r[H.MASTER_HEADERS.indexOf('source_doc_url')] = 'https://mail/x';
      r[H.MASTER_HEADERS.indexOf('opportunity_name')] = 'Cartier Women\'s Initiative';
      return r; })()
  ]);
  assert.strictEqual(api.duplicateOpportunity_(master, { source_doc_url: 'https://mail/x', opportunity_name: 'Different' }), true);
  assert.strictEqual(api.duplicateOpportunity_(master, { source_doc_url: 'https://mail/y', opportunity_name: "cartier women's initiative" }), true);
  assert.strictEqual(api.duplicateOpportunity_(master, { source_doc_url: 'https://mail/y', opportunity_name: 'Brand new' }), false);
});

test('duplicateOpportunity_ is safe on an empty sheet', function () {
  const { api } = H.load();
  const empty = H.makeSheet('03_Opportunity_Master', [H.MASTER_HEADERS]);
  assert.strictEqual(api.duplicateOpportunity_(empty, { source_doc_url: 'u', opportunity_name: 'n' }), false);
});

/* -------------------- founder routing safety -------------------- */

test('getFounderMatches_ excludes inactive, unapproved, and missing-email founders', function () {
  const { api } = H.load(function (state) {
    state.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    state.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [
      H.FOUNDER_HEADERS,
      ['Active OK', 'A', 'ok@a.co', 'Beauty', 'Beauty', '', '', 'Active', 'TRUE'],
      ['Inactive', 'B', 'no@b.co', 'Beauty', 'Beauty', '', '', 'Inactive', 'TRUE'],
      ['Not approved', 'C', 'no@c.co', 'Beauty', 'Beauty', '', '', 'Active', 'FALSE'],
      ['No email', 'D', '', 'Beauty', 'Beauty', '', '', 'Active', 'TRUE'],
      ['Bad email', 'E', 'not-an-email', 'Beauty', 'Beauty', '', '', 'Active', 'TRUE']
    ]);
  });
  const matches = api.getFounderMatches_(['Beauty']);
  assert.strictEqual(matches.length, 1);
  assert.strictEqual(matches[0].email, 'ok@a.co');
});

test('getFounderMatches_ returns [] on an empty founder sheet (headers only)', function () {
  const { api } = H.load(function (state) {
    state.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    state.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [H.FOUNDER_HEADERS]);
  });
  assert.strictEqual(api.getFounderMatches_(['Beauty']).length, 0);
});

/* -------------------- DRAFT_ONLY enforcement -------------------- */

test('createTierADrafts throws when auto_push_mode is not DRAFT_ONLY', function () {
  const { api } = H.load(function (state) {
    state.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows({ auto_push_mode: 'SEND' }));
    state.sheets['12_Tier_A_Push_Queue'] = H.makeSheet('12_Tier_A_Push_Queue', [H.PUSH_QUEUE_HEADERS]);
    state.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [H.FOUNDER_HEADERS]);
  });
  assert.throws(function () { api.createTierADrafts(); }, /not enabled|DRAFT_ONLY/);
});

test('createTierADrafts creates a Gmail DRAFT (never sends) when a mapped founder exists', function () {
  const { api, state } = H.load(function (s) {
    s.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    s.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [
      H.FOUNDER_HEADERS,
      ['Ada', 'GlowCo', 'ada@glow.co', 'Beauty', 'Beauty', '', '', 'Active', 'TRUE']
    ]);
    const q = new Array(H.PUSH_QUEUE_HEADERS.length).fill('');
    q[H.PUSH_QUEUE_HEADERS.indexOf('opportunity_id')] = 'OPP-1';
    q[H.PUSH_QUEUE_HEADERS.indexOf('opportunity_name')] = 'Beauty Grant';
    q[H.PUSH_QUEUE_HEADERS.indexOf('subject_line')] = 'Funding Alert: Beauty Grant';
    q[H.PUSH_QUEUE_HEADERS.indexOf('email_body')] = 'Body';
    q[H.PUSH_QUEUE_HEADERS.indexOf('founder_segments')] = 'Beauty';
    q[H.PUSH_QUEUE_HEADERS.indexOf('draft_status')] = 'Queued for draft';
    s.sheets['12_Tier_A_Push_Queue'] = H.makeSheet('12_Tier_A_Push_Queue', [H.PUSH_QUEUE_HEADERS, q]);
  });
  const drafts = api.createTierADrafts();
  assert.strictEqual(drafts, 1);
  assert.strictEqual(state.drafts.length, 1);
  assert.strictEqual(state.drafts[0].to, 'dana@valugrowthpartners.com');
  assert.strictEqual(state.drafts[0].options.bcc, 'ada@glow.co');
});

test('createTierADrafts creates NO draft and flags row when no approved founder maps', function () {
  const { api, state } = H.load(function (s) {
    s.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    s.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [H.FOUNDER_HEADERS]); // empty
    const q = new Array(H.PUSH_QUEUE_HEADERS.length).fill('');
    q[H.PUSH_QUEUE_HEADERS.indexOf('opportunity_id')] = 'OPP-1';
    q[H.PUSH_QUEUE_HEADERS.indexOf('founder_segments')] = 'Beauty';
    q[H.PUSH_QUEUE_HEADERS.indexOf('draft_status')] = 'Queued for draft';
    s.sheets['12_Tier_A_Push_Queue'] = H.makeSheet('12_Tier_A_Push_Queue', [H.PUSH_QUEUE_HEADERS, q]);
  });
  const drafts = api.createTierADrafts();
  assert.strictEqual(drafts, 0);
  assert.strictEqual(state.drafts.length, 0);
  assert.strictEqual(state.sheets['12_Tier_A_Push_Queue']._data[1][H.PUSH_QUEUE_HEADERS.indexOf('draft_status')], 'Needs founder mapping');
});

/* -------------------- empty sheet behavior -------------------- */

test('scoreOpportunitiesV2 no-ops on a header-only master sheet', function () {
  const { api } = H.load(function (s) {
    s.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    s.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [H.FOUNDER_HEADERS]);
    s.sheets['03_Opportunity_Master'] = H.makeSheet('03_Opportunity_Master', [H.MASTER_HEADERS]);
  });
  assert.doesNotThrow(function () { api.scoreOpportunitiesV2(); });
});

test('buildTierAPushQueue no-ops on a header-only master sheet', function () {
  const { api } = H.load(function (s) {
    s.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    s.sheets['03_Opportunity_Master'] = H.makeSheet('03_Opportunity_Master', [H.MASTER_HEADERS]);
    s.sheets['12_Tier_A_Push_Queue'] = H.makeSheet('12_Tier_A_Push_Queue', [H.PUSH_QUEUE_HEADERS]);
  });
  assert.doesNotThrow(function () { api.buildTierAPushQueue(); });
});

/* -------------------- scoring writes a contiguous V2 block -------------------- */

test('scoreOpportunitiesV2 writes tier + auto_push_eligible for a current verified Tier A row', function () {
  // Near deadline (5 days out) drives urgency to 100; $500k drives capital to 100.
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  const soon = new Date(); soon.setDate(soon.getDate() + 5);
  const deadlineStr = months[soon.getMonth()] + ' ' + soon.getDate() + ', ' + soon.getFullYear();
  const { api, state } = H.load(function (s) {
    s.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    s.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [
      H.FOUNDER_HEADERS,
      ['Ada', 'GlowCo', 'ada@glow.co', 'Beauty', 'Beauty', '', '', 'Active', 'TRUE']
    ]);
    const r = new Array(H.MASTER_HEADERS.length).fill('');
    const set = function (h, v) { r[H.MASTER_HEADERS.indexOf(h)] = v; };
    set('opportunity_id', 'OPP-1');
    set('opportunity_name', 'Women founders beauty skincare grant');
    set('industry_focus', 'Beauty / personal care');
    set('founder_tags', 'Women founders; Beauty founders');
    set('offer_amount', '$500,000');
    set('offer_type', 'Grant / non-dilutive');
    set('deadline', deadlineStr);
    set('current_status', 'Open now');
    set('official_source_url', 'https://official.example/apply');
    set('verification_status', 'Verified');
    set('confidence', 'High');
    s.sheets['03_Opportunity_Master'] = H.makeSheet('03_Opportunity_Master', [H.MASTER_HEADERS, r]);
  });
  api.scoreOpportunitiesV2();
  const row = state.sheets['03_Opportunity_Master']._data[1];
  const tier = row[H.MASTER_HEADERS.indexOf('tier')];
  const eligible = row[H.MASTER_HEADERS.indexOf('auto_push_eligible')];
  assert.strictEqual(tier, 'Tier A');
  assert.strictEqual(eligible, 'TRUE');
});

test('a Candidate / unverified row is never auto_push_eligible even at a high score', function () {
  const { api, state } = H.load(function (s) {
    s.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    s.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [
      H.FOUNDER_HEADERS,
      ['Ada', 'GlowCo', 'ada@glow.co', 'Beauty', 'Beauty', '', '', 'Active', 'TRUE']
    ]);
    const r = new Array(H.MASTER_HEADERS.length).fill('');
    const set = function (h, v) { r[H.MASTER_HEADERS.indexOf(h)] = v; };
    set('opportunity_id', 'OPP-2');
    set('opportunity_name', 'Women founders beauty skincare grant');
    set('industry_focus', 'Beauty / personal care');
    set('offer_amount', '$500,000');
    set('offer_type', 'Grant / non-dilutive');
    set('deadline', 'September 30, 2026');
    set('current_status', 'Candidate / unverified'); // not current
    set('official_source_url', ''); // not verified
    s.sheets['03_Opportunity_Master'] = H.makeSheet('03_Opportunity_Master', [H.MASTER_HEADERS, r]);
  });
  api.scoreOpportunitiesV2();
  const row = state.sheets['03_Opportunity_Master']._data[1];
  assert.strictEqual(row[H.MASTER_HEADERS.indexOf('auto_push_eligible')], 'FALSE');
});

/* -------------------- existing trigger cleanup -------------------- */

test('installRequiredTriggers_ removes duplicates and installs exactly one of each', function () {
  const { api, state } = H.load(function (s) {
    // Pre-seed duplicate daily/weekly triggers plus an unrelated one.
    s.triggers = [
      { getHandlerFunction: function () { return 'runDailyFundingSweep'; } },
      { getHandlerFunction: function () { return 'runDailyFundingSweep'; } },
      { getHandlerFunction: function () { return 'runWeeklyFundingReview'; } },
      { getHandlerFunction: function () { return 'someOtherHandler'; } }
    ];
  });
  api.installRequiredTriggers_();
  const handlers = state.triggers.map(function (t) { return t.getHandlerFunction(); }).sort();
  assert.deepStrictEqual(handlers, ['runDailyFundingSweep', 'runWeeklyFundingReview', 'someOtherHandler']);
  const created = state.createdTriggers;
  assert.strictEqual(created.length, 2);
  const daily = created.find(function (c) { return c.handler === 'runDailyFundingSweep'; });
  const weekly = created.find(function (c) { return c.handler === 'runWeeklyFundingReview'; });
  assert.strictEqual(daily.hour, 7);
  assert.strictEqual(daily.type, 'daily');
  assert.strictEqual(weekly.hour, 9);
  assert.strictEqual(weekly.weekday, 'WEDNESDAY');
  assert.strictEqual(daily.tz, 'America/New_York');
});

/* -------------------- no Friday trigger -------------------- */

test('installRequiredTriggers_ never installs a Friday / publication trigger', function () {
  const { api, state } = H.load();
  api.installRequiredTriggers_();
  const anyFriday = state.createdTriggers.some(function (c) { return c.weekday === 'FRIDAY'; });
  assert.strictEqual(anyFriday, false);
  assert.strictEqual(state.createdTriggers.length, 2);
});
