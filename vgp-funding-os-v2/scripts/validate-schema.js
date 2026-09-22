#!/usr/bin/env node
'use strict';
/**
 * validate-schema.js — static, credential-free validation of the deployable
 * artifacts. It checks the things that must be true before Code.gs is pushed to
 * Apps Script, without touching Google:
 *
 *   1. appsscript.json time zone is America/New_York.
 *   2. OAuth scopes are least-privilege and contain NO send-capable Gmail scope
 *      beyond gmail.compose (draft creation), and no full Drive scope.
 *   3. Code.gs declares exactly the 17 required V2 columns, in order.
 *   4. Code.gs references every required master tab.
 *   5. Code.gs contains NONE of the forbidden send/forward/delete APIs.
 *   6. auto_push_mode default is DRAFT_ONLY.
 *
 * Exit code 0 = all checks pass; 1 = one or more failures.
 * Run: node scripts/validate-schema.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const code = fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'appsscript.json'), 'utf8'));

// Executable code only: strip block comments, line comments, and string literals
// so that documentation *mentioning* a forbidden API is not mistaken for a call.
function stripCommentsAndStrings(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')      // block comments
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')  // line comments (keep http:// intact)
    .replace(/'(?:\\.|[^'\\])*'/g, "''")    // single-quoted strings
    .replace(/"(?:\\.|[^"\\])*"/g, '""')     // double-quoted strings
    .replace(/`(?:\\.|[^`\\])*`/g, '``');    // template strings
}
const execCode = stripCommentsAndStrings(code);

const REQUIRED_V2 = [
  'funding_type_v2', 'stage_fit_v2', 'capital_value_score', 'network_fit_score',
  'urgency_score', 'effort_ease_score', 'strategic_value_score', 'final_score', 'tier',
  'founder_match_count', 'founder_segments_v2', 'decision_status_v2', 'next_action',
  'next_action_owner', 'next_action_due', 'auto_push_eligible', 'last_scored_at'
];

const REQUIRED_TABS = [
  '00_Config', '01_Raw_Alerts', '03_Opportunity_Master', '07_Source_Log',
  '08_Agent_Run_Log', '10_Founder_Mapping', '11_Automation_Rules', '12_Tier_A_Push_Queue'
];

const FORBIDDEN = [
  /GmailApp\.sendEmail/, /MailApp\.sendEmail/, /\.send\s*\(/, /\.forward\s*\(/,
  /deleteMessage/, /moveToTrash/, /removeSheet/, /deleteSheet/, /\.clear\s*\(\s*\)/
];

const ALLOWED_SCOPES = new Set([
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/script.scriptapp',
  'https://www.googleapis.com/auth/userinfo.email'
]);

const FORBIDDEN_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/drive'
];

let failures = 0;
const ok = function (m) { console.log('  ✓ ' + m); };
const bad = function (m) { console.error('  ✗ ' + m); failures++; };

console.log('appsscript.json');
if (manifest.timeZone === 'America/New_York') ok('timeZone = America/New_York');
else bad('timeZone is "' + manifest.timeZone + '" (expected America/New_York)');

const scopes = manifest.oauthScopes || [];
scopes.forEach(function (s) {
  if (!ALLOWED_SCOPES.has(s)) bad('unexpected OAuth scope: ' + s);
});
FORBIDDEN_SCOPES.forEach(function (s) {
  if (scopes.indexOf(s) !== -1) bad('over-privileged / send-capable scope present: ' + s);
});
if (scopes.indexOf('https://www.googleapis.com/auth/gmail.compose') !== -1) ok('gmail.compose present (drafts allowed)');
else bad('gmail.compose missing (drafts would fail)');
if (failures === 0) ok('OAuth scopes are least-privilege');

console.log('Code.gs — V2 schema');
const m = code.match(/V2_MASTER_HEADERS\s*=\s*\[([\s\S]*?)\]/);
if (!m) bad('could not locate V2_MASTER_HEADERS');
else {
  const declared = (m[1].match(/'([^']+)'/g) || []).map(function (s) { return s.replace(/'/g, ''); });
  if (declared.length !== REQUIRED_V2.length) bad('expected ' + REQUIRED_V2.length + ' V2 columns, found ' + declared.length);
  let orderOk = declared.length === REQUIRED_V2.length;
  for (let i = 0; i < REQUIRED_V2.length; i++) {
    if (declared[i] !== REQUIRED_V2[i]) { bad('V2 column ' + (i + 1) + ' is "' + declared[i] + '" (expected "' + REQUIRED_V2[i] + '")'); orderOk = false; }
  }
  if (orderOk) ok('17 V2 columns present and in order');
}

console.log('Code.gs — required tabs');
REQUIRED_TABS.forEach(function (tab) {
  if (code.indexOf("'" + tab + "'") !== -1) ok('references ' + tab);
  else bad('missing reference to tab ' + tab);
});

console.log('Code.gs — send safety (comments & strings stripped)');
let anyForbidden = false;
FORBIDDEN.forEach(function (re) {
  const hit = execCode.match(re);
  if (hit) { bad('forbidden pattern present in executable code: ' + re + ' -> ' + hit[0]); anyForbidden = true; }
});
if (!anyForbidden) ok('no send / forward / delete / clear-all APIs found');
if (code.indexOf('GmailApp.createDraft') !== -1) ok('GmailApp.createDraft present (DRAFT_ONLY path)');
else bad('GmailApp.createDraft not found');

console.log('Code.gs — DRAFT_ONLY default');
if (/auto_push_mode:\s*'DRAFT_ONLY'/.test(code)) ok("writeConfigDefaults_ defaults auto_push_mode to DRAFT_ONLY");
else bad('DRAFT_ONLY default not found in writeConfigDefaults_');

console.log('');
if (failures === 0) {
  console.log('VALIDATION PASSED');
  process.exit(0);
} else {
  console.error('VALIDATION FAILED: ' + failures + ' issue(s)');
  process.exit(1);
}
