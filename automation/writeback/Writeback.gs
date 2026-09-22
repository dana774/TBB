/**
 * VGP Writeback Automation — Writeback.gs
 * Add this file to the existing "VGP Funding OS v2" Apps Script project.
 *
 * Purpose: make post-publication close-outs fully automatic. Publishing
 * agents deliver write-backs either by POSTing JSON to this project's web
 * app (instant) or by dropping WRITEBACK-* / APPEND-* files into the VGP
 * funding Drive folders (auto-ingested hourly).
 *
 * Safety: writes only to the whitelisted tabs of the Master sheet and the
 * working doc. Never touches 09_Email_Groups, never deletes rows, never
 * sends email. Appends are idempotent (rows with an already-present ID are
 * skipped). Every application is logged to 08_Agent_Run_Log.
 *
 * One-time setup: run setupVGPWritebackAutomation(), then deploy as a web
 * app (execute as Me; access: Anyone). See the activation runbook.
 */

const WB = Object.freeze({
  MASTER_SHEET_ID: '1RnXhEMl_Y8mzlKGvvof38_oGrlRfB8NIlVIQQS58rnA',
  DATA_FOLDER_ID: '1IKJ5VhnBkJEf-fQbzALfBwPxmBLZMYB1',
  DOCS_FOLDER_ID: '1chDTskciv57m6oRoYetvMcgVqd5cB6yx',
  WORKING_DOC_ID: '1LvcJ9NtTkFNvoIE8jSlcD2fwRinLShOVr8axaSZLkZU',
  TIME_ZONE: 'America/New_York',
  ALLOWED_TABS: ['03_Opportunity_Master', '05_Hotlist_Queue',
    '06_Published_Issues', '07_Source_Log', '08_Agent_Run_Log'],
  ID_COLUMNS: {
    '05_Hotlist_Queue': 'queue_id',
    '06_Published_Issues': 'issue_name',
    '07_Source_Log': 'source_id',
    '08_Agent_Run_Log': 'run_id'
  },
  MASTER_TAB: '03_Opportunity_Master',
  MASTER_KEY: 'opportunity_id',
  RUN_LOG_TAB: '08_Agent_Run_Log',
  POLL_FUNCTION: 'processWritebackFiles',
  TOKEN_PROPERTY: 'WRITEBACK_TOKEN',
  VERSION: 'writeback-1.0'
});

/** One-time installer: hourly poller trigger + token. Run manually once. */
function setupVGPWritebackAutomation() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === WB.POLL_FUNCTION) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger(WB.POLL_FUNCTION).timeBased().everyHours(1).create();
  const props = PropertiesService.getScriptProperties();
  let token = props.getProperty(WB.TOKEN_PROPERTY);
  if (!token) {
    token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty(WB.TOKEN_PROPERTY, token);
  }
  wbLogRun_('SETUP', 'Writeback automation installed: hourly file poller active. ' +
    'Deploy as web app for instant mode. Token property set.');
  Logger.log('Writeback automation installed. WRITEBACK_TOKEN (share only with authorized agents):\n' + token);
}

/** Web app entry point. POST JSON:
 * { "token": "...", "action": "ping" }  → health check
 * { "token": "...", "action": "writeback",
 *   "source": "agent name",
 *   "appends": { "05_Hotlist_Queue": [ {col: val, ...}, ... ], ... },
 *   "cell_edits": [ {"opportunity_id":"OPP-..","field":"notes","value":"..","mode":"set"|"append"}, ... ],
 *   "working_doc_append": "text",
 *   "run_note": "free text for the run log" }
 */
function doPost(e) {
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return wbJson_({ ok: false, error: 'Invalid JSON' });
  }
  const expected = PropertiesService.getScriptProperties().getProperty(WB.TOKEN_PROPERTY);
  if (!expected || !payload.token || payload.token !== expected) {
    return wbJson_({ ok: false, error: 'Unauthorized' });
  }
  if (payload.action === 'ping') {
    return wbJson_({ ok: true, version: WB.VERSION, time: new Date().toISOString() });
  }
  if (payload.action !== 'writeback') {
    return wbJson_({ ok: false, error: 'Unknown action' });
  }
  try {
    const result = applyWriteback_(payload, 'webhook:' + (payload.source || 'unknown'));
    return wbJson_({ ok: true, version: WB.VERSION, result: result });
  } catch (err) {
    wbLogRun_('ERROR', 'Webhook writeback failed: ' + err);
    return wbJson_({ ok: false, error: String(err) });
  }
}

/** Hourly poller: ingest WRITEBACK-* sheets and APPEND-* docs, then archive them. */
function processWritebackFiles() {
  const results = [];
  const data = DriveApp.getFolderById(WB.DATA_FOLDER_ID).getFiles();
  while (data.hasNext()) {
    const f = data.next();
    if (f.getName().indexOf('WRITEBACK-') === 0 &&
        f.getMimeType() === 'application/vnd.google-apps.spreadsheet') {
      try {
        const payload = parseWritebackSheet_(f.getId());
        const r = applyWriteback_(payload, 'file:' + f.getName());
        f.setName('APPLIED-' + f.getName());
        results.push(f.getName() + ' → ' + JSON.stringify(r));
      } catch (err) {
        wbLogRun_('ERROR', 'Failed to ingest ' + f.getName() + ': ' + err);
      }
    }
  }
  const docs = DriveApp.getFolderById(WB.DOCS_FOLDER_ID).getFiles();
  while (docs.hasNext()) {
    const f = docs.next();
    if (f.getName().indexOf('APPEND-') === 0 &&
        f.getMimeType() === 'application/vnd.google-apps.document') {
      try {
        const text = extractAppendText_(f.getId());
        if (text) {
          appendToWorkingDoc_(text);
          f.setName('APPLIED-' + f.getName());
          wbLogRun_('OK', 'Working-doc recap ingested from ' + f.getName());
          results.push(f.getName() + ' → working doc');
        }
      } catch (err) {
        wbLogRun_('ERROR', 'Failed to ingest ' + f.getName() + ': ' + err);
      }
    }
  }
  return results;
}

/** Core application logic shared by both intake paths. */
function applyWriteback_(payload, via) {
  const ss = SpreadsheetApp.openById(WB.MASTER_SHEET_ID);
  const summary = { appended: {}, skipped_existing: {}, cell_edits: 0, cell_edit_skips: 0, working_doc: false, errors: [] };

  if (payload.appends) {
    Object.keys(payload.appends).forEach(function(tab) {
      if (WB.ALLOWED_TABS.indexOf(tab) === -1) {
        summary.errors.push('Tab not allowed: ' + tab);
        return;
      }
      const rows = payload.appends[tab];
      if (!rows || !rows.length) return;
      const r = appendRowsByHeader_(ss, tab, rows, WB.ID_COLUMNS[tab] || null);
      summary.appended[tab] = r.added;
      summary.skipped_existing[tab] = r.skipped;
    });
  }

  if (payload.cell_edits && payload.cell_edits.length) {
    const r = applyCellEdits_(ss, payload.cell_edits);
    summary.cell_edits = r.applied;
    summary.cell_edit_skips = r.skipped;
    r.errors.forEach(function(e) { summary.errors.push(e); });
  }

  if (payload.working_doc_append) {
    appendToWorkingDoc_(payload.working_doc_append);
    summary.working_doc = true;
  }

  wbLogRun_(summary.errors.length ? 'Completed with warnings' : 'Completed',
    'Writeback via ' + via + '. ' + JSON.stringify(summary) +
    (payload.run_note ? ' | ' + payload.run_note : ''));
  return summary;
}

/** Append object-rows to a tab, mapping keys to header names; add missing
 * header columns at the end (same pattern as ensureV2Headers_); skip rows
 * whose ID-column value already exists. */
function appendRowsByHeader_(ss, tabName, rows, idColumn) {
  const sheet = ss.getSheetByName(tabName);
  if (!sheet) throw new Error('Missing tab ' + tabName);
  let headers = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0]
    .map(function(h) { return String(h).trim(); });

  const wanted = {};
  rows.forEach(function(row) {
    Object.keys(row).forEach(function(k) { wanted[k] = true; });
  });
  const missing = Object.keys(wanted).filter(function(k) {
    return headers.map(wbNorm_).indexOf(wbNorm_(k)) === -1;
  });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
  }
  const normHeaders = headers.map(wbNorm_);

  let existingIds = {};
  if (idColumn) {
    const idIdx = normHeaders.indexOf(wbNorm_(idColumn));
    if (idIdx !== -1 && sheet.getLastRow() > 1) {
      sheet.getRange(2, idIdx + 1, sheet.getLastRow() - 1, 1).getValues()
        .forEach(function(v) { if (v[0]) existingIds[String(v[0]).trim()] = true; });
    }
  }

  const out = [];
  let skipped = 0;
  rows.forEach(function(row) {
    if (idColumn && row[idColumn] && existingIds[String(row[idColumn]).trim()]) {
      skipped++;
      return;
    }
    const line = headers.map(function() { return ''; });
    Object.keys(row).forEach(function(k) {
      const idx = normHeaders.indexOf(wbNorm_(k));
      if (idx !== -1) line[idx] = row[k];
    });
    out.push(line);
  });
  if (out.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, out.length, headers.length).setValues(out);
  }
  return { added: out.length, skipped: skipped };
}

/** Apply per-cell edits to 03_Opportunity_Master by opportunity_id + field.
 * mode "append" adds to the existing cell (skipped if already present). */
function applyCellEdits_(ss, edits) {
  const sheet = ss.getSheetByName(WB.MASTER_TAB);
  if (!sheet) throw new Error('Missing tab ' + WB.MASTER_TAB);
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(function(h) { return String(h).trim(); });
  let normHeaders = headers.map(wbNorm_);
  const keyIdx = normHeaders.indexOf(wbNorm_(WB.MASTER_KEY));
  if (keyIdx === -1) throw new Error('No ' + WB.MASTER_KEY + ' column in ' + WB.MASTER_TAB);

  const ids = sheet.getRange(2, keyIdx + 1, Math.max(1, sheet.getLastRow() - 1), 1).getValues();
  const rowOf = {};
  ids.forEach(function(v, i) { if (v[0]) rowOf[String(v[0]).trim()] = i + 2; });

  let applied = 0, skipped = 0;
  const errors = [];
  edits.forEach(function(edit) {
    const id = String(edit.opportunity_id || '').trim();
    const rowNum = rowOf[id];
    if (!rowNum) {
      if (/^OPP-/.test(id)) errors.push('opportunity_id not found: ' + id);
      skipped++;
      return;
    }
    let field = String(edit.field || '').trim();
    let mode = edit.mode || 'set';
    const appendMatch = field.match(/^(.*)\s*\(APPEND\)$/i);
    if (appendMatch) { field = appendMatch[1].trim(); mode = 'append'; }
    let colIdx = normHeaders.indexOf(wbNorm_(field));
    if (colIdx === -1) {
      sheet.getRange(1, headers.length + 1).setValue(field);
      headers.push(field);
      normHeaders.push(wbNorm_(field));
      colIdx = headers.length - 1;
    }
    const cell = sheet.getRange(rowNum, colIdx + 1);
    const value = String(edit.value === undefined ? edit.new_value : edit.value);
    if (mode === 'append') {
      const current = String(cell.getValue() || '');
      if (current.indexOf(value) !== -1) { skipped++; return; }
      cell.setValue(current ? current + ' | ' + value : value);
    } else {
      cell.setValue(value);
    }
    applied++;
  });
  return { applied: applied, skipped: skipped, errors: errors };
}

/** Parse a WRITEBACK-* sheet (block format with ">>>" markers) into a payload. */
function parseWritebackSheet_(fileId) {
  const values = SpreadsheetApp.openById(fileId).getSheets()[0].getDataRange().getValues();
  const payload = { appends: {}, cell_edits: [] };
  let mode = null, target = null, header = null;

  values.forEach(function(rowArr) {
    const first = String(rowArr[0] || '').trim();
    if (first.indexOf('>>>') === 0) {
      const appendMatch = first.match(/APPEND TO (\S+)/);
      const editMatch = /CELL EDITS TO/.test(first);
      if (editMatch) { mode = 'edits'; header = null; }
      else if (appendMatch) { mode = 'append'; target = appendMatch[1]; header = null; }
      else { mode = null; }
      return;
    }
    if (!mode) return;
    const nonEmpty = rowArr.some(function(c) { return String(c).trim() !== ''; });
    if (!nonEmpty) return;

    if (mode === 'append') {
      if (!header) {
        header = rowArr.map(function(c) { return String(c).trim(); });
        return;
      }
      const obj = {};
      header.forEach(function(h, i) {
        if (h && String(rowArr[i]).trim() !== '') obj[h] = rowArr[i];
      });
      if (Object.keys(obj).length) {
        if (!payload.appends[target]) payload.appends[target] = [];
        payload.appends[target].push(obj);
      }
    } else if (mode === 'edits') {
      const id = String(rowArr[0]).trim();
      if (wbNorm_(id) === wbNorm_('opportunity_id')) return; // header row
      if (!/^OPP-/.test(id)) return; // commentary rows
      payload.cell_edits.push({ opportunity_id: id, field: String(rowArr[1]).trim(), value: rowArr[2] });
    }
  });
  return payload;
}

/** Pull the paste-ready text out of an APPEND-* doc (after the ──── divider). */
function extractAppendText_(fileId) {
  const text = DocumentApp.openById(fileId).getBody().getText();
  const idx = text.indexOf('────');
  if (idx === -1) return text.trim();
  return text.slice(text.indexOf('\n', idx) + 1).trim();
}

function appendToWorkingDoc_(text) {
  const body = DocumentApp.openById(WB.WORKING_DOC_ID).getBody();
  body.appendParagraph('');
  String(text).split('\n').forEach(function(line) { body.appendParagraph(line); });
}

/** Append a run row to 08_Agent_Run_Log using header mapping. */
function wbLogRun_(status, notes) {
  try {
    const ss = SpreadsheetApp.openById(WB.MASTER_SHEET_ID);
    const stamp = Utilities.formatDate(new Date(), WB.TIME_ZONE, "yyyyMMdd-HHmmss");
    appendRowsByHeader_(ss, WB.RUN_LOG_TAB, [{
      run_id: 'RUN-' + stamp + '-WRITEBACK',
      agent_name: 'VGP Writeback Automation',
      run_time: Utilities.formatDate(new Date(), WB.TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ssXXX"),
      input_scope: 'Automated writeback application',
      status: status,
      notes: notes
    }], null);
  } catch (err) {
    Logger.log('wbLogRun_ failed: ' + err);
  }
}

function wbNorm_(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function wbJson_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
