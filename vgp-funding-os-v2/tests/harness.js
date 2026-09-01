'use strict';
/**
 * Test harness for VGP Funding OS v2.
 *
 * Google Apps Script has no local runtime, so we load the real Code.gs inside a
 * Node `vm` context whose global object provides in-memory stubs for the Apps
 * Script services the code uses (SpreadsheetApp, GmailApp, ScriptApp, Utilities,
 * Session, LockService, PropertiesService). The production functions are then
 * exercised unmodified. Tests configure sheet contents through the returned
 * `state` object and inspect side effects (draft creation, trigger install).
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const CODE_PATH = path.join(__dirname, '..', 'Code.gs');

/* ---------------- in-memory spreadsheet model ---------------- */

function makeSheet(name, rows) {
  const data = rows ? rows.map(function (r) { return r.slice(); }) : [];
  return {
    getName: function () { return name; },
    _data: data,
    getLastColumn: function () { return data.reduce(function (m, r) { return Math.max(m, r.length); }, 0); },
    getLastRow: function () { return data.length; },
    getDataRange: function () {
      return { getValues: function () { return data.map(function (r) { return r.slice(); }); } };
    },
    getRange: function (row, col, numRows, numCols) {
      const r0 = row - 1, c0 = col - 1;
      const nR = numRows === undefined ? 1 : numRows;
      const nC = numCols === undefined ? 1 : numCols;
      return {
        getValues: function () {
          const out = [];
          for (let i = 0; i < nR; i++) {
            const src = data[r0 + i] || [];
            const line = [];
            for (let j = 0; j < nC; j++) line.push(src[c0 + j] === undefined ? '' : src[c0 + j]);
            out.push(line);
          }
          return out;
        },
        setValues: function (vals) {
          for (let i = 0; i < vals.length; i++) {
            if (!data[r0 + i]) data[r0 + i] = [];
            for (let j = 0; j < vals[i].length; j++) data[r0 + i][c0 + j] = vals[i][j];
          }
          return this;
        },
        setValue: function (v) { if (!data[r0]) data[r0] = []; data[r0][c0] = v; return this; },
        setBackground: function () { return this; },
        setFontColor: function () { return this; },
        setFontWeight: function () { return this; },
        setHorizontalAlignment: function () { return this; },
        setWrap: function () { return this; }
      };
    },
    appendRow: function (row) { data.push(row.slice()); return this; }
  };
}

function makeSpreadsheet(state) {
  return {
    getSheetByName: function (name) { return state.sheets[name] || null; }
  };
}

/* ---------------- Apps Script service stubs ---------------- */

function buildSandbox(state) {
  const sandbox = {
    console: console,
    module: { exports: {} },
    exports: {},
    globalThis: {}
  };
  sandbox.globalThis = sandbox;

  sandbox.SpreadsheetApp = {
    openById: function () { return makeSpreadsheet(state); },
    getUi: function () {
      return { alert: function (m) { state.alerts.push(m); },
        createMenu: function () { const api = { addItem: function () { return api; }, addSeparator: function () { return api; }, addToUi: function () { return api; } }; return api; } };
    }
  };

  sandbox.GmailApp = {
    search: function () { return state.threads; },
    createDraft: function (to, subject, body, opts) {
      state.drafts.push({ to: to, subject: subject, body: body, options: opts || {} });
      return { getId: function () { return 'draft-' + state.drafts.length; } };
    },
    // Forbidden send APIs are intentionally traps: if the code ever calls them
    // the test suite fails loudly.
    sendEmail: function () { throw new Error('FORBIDDEN: GmailApp.sendEmail called'); }
  };
  sandbox.MailApp = {
    sendEmail: function () { throw new Error('FORBIDDEN: MailApp.sendEmail called'); }
  };

  sandbox.ScriptApp = {
    WeekDay: { WEDNESDAY: 'WEDNESDAY' },
    getProjectTriggers: function () { return state.triggers.slice(); },
    deleteTrigger: function (t) {
      const i = state.triggers.indexOf(t);
      if (i !== -1) state.triggers.splice(i, 1);
      state.deletedTriggers.push(t);
    },
    newTrigger: function (handler) {
      const spec = { handler: handler, type: null, days: null, hour: null, weekday: null, tz: null };
      const builder = {
        timeBased: function () { return builder; },
        everyDays: function (n) { spec.type = 'daily'; spec.days = n; return builder; },
        onWeekDay: function (w) { spec.type = 'weekly'; spec.weekday = w; return builder; },
        atHour: function (h) { spec.hour = h; return builder; },
        inTimezone: function (tz) { spec.tz = tz; return builder; },
        create: function () {
          const trig = { getHandlerFunction: function () { return handler; }, _spec: spec };
          state.triggers.push(trig);
          state.createdTriggers.push(spec);
          return trig;
        }
      };
      return builder;
    }
  };

  sandbox.LockService = {
    getScriptLock: function () {
      return {
        tryLock: function () { if (state.lockHeld) return false; state.lockHeld = true; return true; },
        releaseLock: function () { state.lockHeld = false; }
      };
    }
  };

  sandbox.PropertiesService = {
    getScriptProperties: function () {
      return {
        setProperties: function (p) { Object.keys(p).forEach(function (k) { state.props[k] = p[k]; }); return this; },
        getProperties: function () { return Object.assign({}, state.props); }
      };
    }
  };

  sandbox.Session = {
    getActiveUser: function () { return { getEmail: function () { return state.activeUser; } }; },
    getEffectiveUser: function () { return { getEmail: function () { return state.activeUser; } }; }
  };

  sandbox.Utilities = {
    DigestAlgorithm: { MD5: 'MD5' },
    computeDigest: function (algo, text) {
      // Deterministic pseudo-digest (not cryptographic; test-only).
      const s = String(text);
      const out = [];
      for (let i = 0; i < 16; i++) {
        let h = 0;
        for (let j = 0; j < s.length; j++) h = (h * 31 + s.charCodeAt(j) + i * 7) & 0xff;
        out.push(h);
      }
      return out;
    },
    formatDate: function (date, tz, fmt) {
      // Minimal formatter sufficient for the patterns the code uses.
      const p2 = function (n) { return ('0' + n).slice(-2); };
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let out = fmt;
      out = out.replace('yyyy', date.getFullYear());
      out = out.replace('MMM', months[date.getMonth()]);
      out = out.replace('MM', p2(date.getMonth() + 1));
      out = out.replace('dd', p2(date.getDate()));
      out = out.replace(/d\b/, date.getDate());
      out = out.replace('HH', p2(date.getHours()));
      out = out.replace('mm', p2(date.getMinutes()));
      out = out.replace('ss', p2(date.getSeconds()));
      out = out.replace("'T'", 'T').replace('XXX', '-05:00');
      return out;
    }
  };

  return sandbox;
}

function freshState() {
  return {
    sheets: {},
    threads: [],
    drafts: [],
    alerts: [],
    triggers: [],
    createdTriggers: [],
    deletedTriggers: [],
    props: {},
    activeUser: 'dana@valugrowthpartners.com',
    lockHeld: false
  };
}

/**
 * Load Code.gs into a fresh sandbox. Returns { api, state, sandbox }.
 * `configure(state)` lets a test populate sheets/threads before use.
 */
function load(configure) {
  const state = freshState();
  if (configure) configure(state);
  const sandbox = buildSandbox(state);
  const code = fs.readFileSync(CODE_PATH, 'utf8');
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'Code.gs' });
  return { api: sandbox.module.exports, state: state, sandbox: sandbox };
}

/* ---------------- helpers to build standard sheets ---------------- */

const MASTER_HEADERS_BASE = [
  'opportunity_id', 'source_type', 'source_name', 'source_doc_url', 'alert_batch_id',
  'intake_method', 'captured_at', 'opportunity_name', 'organization_name', 'category',
  'subcategory', 'offer_amount', 'offer_type', 'deadline', 'rolling_status',
  'current_status', 'geography', 'industry_focus', 'stage_fit', 'founder_tags',
  'eligibility_summary', 'application_url', 'official_source_url', 'secondary_source_url',
  'contact_name', 'contact_email', 'contact_url', 'summary_1_sentence', 'why_it_matters',
  'vgp_angle', 'vgp_service_tier', 'priority_initial', 'priority_final', 'scoring_total',
  'placement', 'verification_status', 'verified_at', 'verified_by', 'editorial_status',
  'issue_date', 'publish_status', 'duplicate_group', 'confidence', 'notes', 'last_updated'
];

const V2_HEADERS = [
  'funding_type_v2', 'stage_fit_v2', 'capital_value_score', 'network_fit_score',
  'urgency_score', 'effort_ease_score', 'strategic_value_score', 'final_score', 'tier',
  'founder_match_count', 'founder_segments_v2', 'decision_status_v2', 'next_action',
  'next_action_owner', 'next_action_due', 'auto_push_eligible', 'last_scored_at'
];

const MASTER_HEADERS = MASTER_HEADERS_BASE.concat(V2_HEADERS);

const FOUNDER_HEADERS = ['founder_name', 'brand_name', 'email', 'segment', 'sector',
  'subsector', 'capital_need', 'active_status', 'approved_for_auto_push'];

const PUSH_QUEUE_HEADERS = ['queue_id', 'created_at', 'opportunity_id', 'opportunity_name',
  'tier', 'final_score', 'deadline', 'urgency_label', 'founder_match_count',
  'founder_segments', 'recipient_count', 'recipient_group', 'subject_line', 'email_body',
  'send_mode', 'draft_status', 'draft_url', 'notes'];

function configRows(overrides) {
  const base = {
    auto_push_mode: 'DRAFT_ONLY',
    tier_a_threshold: '90',
    tier_b_threshold: '75',
    tier_c_threshold: '60',
    gmail_daily_query: 'newer_than:1d test',
    gmail_weekly_query: 'newer_than:7d test'
  };
  Object.assign(base, overrides || {});
  const rows = [['Key', 'Value']];
  Object.keys(base).forEach(function (k) { rows.push([k, base[k]]); });
  return rows;
}

module.exports = {
  load: load,
  makeSheet: makeSheet,
  configRows: configRows,
  MASTER_HEADERS: MASTER_HEADERS,
  MASTER_HEADERS_BASE: MASTER_HEADERS_BASE,
  V2_HEADERS: V2_HEADERS,
  FOUNDER_HEADERS: FOUNDER_HEADERS,
  PUSH_QUEUE_HEADERS: PUSH_QUEUE_HEADERS
};
