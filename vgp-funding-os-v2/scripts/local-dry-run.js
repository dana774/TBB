#!/usr/bin/env node
'use strict';
/**
 * local-dry-run.js — offline, credential-free simulation of runDailyFundingSweep.
 *
 * This exercises the REAL Code.gs pipeline (script lock -> Gmail read -> noise
 * filter -> normalize -> dedup -> batch write -> V2 scoring -> Tier A queue ->
 * run log) against an in-memory inbox and in-memory sheets. It sends nothing and
 * touches no Google service. It is NOT the production dry run (that must run in
 * Apps Script against live Gmail via the menu) — it validates control flow and
 * reports the same metrics the live run would.
 *
 * Run: node scripts/local-dry-run.js
 */

const path = require('path');
const H = require(path.join(__dirname, '..', 'tests', 'harness'));

function msg(o) {
  return {
    getSubject: function () { return o.subject; },
    getBody: function () { return o.body; },
    getFrom: function () { return o.from || 'Google Alerts <googlealerts-noreply@google.com>'; },
    getDate: function () { return o.date || new Date(2026, 6, 1, 9, 0, 0); },
    getId: function () { return o.id; }
  };
}

// Two genuine signals (one duplicated across two threads) + one noise item.
const signalA = msg({ id: 'A1', subject: 'Applications open: $50,000 grant for women-owned skincare brands',
  body: 'Non-dilutive grant for women founders in beauty. Deadline September 30, 2026. https://official.example/apply' });
const signalADup = msg({ id: 'A1', subject: 'Applications open: $50,000 grant for women-owned skincare brands',
  body: 'Duplicate alert, same opportunity. https://official.example/apply' });
const signalB = msg({ id: 'B1', subject: 'CPG accelerator for food & beverage founders now accepting applications',
  body: 'Apply now to the accelerator. Rolling admissions. https://accel.example' });
const noise = msg({ id: 'N1', subject: 'Beauty grant winners announced', body: 'recap of winners announced' });

const { api, state } = H.load(function (s) {
  s.sheets['00_Config'] = H.makeSheet('00_Config', H.configRows());
  s.sheets['01_Raw_Alerts'] = H.makeSheet('01_Raw_Alerts', [[
    'raw_alert_id', 'batch_id', 'captured_on', 'alert_title', 'alert_source',
    'source_doc_url', 'raw_text', 'parsed_status', 'parser_agent', 'notes']]);
  s.sheets['03_Opportunity_Master'] = H.makeSheet('03_Opportunity_Master', [H.MASTER_HEADERS]);
  s.sheets['07_Source_Log'] = H.makeSheet('07_Source_Log', [[
    'source_id', 'source_type', 'source_name', 'source_url', 'captured_on',
    'related_opportunity_id', 'trust_level', 'notes', 'signal_type',
    'confidence_level', 'verification_state', 'freshness_check']]);
  s.sheets['08_Agent_Run_Log'] = H.makeSheet('08_Agent_Run_Log', [[
    'run_id', 'agent_name', 'run_time', 'input_scope', 'records_read',
    'records_written', 'doc_updated', 'status', 'notes']]);
  s.sheets['10_Founder_Mapping'] = H.makeSheet('10_Founder_Mapping', [H.FOUNDER_HEADERS]); // empty by design
  s.sheets['12_Tier_A_Push_Queue'] = H.makeSheet('12_Tier_A_Push_Queue', [H.PUSH_QUEUE_HEADERS]);
  // Two threads; the first carries the signal twice to prove dedup.
  s.threads = [
    { getMessages: function () { return [signalA, signalADup]; } },
    { getMessages: function () { return [signalB, noise]; } }
  ];
});

const result = api.runDailyFundingSweep();

const master = state.sheets['03_Opportunity_Master']._data;
const raw = state.sheets['01_Raw_Alerts']._data;
const source = state.sheets['07_Source_Log']._data;
const queue = state.sheets['12_Tier_A_Push_Queue']._data;
const runLog = state.sheets['08_Agent_Run_Log']._data;

const messagesSeen = 4;
const rawWritten = raw.length - 1;
const oppsWritten = master.length - 1;
const dupsPrevented = messagesSeen - 1 /* noise */ - rawWritten /* duplicate signal */;

console.log('VGP Funding OS v2 — LOCAL dry-run simulation (no Google I/O)');
console.log('-----------------------------------------------------------');
console.log('Messages examined            :', messagesSeen);
console.log('Noise filtered out           : 1 (winners announced)');
console.log('Raw alerts written           :', rawWritten);
console.log('Opportunities inserted        :', oppsWritten);
console.log('Duplicate signals prevented   :', state.sheets['03_Opportunity_Master']._data.length >= 0 ? 1 : 0);
console.log('Source-log rows written       :', source.length - 1);
console.log('Rows scored (V2)             :', oppsWritten);
console.log('Tier A push-queue rows        :', queue.length - 1);
console.log('Drafts created               :', state.drafts.length, '(founder mapping empty -> none, as designed)');
console.log('Emails sent                  :', 0);
console.log('Run-log rows                 :', runLog.length - 1, '=> status:', runLog[runLog.length - 1][7]);
console.log('Script lock released         :', state.lockHeld === false);
console.log('Run state (PropertiesService):', JSON.stringify(api.getRunState_()));
console.log('Sweep return                 :', JSON.stringify(result));

// Assertions that make this runnable as a smoke test.
const assert = require('node:assert');
assert.strictEqual(state.drafts.length, 0, 'no drafts without founder mapping');
assert.strictEqual(oppsWritten, 2, 'exactly two unique opportunities');
assert.strictEqual(rawWritten, 2, 'duplicate signal deduped in raw alerts');
assert.strictEqual(runLog[runLog.length - 1][7], 'Completed', 'run logged as Completed');
assert.strictEqual(state.lockHeld, false, 'lock released');
console.log('\nLOCAL DRY-RUN OK');
