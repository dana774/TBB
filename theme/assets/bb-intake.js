/* Brand Blueprint behavior layer: intake branching, directory filters,
   and dataLayer events (doc 08 §8). Progressive enhancement only — every
   flow works (conservatively) without this file. */
(function () {
  'use strict';

  var BRANCH_KEY = 'bb_intake_branch';
  var BRANCHES = [
    'qualified_first_time_founder',
    'prior_dana_relationship',
    'non_founder_pathway',
    'dana_review',
  ];

  function track(eventName, detail) {
    if (!document.body.hasAttribute('data-bb-analytics')) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, detail || {}));
  }

  /* Generic CTA events: route_select, cross_domain_route, brand_blueprint_fit_call_click */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-bb-event]');
    if (!el) return;
    track(el.getAttribute('data-bb-event'), { bb_route: el.getAttribute('data-bb-route') || undefined });
  });

  /* Intake form: start event, branch evaluation, branch persistence */
  var intake = document.getElementById('bb-intake-form');
  if (intake) {
    var started = false;
    intake.addEventListener('input', function () {
      if (started) return;
      started = true;
      track('founder_intake_start');
    });

    intake.addEventListener('submit', function () {
      var founder = intake.querySelector('[name="contact[Founder or business owner]"]:checked');
      var metDana = intake.querySelector('[name="contact[Previously met Dana formally]"]:checked');
      var branch = 'dana_review';
      if (founder && metDana) {
        if (founder.value === 'Yes' && metDana.value === 'No') branch = 'qualified_first_time_founder';
        else if (founder.value === 'Yes') branch = 'prior_dana_relationship';
        else branch = 'non_founder_pathway';
      }
      var field = intake.querySelector('[data-bb-branch-field]');
      if (field) field.value = branch;
      try {
        sessionStorage.setItem(BRANCH_KEY, branch);
      } catch (err) {
        /* storage unavailable → results page falls back to dana_review */
      }
      track('founder_intake_submit', { bb_branch: branch });
    });
  }

  /* Post-submit continue button: carry the branch to the results page */
  var continueBtn = document.getElementById('bb-intake-continue');
  if (continueBtn) {
    var stored = null;
    try {
      stored = sessionStorage.getItem(BRANCH_KEY);
    } catch (err) { /* noop */ }
    if (stored && BRANCHES.indexOf(stored) !== -1) {
      var url = new URL(continueBtn.href, window.location.origin);
      url.searchParams.set('branch', stored);
      continueBtn.href = url.toString();
    }
  }

  /* Results page: reveal exactly one branch (default stays dana_review) */
  var results = document.querySelector('[data-bb-results]');
  if (results) {
    var requested = new URLSearchParams(window.location.search).get('branch');
    if (!requested || BRANCHES.indexOf(requested) === -1) {
      try {
        requested = sessionStorage.getItem(BRANCH_KEY);
      } catch (err) { /* noop */ }
    }
    if (requested && BRANCHES.indexOf(requested) !== -1 && requested !== 'dana_review') {
      results.querySelectorAll('[data-bb-branch]').forEach(function (el) {
        el.hidden = el.getAttribute('data-bb-branch') !== requested;
      });
    }
  }

  /* Founder directory filter chips */
  document.querySelectorAll('[data-bb-filter-group]').forEach(function (group) {
    group.hidden = false;
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.bb-chip');
      if (!chip) return;
      group.querySelectorAll('.bb-chip').forEach(function (c) {
        c.setAttribute('aria-pressed', String(c === chip));
      });
      var value = chip.getAttribute('data-bb-filter');
      var grid = group.closest('[data-bb-founder-grid]');
      if (!grid) return;
      grid.querySelectorAll('[data-bb-founder-cards] > *').forEach(function (card) {
        card.hidden = Boolean(value) && card.getAttribute('data-stage') !== value;
      });
    });
  });
})();
