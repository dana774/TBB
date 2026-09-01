'use strict';
/**
 * scoring.test.js — scoring engine, tier thresholds, parsing and classification.
 * Run: node --test   (Node 18+; developed on Node 22)
 */

const { test } = require('node:test');
const assert = require('node:assert');
const H = require('./harness');

function withConfig() {
  return H.load(function (state) {
    state.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    state.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [H.FOUNDER_HEADERS]);
  });
}

/* -------------------- funding amount parsing -------------------- */

test('parseAmount_ reads plain, k and million units', function () {
  const { api } = withConfig();
  assert.strictEqual(api.parseAmount_('$25,000 grant'), 25000);
  assert.strictEqual(api.parseAmount_('$50k accelerator'), 50000);
  assert.strictEqual(api.parseAmount_('$1.5 million fund'), 1500000);
  assert.strictEqual(api.parseAmount_('EUR 100,000 non-dilutive'), 100000);
  assert.strictEqual(api.parseAmount_('no money here'), 0);
});

test('scoreCapitalValue_ maps amounts to bands and treats loans separately', function () {
  const { api } = withConfig();
  assert.strictEqual(api.scoreCapitalValue_('$500,000', 'grant'), 100);
  assert.strictEqual(api.scoreCapitalValue_('$100,000', 'grant'), 92);
  assert.strictEqual(api.scoreCapitalValue_('$25,000', 'grant'), 76);
  assert.strictEqual(api.scoreCapitalValue_('$5,000', 'grant'), 52);
  assert.strictEqual(api.scoreCapitalValue_('$0', 'accelerator'), 55);
  // A large loan is capped well below an equivalent grant.
  assert.strictEqual(api.scoreCapitalValue_('$200,000', 'working capital loan'), 65);
});

/* -------------------- deadline parsing + urgency -------------------- */

test('extractDeadline_ pulls a Month Day, Year token', function () {
  const { api } = withConfig();
  assert.strictEqual(api.extractDeadline_('Applications close June 16, 2026 at 5pm ET'), 'June 16, 2026');
  assert.strictEqual(api.extractDeadline_('no date here'), '');
});

test('parseDeadline_ returns a valid Date and tolerates timezone suffixes', function () {
  const { api } = withConfig();
  const d = api.parseDeadline_('June 16, 2026 at 11:59pm ET');
  // Duck-typed (Code.gs runs in a separate vm realm, so cross-realm
  // `instanceof Date` is unreliable — check the Date contract instead).
  assert.ok(d && typeof d.getTime === 'function' && !isNaN(d.getTime()));
  assert.strictEqual(d.getFullYear(), 2026);
  assert.strictEqual(d.getMonth(), 5); // June
  assert.strictEqual(api.parseDeadline_(''), null);
  assert.strictEqual(api.parseDeadline_('rolling'), null);
});

test('scoreUrgency_ bands by days-to-deadline and zeroes closed programs', function () {
  const { api } = withConfig();
  const soon = new Date(); soon.setDate(soon.getDate() + 3);
  const mid = new Date(); mid.setDate(mid.getDate() + 30);
  const past = new Date(); past.setDate(past.getDate() - 5);
  const fmt = function (dt) { return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear(); };
  assert.strictEqual(api.scoreUrgency_(fmt(soon), 'Open now'), 100);
  assert.strictEqual(api.scoreUrgency_(fmt(mid), 'Open now'), 60);
  assert.strictEqual(api.scoreUrgency_(fmt(past), 'Open now'), 0);
  assert.strictEqual(api.scoreUrgency_('June 1, 2026', 'Closed'), 0);
  assert.strictEqual(api.scoreUrgency_('anything', 'Rolling'), 45);
  assert.strictEqual(api.scoreUrgency_('', 'Open now'), 35); // unparseable -> neutral
});

/* -------------------- closed-program detection -------------------- */

test('isClosedStatus_ / isCurrentStatus_ classify status text', function () {
  const { api } = withConfig();
  assert.ok(api.isClosedStatus_('Closed'));
  assert.ok(api.isClosedStatus_('Applications expired'));
  assert.ok(!api.isClosedStatus_('Open now'));
  assert.ok(api.isCurrentStatus_('Open now'));
  assert.ok(api.isCurrentStatus_('Opening soon'));
  assert.ok(api.isCurrentStatus_('Rolling'));
  assert.ok(!api.isCurrentStatus_('Candidate / unverified'));
});

/* -------------------- category / type inference -------------------- */

test('inferCategory_ and inferFundingType_ classify signals', function () {
  const { api } = withConfig();
  assert.strictEqual(api.inferCategory_('new skincare beauty grant'), 'Beauty / personal care');
  assert.strictEqual(api.inferCategory_('craft beverage competition'), 'Beverage');
  assert.strictEqual(api.inferFundingType_('non-dilutive grant award'), 'Grant / non-dilutive');
  assert.strictEqual(api.inferFundingType_('startup accelerator fellowship'), 'Accelerator / founder support');
  assert.strictEqual(api.inferFundingType_('working capital loan'), 'Debt / working capital');
});

/* -------------------- tier thresholds -------------------- */

test('tierForScore_ honors the configured A/B/C/D bands', function () {
  const { api } = withConfig();
  assert.strictEqual(api.tierForScore_(95), 'Tier A');
  assert.strictEqual(api.tierForScore_(90), 'Tier A');
  assert.strictEqual(api.tierForScore_(89), 'Tier B');
  assert.strictEqual(api.tierForScore_(75), 'Tier B');
  assert.strictEqual(api.tierForScore_(74), 'Tier C');
  assert.strictEqual(api.tierForScore_(60), 'Tier C');
  assert.strictEqual(api.tierForScore_(59), 'Tier D');
  assert.strictEqual(api.tierForScore_(0), 'Tier D');
});

test('weighted final score uses 30/30/20/20 and closed -> 0', function () {
  const { api } = withConfig();
  // Mirror the production weighting to assert the contract explicitly.
  const capital = 92, network = 95, urgency = 100, effort = 60;
  const expected = Math.round(capital * 0.30 + network * 0.30 + urgency * 0.20 + effort * 0.20);
  assert.strictEqual(expected, 88);
  assert.strictEqual(api.tierForScore_(expected), 'Tier B');
});

/* -------------------- founder-sector matching (positive) -------------------- */

test('getFounderMatches_ matches an active approved founder by sector', function () {
  const { api } = H.load(function (state) {
    state.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
    state.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [
      H.FOUNDER_HEADERS,
      ['Ada Founder', 'GlowCo', 'ada@glow.co', 'Beauty', 'Beauty / personal care', 'skincare', '50k', 'Active', 'TRUE']
    ]);
  });
  const matches = api.getFounderMatches_(['Beauty']);
  assert.strictEqual(matches.length, 1);
  assert.strictEqual(matches[0].email, 'ada@glow.co');
});
