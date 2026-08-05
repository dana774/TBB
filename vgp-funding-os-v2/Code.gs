/**
 * VGP Funding Operating System v2 — Code.gs
 * -----------------------------------------------------------------------------
 * Spreadsheet-bound Google Apps Script for VGP_Funding_Hotlist_Master.
 *
 * Master spreadsheet : 1RnXhEMl_Y8mzlKGvvof38_oGrlRfB8NIlVIQQS58rnA
 * Time zone          : America/New_York (also set in appsscript.json)
 * Safety posture     : DRAFT_ONLY — Tier A notifications are Gmail DRAFTS only.
 *
 * This file is the version-controlled, defect-corrected form of the source in
 * Google Doc 1oXv5dWWQ8e8Wr6YXXlAd5l7VcMR1qzmDj68RmN3eeMU.
 *
 * BUSINESS RULES ARE PRESERVED (scoring weights 30/30/20/20, tier bands
 * A 90-100 / B 75-89 / C 60-74 / D <60, founder routing = Active + approved +
 * valid email, Candidate/unverified default, DRAFT_ONLY). See docs/audit-report.md
 * for the full rule inventory.
 *
 * PRODUCTION CORRECTIONS APPLIED (non-business-rule; see docs/audit-report.md):
 *   C1  LockService script lock prevents overlapping sweeps.
 *   C2  PropertiesService records run state (id/time/status/scope).
 *   C3  Batch sheet writes (one setValues per sheet per sweep) — quota safety.
 *   C4  try/catch around every entry point; errors logged to 08_Agent_Run_Log
 *       with status "Error" and the message/stack.
 *   C5  Gmail message/thread caps + elapsed-time guard — read-quota / 6-min
 *       execution-limit safety.
 *   C6  Contiguous-V2-block write guard — refuses to write if the 17 V2 headers
 *       are not present, contiguous, and in the expected order (prevents silent
 *       data corruption of historical columns).
 *   C7  Empty-sheet / zero-column guards on every reader.
 *   C8  Deadline parsing normalized to America/New_York and tolerant of a
 *       missing year (assumes the next occurrence) — robustness only, tiers and
 *       urgency bands unchanged.
 *   C9  OAuth scopes tightened to least privilege in appsscript.json
 *       (gmail.readonly + gmail.compose; no gmail.modify, no Drive write).
 *   C10 Automated triggers NEVER create drafts — they queue only. Drafting is a
 *       deliberate manual menu action, and still refuses unless DRAFT_ONLY.
 *
 * FORBIDDEN CALLS (must never appear below): GmailApp.sendEmail, MailApp.sendEmail,
 * draft.send(), message.forward(). scripts/validate-schema.js enforces this.
 */

'use strict';

const VGP = Object.freeze({
  MASTER_SHEET_ID: '1RnXhEMl_Y8mzlKGvvof38_oGrlRfB8NIlVIQQS58rnA',
  TIME_ZONE: 'America/New_York',
  SHEETS: {
    CONFIG: '00_Config',
    RAW: '01_Raw_Alerts',
    MASTER: '03_Opportunity_Master',
    SOURCE: '07_Source_Log',
    RUN_LOG: '08_Agent_Run_Log',
    FOUNDER_MAP: '10_Founder_Mapping',
    RULES: '11_Automation_Rules',
    PUSH_QUEUE: '12_Tier_A_Push_Queue'
  },
  DAILY_FUNCTION: 'runDailyFundingSweep',
  WEEKLY_FUNCTION: 'runWeeklyFundingReview',
  // C5 quota / execution-time guards
  MAX_THREADS: 100,
  MAX_MESSAGES: 400,
  MAX_RUN_MS: 4.5 * 60 * 1000, // stop reading mail well before the 6-min cap
  LOCK_WAIT_MS: 30 * 1000
});

const V2_MASTER_HEADERS = [
  'funding_type_v2', 'stage_fit_v2', 'capital_value_score',
  'network_fit_score', 'urgency_score', 'effort_ease_score',
  'strategic_value_score', 'final_score', 'tier',
  'founder_match_count', 'founder_segments_v2', 'decision_status_v2',
  'next_action', 'next_action_owner', 'next_action_due',
  'auto_push_eligible', 'last_scored_at'
];

/* ============================ Menu / setup ============================ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('VGP Funding OS v2')
    .addItem('Run Daily Funding Sweep', 'runDailyFundingSweep')
    .addItem('Run Weekly Funding Review', 'runWeeklyFundingReview')
    .addSeparator()
    .addItem('Score Open Opportunities', 'scoreOpportunitiesV2')
    .addItem('Build Tier A Push Queue', 'buildTierAPushQueue')
    .addItem('Create Tier A Gmail Drafts', 'createTierADrafts')
    .addSeparator()
    .addItem('Install or Refresh Triggers', 'setupVGPFundingOSv2')
    .addToUi();
}

function setupVGPFundingOSv2() {
  const ss = SpreadsheetApp.openById(VGP.MASTER_SHEET_ID);
  ensureV2Headers_(ss);
  writeConfigDefaults_(ss);
  installRequiredTriggers_();
  logRun_('SETUP-' + stamp_(), 'VGP Funding OS v2 setup', 0, 0, 'Completed',
    'Schema and triggers prepared; external send remains DRAFT_ONLY.');
  safeAlert_('VGP Funding OS v2 is configured. Daily (7 AM ET) and weekly ' +
    '(Wed 9 AM ET) triggers are installed. Tier A messages remain drafts ' +
    'until auto_push_mode changes in 00_Config.');
}

function ensureV2Headers_(ss) {
  const master = ss.getSheetByName(VGP.SHEETS.MASTER);
  if (!master) throw new Error('Missing sheet: ' + VGP.SHEETS.MASTER);
  const lastCol = master.getLastColumn();
  if (lastCol < 1) throw new Error(VGP.SHEETS.MASTER + ' has no header row.'); // C7
  const headers = master.getRange(1, 1, 1, lastCol).getValues()[0];
  const missing = V2_MASTER_HEADERS.filter(function (h) { return headers.indexOf(h) === -1; });
  if (missing.length) {
    master.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    master.getRange(1, headers.length + 1, 1, missing.length)
      .setBackground('#1b2a3c').setFontColor('#ffffff').setFontWeight('bold')
      .setHorizontalAlignment('center').setWrap(true);
  }
}

// C10: idempotent trigger install — deletes any existing handlers of the same
// name first, then installs exactly one daily and one weekly trigger. The
// Friday publication trigger is intentionally NOT installed (Step 5 held).
function installRequiredTriggers_() {
  const names = [VGP.DAILY_FUNCTION, VGP.WEEKLY_FUNCTION];
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (names.indexOf(trigger.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger(VGP.DAILY_FUNCTION).timeBased().everyDays(1).atHour(7)
    .inTimezone(VGP.TIME_ZONE).create();
  ScriptApp.newTrigger(VGP.WEEKLY_FUNCTION).timeBased()
    .onWeekDay(ScriptApp.WeekDay.WEDNESDAY).atHour(9)
    .inTimezone(VGP.TIME_ZONE).create();
}

// Preserves every existing config key; only adds a default when the key is absent.
function writeConfigDefaults_(ss) {
  const sheet = ss.getSheetByName(VGP.SHEETS.CONFIG);
  if (!sheet) throw new Error('Missing sheet: ' + VGP.SHEETS.CONFIG);
  const values = sheet.getDataRange().getValues();
  const existing = {};
  values.slice(1).forEach(function (row) { if (row[0]) existing[String(row[0])] = true; });
  const defaults = {
    auto_push_mode: 'DRAFT_ONLY',
    tier_a_threshold: '90',
    tier_b_threshold: '75',
    tier_c_threshold: '60',
    daily_sweep_schedule: 'Daily at 7 AM America/New_York',
    weekly_review_schedule: 'Wednesday at 9 AM America/New_York',
    gmail_daily_query: 'newer_than:1d -in:spam -in:trash {from:googlealerts-noreply@google.com grant accelerator fellowship funding} {beauty skincare haircare cosmetics wellness CPG beverage food retail ecommerce}',
    gmail_weekly_query: 'newer_than:7d -in:spam -in:trash {from:googlealerts-noreply@google.com grant accelerator fellowship funding} {beauty skincare haircare cosmetics wellness CPG beverage food retail ecommerce}'
  };
  const rows = Object.keys(defaults).filter(function (key) { return !existing[key]; })
    .map(function (key) { return [key, defaults[key]]; });
  if (rows.length) sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 2).setValues(rows);
}

/* ============================ Entry points ============================ */

function runDailyFundingSweep() { return runSweep_('daily'); }
function runWeeklyFundingReview() { return runSweep_('weekly'); }

// C1/C2/C4: locked, state-tracked, error-logged sweep.
function runSweep_(scope) {
  const runId = 'RUN-' + stamp_() + '-' + scope.toUpperCase();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(VGP.LOCK_WAIT_MS)) {
    logRun_(runId, 'VGP Funding OS v2', 0, 0, 'Skipped',
      'Another sweep held the script lock; overlapping run skipped.');
    return { runId: runId, skipped: true };
  }
  setRunState_({ id: runId, scope: scope, status: 'Running', at: nowIso_() });
  try {
    const result = doSweep_(scope, runId);
    setRunState_({ id: runId, scope: scope, status: 'Completed', at: nowIso_() });
    return result;
  } catch (err) {
    setRunState_({ id: runId, scope: scope, status: 'Error', at: nowIso_() });
    logRun_(runId, 'VGP Funding OS v2', 0, 0, 'Error',
      'Sweep failed: ' + (err && err.message ? err.message : err) +
      (err && err.stack ? ' | ' + String(err.stack).slice(0, 500) : ''));
    throw err;
  } finally {
    lock.releaseLock();
  }
}

function doSweep_(scope, runId) {
  const startMs = nowMs_();
  const query = getConfig_(scope === 'daily' ? 'gmail_daily_query' : 'gmail_weekly_query');
  if (!query) throw new Error('Gmail query missing in 00_Config for scope: ' + scope);

  const rawSheet = getSheet_(VGP.SHEETS.RAW);
  const masterSheet = getSheet_(VGP.SHEETS.MASTER);
  const sourceSheet = getSheet_(VGP.SHEETS.SOURCE);

  const existingRawLinks = rawUrlSet_(rawSheet);
  const rawBuffer = [];
  const oppBuffer = [];
  const sourceBuffer = [];
  let reviewed = 0;
  let written = 0;

  const threads = GmailApp.search(query, 0, VGP.MAX_THREADS); // C5
  outer:
  for (let t = 0; t < threads.length; t++) {
    const messages = threads[t].getMessages();
    for (let m = 0; m < messages.length; m++) {
      if (reviewed >= VGP.MAX_MESSAGES || (nowMs_() - startMs) > VGP.MAX_RUN_MS) break outer; // C5
      const message = messages[m];
      reviewed++;
      const mailUrl = 'https://mail.google.com/mail/u/0/#all/' + message.getId();
      if (existingRawLinks[mailUrl]) continue;
      const normalized = normalizeMessage_(message, mailUrl, runId);
      if (!normalized.isSignal) continue;
      rawBuffer.push(normalized.raw);
      existingRawLinks[mailUrl] = true;
      if (normalized.isCandidate &&
        !duplicateOpportunity_(masterSheet, normalized.opportunity) &&
        !oppBufferHasDuplicate_(oppBuffer, normalized.opportunity)) {
        oppBuffer.push(normalized.opportunity);
        sourceBuffer.push(normalized.source);
        written++;
      }
    }
  }

  // C3: batch writes — one setValues per sheet.
  batchAppendByHeaders_(rawSheet, rawBuffer);
  batchAppendByHeaders_(masterSheet, oppBuffer);
  batchAppendByHeaders_(sourceSheet, sourceBuffer);

  scoreOpportunitiesV2();
  buildTierAPushQueue();

  logRun_(runId, 'VGP Funding OS v2', reviewed, written, 'Completed',
    scope + ' Gmail sweep completed; new records remain Candidate / unverified ' +
    'until official-source review.');
  return { runId: runId, reviewed: reviewed, opportunitiesWritten: written };
}

/* ============================ Normalization ============================ */

function normalizeMessage_(message, mailUrl, runId) {
  const subject = message.getSubject() || 'Untitled funding signal';
  const body = stripHtml_(message.getBody()).slice(0, 12000);
  const text = (subject + ' ' + body).toLowerCase();
  const capturedAt = Utilities.formatDate(message.getDate(), VGP.TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
  const isSignal = looksLikeFundingSignal_(text) && !looksLikeNoise_(text);
  const category = inferCategory_(text);
  const offerType = inferFundingType_(text);
  const deadline = extractDeadline_(body);
  const officialUrl = extractFirstUrl_(body);
  // Never assert "Open now": unverified inbound signals are Candidate / unverified.
  const currentStatus = deadline ? 'Candidate / unverified' : 'Watchlist';
  const key = shortHash_(mailUrl);
  const dayStamp = Utilities.formatDate(message.getDate(), VGP.TIME_ZONE, 'yyyyMMdd');
  const opId = 'OPP-' + dayStamp + '-' + key;

  const raw = {
    raw_alert_id: 'RAW-' + dayStamp + '-' + key,
    batch_id: runId,
    captured_on: capturedAt,
    alert_title: subject,
    alert_source: message.getFrom(),
    source_doc_url: mailUrl,
    raw_text: body.slice(0, 5000),
    parsed_status: isSignal ? 'candidate' : 'discard',
    parser_agent: 'VGP Funding OS v2 Apps Script',
    notes: isSignal ? 'Auto-captured. Verify official source before publication.' : 'Filtered by noise rules.'
  };

  const opportunity = {
    opportunity_id: opId,
    source_type: 'Gmail signal',
    source_name: message.getFrom(),
    source_doc_url: mailUrl,
    alert_batch_id: runId,
    intake_method: 'Gmail Apps Script sweep',
    captured_at: capturedAt,
    opportunity_name: subject,
    organization_name: message.getFrom(),
    category: offerType,
    subcategory: category,
    offer_amount: extractOfferAmount_(body),
    offer_type: offerType,
    deadline: deadline,
    rolling_status: deadline ? 'Fixed deadline' : 'Unknown',
    current_status: currentStatus,
    geography: inferGeography_(text),
    industry_focus: category,
    stage_fit: 'Needs verification',
    founder_tags: inferFounderTags_(text),
    eligibility_summary: 'Auto-extracted from Gmail signal; confirm on official program page.',
    application_url: officialUrl,
    official_source_url: '',
    secondary_source_url: mailUrl,
    summary_1_sentence: subject,
    why_it_matters: 'Potential funding or founder-support signal captured for verification.',
    vgp_angle: 'Verify, score and map to relevant founders before promotion.',
    vgp_service_tier: 'Funding Opportunity Map',
    priority_initial: 'Medium',
    priority_final: '',
    scoring_total: '',
    placement: 'Verification queue',
    verification_status: 'Candidate',
    verified_at: '',
    verified_by: '',
    editorial_status: 'Candidate',
    issue_date: '',
    publish_status: 'Do not publish',
    duplicate_group: '',
    confidence: officialUrl ? 'Medium' : 'Low',
    notes: 'Created by VGP Funding OS v2. Confirm official URL, eligibility, deadline and amount.',
    last_updated: capturedAt
  };

  const source = {
    source_id: 'SRC-' + dayStamp + '-' + key,
    source_type: 'Gmail signal',
    source_name: message.getFrom(),
    source_url: mailUrl,
    captured_on: capturedAt,
    related_opportunity_id: opId,
    trust_level: officialUrl ? 'Medium' : 'Low',
    notes: 'Auto-captured source. Official program page must be reviewed.',
    signal_type: offerType,
    confidence_level: officialUrl ? 'Medium' : 'Low',
    verification_state: 'Extracted / unverified',
    freshness_check: capturedAt
  };

  return { isSignal: isSignal, isCandidate: isSignal, raw: raw, opportunity: opportunity, source: source };
}

function looksLikeFundingSignal_(text) {
  const funding = /grant|funding|accelerator|incubator|fellowship|pitch competition|challenge|apply now|applications open|non-dilutive|working capital|small business loan|award/;
  const focus = /beauty|skincare|haircare|cosmetics|wellness|cpg|consumer packaged|beverage|food|snack|retail|ecommerce|women founder|women-owned|underrepresented/;
  return funding.test(text) && focus.test(text);
}

function looksLikeNoise_(text) {
  return /winner announced|winners announced|recipient announcement|recap|graduates|graduation|job opening|hiring now|scholarship|student-only|teen pass|youtube video/.test(text);
}

function inferCategory_(text) {
  if (/beauty|skincare|haircare|cosmetic|personal care/.test(text)) return 'Beauty / personal care';
  if (/beverage|drink|distill|spirits/.test(text)) return 'Beverage';
  if (/food|snack|cpg|consumer packaged/.test(text)) return 'Food / CPG';
  if (/retail|ecommerce|consumer product/.test(text)) return 'Retail / consumer products';
  return 'Startup / founder opportunity';
}

function inferFundingType_(text) {
  if (/loan|working capital|line of credit|financing/.test(text)) return 'Debt / working capital';
  if (/grant|non-dilutive|award/.test(text)) return 'Grant / non-dilutive';
  if (/accelerator|incubator|fellowship/.test(text)) return 'Accelerator / founder support';
  if (/pitch competition|challenge/.test(text)) return 'Competition / visibility';
  return 'Founder opportunity';
}

function inferFounderTags_(text) {
  const tags = [];
  if (/women|female/.test(text)) tags.push('Women founders');
  if (/black|bipoc|minority|underrepresented/.test(text)) tags.push('Underrepresented founders');
  if (/beauty|skincare|haircare|cosmetic/.test(text)) tags.push('Beauty founders');
  if (/cpg|consumer packaged|food|snack/.test(text)) tags.push('CPG / food founders');
  if (/beverage|drink|spirits/.test(text)) tags.push('Beverage founders');
  return tags.join('; ');
}

function inferGeography_(text) {
  if (/united states|u\.s\.|usa/.test(text)) return 'United States';
  if (/global|worldwide|any country/.test(text)) return 'Global';
  return 'Needs verification';
}

function extractDeadline_(text) {
  const match = String(text).match(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,?\s+20\d{2})?\b/i);
  return match ? match[0] : '';
}

function extractOfferAmount_(text) {
  const match = String(text).match(/(?:US\$|\$|EUR\s?|€|CAD\s?|£|INR\s?)[\d,]+(?:\s?(?:k|K|million|M))?/);
  return match ? match[0] : '';
}

function extractFirstUrl_(text) {
  const match = String(text).match(/https?:\/\/[^\s<>"]+/i);
  return match ? match[0].replace(/[\]\)>,.;]+$/, '') : '';
}

/* ============================ Scoring ============================ */

function scoreOpportunitiesV2() {
  const sheet = getSheet_(VGP.SHEETS.MASTER);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return; // C7 empty-sheet guard
  const headers = headerMap_(data[0]);

  // C6: require the 17 V2 columns to be present, contiguous, and in order.
  const startIndex = headers[V2_MASTER_HEADERS[0]];
  if (startIndex === undefined) {
    throw new Error('V2 columns are missing. Run setupVGPFundingOSv2 first.');
  }
  assertContiguousV2Block_(data[0], startIndex);
  const startColumn = startIndex + 1;

  const scores = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = String(row[headers.current_status] || '');
    const confidence = String(row[headers.confidence] || '');
    const offer = String(row[headers.offer_amount] || '');
    const offerType = String(row[headers.offer_type] || row[headers.category] || '');
    const title = String(row[headers.opportunity_name] || '');
    const industry = String(row[headers.industry_focus] || '');
    const founderTags = String(row[headers.founder_tags] || '');
    const deadline = String(row[headers.deadline] || '');
    const sourceUrl = String(row[headers.official_source_url] || '');
    const combined = (title + ' ' + industry + ' ' + founderTags + ' ' + offerType).toLowerCase();

    const fundingType = inferFundingType_(combined);
    const stageFit = inferStageFit_(combined);
    const capital = scoreCapitalValue_(offer, offerType);
    const networkFit = scoreNetworkFit_(combined);
    const urgency = scoreUrgency_(deadline, status);
    const effortEase = scoreEffortEase_(offerType, status, sourceUrl);
    const strategic = Math.round((capital + networkFit + urgency + effortEase) / 4);
    const finalScore = isClosedStatus_(status) ? 0 : Math.round(
      (capital * 0.30) + (networkFit * 0.30) + (urgency * 0.20) + (effortEase * 0.20)
    );
    const tier = tierForScore_(finalScore);
    const segments = inferFounderSegments_(combined);
    const matches = getFounderMatches_(segments);
    const verified = isVerified_(status, confidence, sourceUrl, row[headers.verification_status]);
    const autoPush = (tier === 'Tier A' && isCurrentStatus_(status) && verified && matches.length > 0);
    const next = nextAction_(tier, verified, deadline, matches.length);

    scores.push([
      fundingType, stageFit, capital, networkFit, urgency, effortEase, strategic,
      finalScore, tier, matches.length, segments.join('; '), next.decision,
      next.action, next.owner, next.due, autoPush ? 'TRUE' : 'FALSE', nowIso_()
    ]);
  }
  if (scores.length) sheet.getRange(2, startColumn, scores.length, V2_MASTER_HEADERS.length).setValues(scores);
}

function scoreCapitalValue_(offer, offerType) {
  const text = String(offer + ' ' + offerType).toLowerCase();
  const number = parseAmount_(text);
  if (/reduced markup|fee waiver|certification/.test(text)) return 55;
  if (/loan|debt|working capital/.test(text)) return number >= 100000 ? 65 : 50;
  if (number >= 500000) return 100;
  if (number >= 100000) return 92;
  if (number >= 50000) return 84;
  if (number >= 25000) return 76;
  if (number >= 10000) return 68;
  if (number > 0) return 52;
  if (/accelerator|fellowship|corporate pilot|retail/.test(text)) return 55;
  return 40;
}

function scoreNetworkFit_(text) {
  let score = 35;
  if (/beauty|skincare|haircare|cosmetic|personal care/.test(text)) score = Math.max(score, 95);
  if (/cpg|consumer packaged|consumer product|retail|ecommerce/.test(text)) score = Math.max(score, 92);
  if (/beverage|food|snack|drink|spirits/.test(text)) score = Math.max(score, 90);
  if (/women founder|women-owned|female founder/.test(text)) score = Math.max(score, 88);
  if (/underrepresented|bipoc|black-owned|minority/.test(text)) score = Math.max(score, 88);
  if (/startup|founder|small business/.test(text)) score = Math.max(score, 70);
  if (/student|youth only|university research/.test(text)) score -= 25;
  if (/local only|city limits|county/.test(text)) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function scoreUrgency_(deadline, status) {
  if (isClosedStatus_(status)) return 0;
  if (/rolling/i.test(status)) return 45;
  const parsed = parseDeadline_(deadline);
  if (!parsed) return 35;
  const days = Math.ceil((parsed.getTime() - startOfDay_(new Date()).getTime()) / 86400000);
  if (days < 0) return 0;
  if (days <= 7) return 100;
  if (days <= 14) return 88;
  if (days <= 21) return 76;
  if (days <= 45) return 60;
  return 42;
}

function scoreEffortEase_(offerType, status, sourceUrl) {
  let ease = 65;
  const text = String(offerType + ' ' + status).toLowerCase();
  if (/grant/.test(text)) ease -= 15;
  if (/accelerator|fellowship/.test(text)) ease -= 8;
  if (/loan|debt/.test(text)) ease -= 20;
  if (/candidate|unverified/.test(text)) ease -= 20;
  if (/rolling/.test(text)) ease += 10;
  if (sourceUrl) ease += 10;
  return Math.max(10, Math.min(100, ease));
}

function inferStageFit_(text) {
  if (/pre-revenue|idea stage|formation/.test(text)) return 'Idea / pre-revenue';
  if (/first revenue|early-stage|prototype|pilot/.test(text)) return 'Early / validation';
  if (/retail expansion|distribution|scale|growth|post-revenue/.test(text)) return 'Growth / scaling';
  return 'Needs verification';
}

function inferFounderSegments_(text) {
  const segments = [];
  if (/beauty|skincare|haircare|cosmetic|personal care/.test(text)) segments.push('Beauty');
  if (/cpg|consumer packaged|consumer product|retail|ecommerce/.test(text)) segments.push('CPG / Retail');
  if (/beverage|food|snack|drink|spirits/.test(text)) segments.push('Food / Beverage');
  if (/women founder|women-owned|female founder/.test(text)) segments.push('Women founders');
  if (/underrepresented|bipoc|black-owned|minority/.test(text)) segments.push('Underrepresented founders');
  if (!segments.length) segments.push('General startup founders');
  return segments;
}

function tierForScore_(score) {
  if (score >= Number(getConfig_('tier_a_threshold') || 90)) return 'Tier A';
  if (score >= Number(getConfig_('tier_b_threshold') || 75)) return 'Tier B';
  if (score >= Number(getConfig_('tier_c_threshold') || 60)) return 'Tier C';
  return 'Tier D';
}

function nextAction_(tier, verified, deadline, matchCount) {
  const now = new Date();
  const due = deadline || Utilities.formatDate(new Date(now.getTime() + 2 * 86400000), VGP.TIME_ZONE, 'MMM d, yyyy');
  if (tier === 'Tier A' && verified && matchCount) {
    return { decision: 'Immediate founder push', action: 'Create targeted founder draft and prepare application-readiness checklist.', owner: 'Dana / VGP Funding Inbox Agent', due: due };
  }
  if (tier === 'Tier A' || tier === 'Tier B') {
    return { decision: 'Weekly digest inclusion', action: verified ? 'Add to weekly digest and map relevant founders.' : 'Verify official source before founder-facing distribution.', owner: 'VGP Funding Inbox Agent', due: due };
  }
  if (tier === 'Tier C') return { decision: 'Watchlist', action: 'Monitor for verification, updated deadline or fit change.', owner: 'VGP Funding Inbox Agent', due: '' };
  return { decision: 'Archive', action: 'Retain for history; do not distribute.', owner: 'VGP Funding Inbox Agent', due: '' };
}

/* ============================ Tier A queue + drafts ============================ */

function buildTierAPushQueue() {
  const ss = SpreadsheetApp.openById(VGP.MASTER_SHEET_ID);
  const master = ss.getSheetByName(VGP.SHEETS.MASTER);
  const queue = ss.getSheetByName(VGP.SHEETS.PUSH_QUEUE);
  if (!master || !queue) throw new Error('Missing master or push-queue sheet.');
  const data = master.getDataRange().getValues();
  if (data.length < 2) return; // C7
  const headers = headerMap_(data[0]);
  const existing = queue.getDataRange().getValues();
  const queueHeaders = headerMap_(existing[0] || []);
  const existingKeys = {};
  existing.slice(1).forEach(function (row) {
    const opp = row[queueHeaders.opportunity_id];
    const status = row[queueHeaders.draft_status];
    if (opp && status !== 'Closed') existingKeys[String(opp)] = true;
  });

  const rows = [];
  data.slice(1).forEach(function (row) {
    const oppId = String(row[headers.opportunity_id] || '');
    const tier = String(row[headers.tier] || '');
    const eligible = String(row[headers.auto_push_eligible] || '').toUpperCase() === 'TRUE';
    if (!oppId || tier !== 'Tier A' || !eligible || existingKeys[oppId]) return;

    const segments = String(row[headers.founder_segments_v2] || '').split(';').map(function (x) { return x.trim(); }).filter(Boolean);
    const matches = getFounderMatches_(segments);
    const title = String(row[headers.opportunity_name] || 'Funding opportunity');
    const deadline = String(row[headers.deadline] || 'See official application page');
    const subject = 'Funding Alert: ' + title + ' | Deadline: ' + deadline;
    const body = buildTierAEmailBody_(row, headers, matches);

    rows.push([
      'PUSH-' + stamp_() + '-' + shortHash_(oppId), nowIso_(), oppId, title, tier,
      row[headers.final_score], deadline, urgencyLabel_(row[headers.urgency_score]),
      matches.length, segments.join('; '), matches.length, 'Founder Mapping',
      subject, body, getConfig_('auto_push_mode') || 'DRAFT_ONLY',
      matches.length ? 'Queued for draft' : 'Needs founder mapping', '',
      matches.length ? 'Draft only; review before sending.' : 'Add active founder mapping rows with email and approved_for_auto_push TRUE.'
    ]);
    existingKeys[oppId] = true; // guard against duplicate rows within one run
  });
  if (rows.length) queue.getRange(queue.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

// DRAFT_ONLY: creates Gmail DRAFTS only. Never sends, forwards, or deletes.
// Invoked only from the menu (never from a trigger) — see C10.
function createTierADrafts() {
  const mode = String(getConfig_('auto_push_mode') || 'DRAFT_ONLY').toUpperCase();
  if (mode !== 'DRAFT_ONLY') {
    throw new Error('External send mode is not enabled in this source. Keep DRAFT_ONLY ' +
      'unless you add a separately approved send routine.');
  }

  const ss = SpreadsheetApp.openById(VGP.MASTER_SHEET_ID);
  const queue = ss.getSheetByName(VGP.SHEETS.PUSH_QUEUE);
  if (!queue) throw new Error('Missing sheet: ' + VGP.SHEETS.PUSH_QUEUE);
  const values = queue.getDataRange().getValues();
  if (values.length < 2) return 0; // C7
  const headers = headerMap_(values[0]);
  let drafts = 0;

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    if (String(row[headers.draft_status]) !== 'Queued for draft') continue;
    const title = String(row[headers.opportunity_name] || 'Funding opportunity');
    const subject = String(row[headers.subject_line] || 'Funding Alert: ' + title);
    const body = String(row[headers.email_body] || '');
    const matches = getFounderMatches_(String(row[headers.founder_segments] || '').split(';').map(function (x) { return x.trim(); }));
    const recipients = matches.map(function (match) { return match.email; }).filter(Boolean);

    if (!recipients.length) {
      queue.getRange(r + 1, headers.draft_status + 1).setValue('Needs founder mapping');
      continue;
    }

    const reviewer = safeReviewerEmail_();
    // DRAFT ONLY. Draft is addressed to the reviewer; founders preloaded as BCC.
    GmailApp.createDraft(reviewer, subject,
      body + '\n\nInternal review note: BCC founder recipients are preloaded. ' +
      'Confirm fit and accuracy before sending.',
      { bcc: recipients.join(',') });
    drafts++;
    queue.getRange(r + 1, headers.draft_status + 1).setValue('Draft created');
    queue.getRange(r + 1, headers.draft_url + 1).setValue('Open Gmail Drafts to review');
  }
  return drafts;
}

function buildTierAEmailBody_(row, headers, matches) {
  const name = String(row[headers.opportunity_name] || 'This funding opportunity');
  const sponsor = String(row[headers.organization_name] || 'the sponsoring organization');
  const deadline = String(row[headers.deadline] || 'see official application page');
  const amount = String(row[headers.offer_amount] || 'funding and founder support');
  const fit = String(row[headers.eligibility_summary] || 'review the eligibility requirements');
  const url = String(row[headers.application_url] || row[headers.official_source_url] || '');
  return [
    'Founder network update:',
    '',
    name + ' from ' + sponsor + ' is a Tier A opportunity for selected founders in the VGP network.',
    'Benefit: ' + amount,
    'Deadline: ' + deadline,
    'Best-fit founders: ' + String(row[headers.founder_segments_v2] || 'See eligibility requirements'),
    'What to confirm: ' + fit,
    url ? 'Application / source: ' + url : 'Application link: confirm on the official program page before applying.',
    '',
    'This is a targeted VGP signal, not a guarantee of eligibility or award. ' +
    'Respond if you want a quick funding-readiness review before you apply.',
    '',
    'Dana Ammons',
    'Value Growth Partners | The Brand Blueprint'
  ].join('\n');
}

// Routes only Active + approved founders with a valid email address.
function getFounderMatches_(segments) {
  const sheet = getSheet_(VGP.SHEETS.FOUNDER_MAP);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return []; // C7 empty-sheet guard
  const headers = headerMap_(values[0]);
  const normalized = segments.map(function (x) { return String(x).toLowerCase(); });
  const matches = [];

  values.slice(1).forEach(function (row) {
    const active = String(row[headers.active_status] || '').toLowerCase();
    const approved = String(row[headers.approved_for_auto_push] || '').toUpperCase() === 'TRUE';
    const email = String(row[headers.email] || '').trim();
    if (active !== 'active' || !approved || !email || !isValidEmail_(email)) return;
    const profile = [row[headers.segment], row[headers.sector], row[headers.subsector], row[headers.capital_need]]
      .join(' ').toLowerCase();
    const matched = normalized.some(function (segment) {
      return (segment && profile.indexOf(segment) !== -1) || segment.indexOf('general startup') !== -1;
    });
    if (matched) matches.push({
      email: email,
      founderName: row[headers.founder_name],
      brandName: row[headers.brand_name]
    });
  });
  return matches;
}

/* ============================ Dedup + classification ============================ */

function duplicateOpportunity_(sheet, candidate) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return false; // C7
  const headers = headerMap_(values[0]);
  const name = String(candidate.opportunity_name || '').toLowerCase();
  const source = String(candidate.source_doc_url || '');
  return values.slice(1).some(function (row) {
    return String(row[headers.source_doc_url] || '') === source ||
      String(row[headers.opportunity_name] || '').toLowerCase() === name;
  });
}

function oppBufferHasDuplicate_(buffer, candidate) {
  const name = String(candidate.opportunity_name || '').toLowerCase();
  const source = String(candidate.source_doc_url || '');
  return buffer.some(function (o) {
    return String(o.source_doc_url || '') === source ||
      String(o.opportunity_name || '').toLowerCase() === name;
  });
}

function isVerified_(status, confidence, officialUrl, verificationStatus) {
  const verification = String(verificationStatus || '').toLowerCase();
  return isCurrentStatus_(status) && !!officialUrl &&
    (verification.indexOf('verified') !== -1 || String(confidence || '').toLowerCase() === 'high');
}

function isCurrentStatus_(status) {
  return /open now|opening soon|rolling/i.test(String(status || ''));
}

function isClosedStatus_(status) {
  return /closed|expired|discard/i.test(String(status || ''));
}

function urgencyLabel_(score) {
  const n = Number(score || 0);
  if (n >= 88) return 'Immediate';
  if (n >= 60) return 'Upcoming';
  return 'Monitor';
}

/* ============================ Parsing helpers ============================ */

function parseAmount_(text) {
  const clean = String(text).replace(/,/g, '');
  const match = clean.match(/(?:US\$|\$|EUR\s?|€|CAD\s?|£|INR\s?)(\d+(?:\.\d+)?)(\s?[kKmM]|\s?million)?/);
  if (!match) return 0;
  let n = Number(match[1]);
  const unit = String(match[2] || '').toLowerCase();
  if (unit.indexOf('k') !== -1) n *= 1000;
  if (unit.indexOf('m') !== -1 || unit.indexOf('million') !== -1) n *= 1000000;
  return n;
}

// C8: parse deadlines in America/New_York; tolerate a missing year.
function parseDeadline_(deadline) {
  if (!deadline) return null;
  let cleaned = String(deadline)
    .replace(/at\s+.*$/i, '')
    .replace(/(ET|EST|EDT|CT|CST|CDT|PT|PST|PDT|CEST|IST)/gi, '')
    .trim();
  if (!cleaned) return null;
  // Guard against V8's lenient parser turning non-date text ("rolling") into a
  // bogus Date: require a month name or an M/D numeric date before parsing.
  if (!/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(cleaned) &&
      !/\b\d{1,2}[\/-]\d{1,2}/.test(cleaned)) {
    return null;
  }
  // If no 4-digit year is present, assume the next occurrence (this year, or
  // next year if that date has already passed).
  if (!/20\d{2}/.test(cleaned)) {
    const now = new Date();
    let candidate = new Date(cleaned + ' ' + now.getFullYear());
    if (isNaN(candidate.getTime())) return null;
    if (candidate.getTime() < startOfDay_(now).getTime()) {
      candidate = new Date(cleaned + ' ' + (now.getFullYear() + 1));
    }
    return isNaN(candidate.getTime()) ? null : candidate;
  }
  const date = new Date(cleaned);
  return isNaN(date.getTime()) ? null : date;
}

function startOfDay_(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

/* ============================ Sheet utilities ============================ */

function rawUrlSet_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (!values.length) return {};
  const headers = headerMap_(values[0]);
  const set = {};
  values.slice(1).forEach(function (row) {
    const url = row[headers.source_doc_url];
    if (url) set[String(url)] = true;
  });
  return set;
}

// Single-row append (setup + logging paths).
function appendByHeaders_(sheet, object) {
  const lastCol = sheet.getLastColumn();
  if (lastCol < 1) throw new Error('Sheet has no header row: ' + sheet.getName());
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const row = headers.map(function (header) {
    return Object.prototype.hasOwnProperty.call(object, header) ? object[header] : '';
  });
  sheet.appendRow(row);
}

// C3: batched multi-row append — one setValues() for the whole buffer.
function batchAppendByHeaders_(sheet, objects) {
  if (!objects || !objects.length) return;
  const lastCol = sheet.getLastColumn();
  if (lastCol < 1) throw new Error('Sheet has no header row: ' + sheet.getName());
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const rows = objects.map(function (object) {
    return headers.map(function (header) {
      return Object.prototype.hasOwnProperty.call(object, header) ? object[header] : '';
    });
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, headers.length).setValues(rows);
}

function assertContiguousV2Block_(headerRow, startIndex) {
  for (let k = 0; k < V2_MASTER_HEADERS.length; k++) {
    if (String(headerRow[startIndex + k]) !== V2_MASTER_HEADERS[k]) {
      throw new Error('V2 columns are not contiguous/in order at column ' +
        (startIndex + k + 1) + '. Refusing to write to avoid corrupting ' +
        'historical data. Fix the 03_Opportunity_Master header block.');
    }
  }
}

function headerMap_(headers) {
  const map = {};
  headers.forEach(function (header, i) { map[String(header)] = i; });
  return map;
}

function getSheet_(name) {
  const sheet = SpreadsheetApp.openById(VGP.MASTER_SHEET_ID).getSheetByName(name);
  if (!sheet) throw new Error('Missing sheet: ' + name);
  return sheet;
}

function getConfig_(key) {
  const sheet = getSheet_(VGP.SHEETS.CONFIG);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === key) return String(values[i][1] || '');
  }
  return '';
}

function logRun_(runId, agentName, recordsRead, recordsWritten, status, notes) {
  try {
    appendByHeaders_(getSheet_(VGP.SHEETS.RUN_LOG), {
      run_id: runId,
      agent_name: agentName,
      run_time: nowIso_(),
      input_scope: 'VGP Funding OS v2',
      records_read: recordsRead,
      records_written: recordsWritten,
      doc_updated: '03_Opportunity_Master; 12_Tier_A_Push_Queue',
      status: status,
      notes: notes
    });
  } catch (e) {
    // Never let logging failures mask the original outcome.
    console.error('logRun_ failed: ' + (e && e.message ? e.message : e));
  }
}

/* ============================ Run-state (C2) ============================ */

function setRunState_(state) {
  try {
    PropertiesService.getScriptProperties().setProperties({
      LAST_RUN_ID: String(state.id || ''),
      LAST_RUN_SCOPE: String(state.scope || ''),
      LAST_RUN_STATUS: String(state.status || ''),
      LAST_RUN_AT: String(state.at || '')
    });
  } catch (e) {
    console.error('setRunState_ failed: ' + (e && e.message ? e.message : e));
  }
}

function getRunState_() {
  try {
    return PropertiesService.getScriptProperties().getProperties();
  } catch (e) {
    return {};
  }
}

/* ============================ Small helpers ============================ */

function safeReviewerEmail_() {
  try {
    const email = Session.getActiveUser().getEmail();
    if (email) return email;
  } catch (e) { /* trigger context may have no active user */ }
  try {
    return Session.getEffectiveUser().getEmail() || '';
  } catch (e) {
    return '';
  }
}

function safeAlert_(message) {
  try {
    SpreadsheetApp.getUi().alert(message);
  } catch (e) {
    console.log(message); // no UI context (e.g. run from editor/trigger)
  }
}

function stripHtml_(html) {
  return String(html || '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function shortHash_(text) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(text));
  return digest.slice(0, 4).map(function (byte) {
    const value = (byte + 256) % 256;
    return ('0' + value.toString(16)).slice(-2);
  }).join('').toUpperCase();
}

function stamp_() {
  return Utilities.formatDate(new Date(), VGP.TIME_ZONE, 'yyyyMMdd-HHmmss');
}

function nowIso_() {
  return Utilities.formatDate(new Date(), VGP.TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function nowMs_() {
  return new Date().getTime();
}

/* Node test harness export (ignored by Apps Script). */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VGP: VGP, V2_MASTER_HEADERS: V2_MASTER_HEADERS,
    looksLikeFundingSignal_: looksLikeFundingSignal_, looksLikeNoise_: looksLikeNoise_,
    inferCategory_: inferCategory_, inferFundingType_: inferFundingType_,
    inferFounderTags_: inferFounderTags_, inferGeography_: inferGeography_,
    inferStageFit_: inferStageFit_, inferFounderSegments_: inferFounderSegments_,
    extractDeadline_: extractDeadline_, extractOfferAmount_: extractOfferAmount_,
    extractFirstUrl_: extractFirstUrl_, parseAmount_: parseAmount_,
    parseDeadline_: parseDeadline_, startOfDay_: startOfDay_, isValidEmail_: isValidEmail_,
    scoreCapitalValue_: scoreCapitalValue_, scoreNetworkFit_: scoreNetworkFit_,
    scoreUrgency_: scoreUrgency_, scoreEffortEase_: scoreEffortEase_,
    tierForScore_: tierForScore_, nextAction_: nextAction_, urgencyLabel_: urgencyLabel_,
    isVerified_: isVerified_, isCurrentStatus_: isCurrentStatus_, isClosedStatus_: isClosedStatus_,
    duplicateOpportunity_: duplicateOpportunity_, oppBufferHasDuplicate_: oppBufferHasDuplicate_,
    getFounderMatches_: getFounderMatches_, headerMap_: headerMap_,
    assertContiguousV2Block_: assertContiguousV2Block_, stripHtml_: stripHtml_,
    normalizeMessage_: normalizeMessage_, installRequiredTriggers_: installRequiredTriggers_,
    createTierADrafts: createTierADrafts, buildTierAPushQueue: buildTierAPushQueue,
    scoreOpportunitiesV2: scoreOpportunitiesV2,
    runDailyFundingSweep: runDailyFundingSweep, runWeeklyFundingReview: runWeeklyFundingReview,
    getRunState_: getRunState_,
    __setInjector: function (g) { Object.keys(g).forEach(function (k) { globalThis[k] = g[k]; }); }
  };
}
