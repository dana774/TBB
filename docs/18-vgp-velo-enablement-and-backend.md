# 18 — Enabling Velo + VGP Advisory-Pathway Backend

Answers "how do I enable Velo," and provides the ready-to-paste server-side qualification code for `/advisory-pathway` (doc 14 §advisory-pathway). Site: `Vgp Staging 2026` (`6b5d8f63-…`), Studio, **Velo currently DISABLED**.

## Part A — How Dana enables Velo (2 minutes, in the editor)
Velo (Wix Code) cannot be turned on through the REST API in a way that composes pages, so this is a quick editor toggle:

1. Open **Vgp Staging 2026** in the **Wix Studio editor** (manage.wix.com → the site → Edit Site).
2. In the top bar, find **Dev Mode** (the `</>` / "Dev Mode" control, usually top-right).
3. Click **Turn on Dev Mode** (a.k.a. Enable Velo / Wix Code). Confirm if prompted.
4. The editor now shows a **Code** panel with `Backend`, `Public`, and page-code (`$w`) sections, plus a `backend/` folder.
5. Save. (After this, `GetSiteContext` will report **Velo: Enabled**.)

Nothing publishes by doing this — Dev Mode is an editor capability on the draft site.

## Part B — Why the code still goes in editor-side
Even with Velo on, Velo backend/page code is added in the **editor** (paste into the Code panel) or synced with the **Wix CLI** (`wix dev`) — there is no MCP/REST endpoint that deploys Velo code into a site. So the split is:
- **I provide** the exact backend module + page code (below), version-controlled here.
- **Dana / a dev** pastes it into the site's Code panel (or syncs via Wix CLI), then binds the advisory-intake form to it.

## Part C — Backend module (paste into `backend/advisoryPathway.jsw`)
Server-side evaluation keeps the RestrictedRoutes destinations unqueryable from the client (the reason VGP keeps server-side qualification). Uses the **real** RestrictedRoutes fields verified 2026-07-24: `slug`, `status`, `routeType`, `routeUrl`, `notes`, `audience`, `title`.

```js
// backend/advisoryPathway.jsw
import wixData from 'wix-data';

const APPROVED_FIT_CALL = 'https://calendly.com/valugrowthpartners/vgp-insight-session';

/**
 * Evaluate an advisory-pathway submission server-side and return the next step.
 * Only a qualified prospective client receives the fit-call destination.
 * CONFIRM the exact qualifying field names/values with Dana before go-live.
 */
export async function evaluateAdvisoryPathway(submission) {
  const audience = (submission.audience || '').toLowerCase();
  const isExistingClient = (submission.existingClient || '').toLowerCase() === 'yes';

  // --- routing decision ---
  let routeSlug = 'human_review_required';
  if (!isExistingClient && audience.includes('prospective')) {
    routeSlug = 'qualified_prospective_client';
  } else if (audience.includes('institution') || audience.includes('eso')) {
    routeSlug = 'institutional_pathway';
  } else if (isExistingClient) {
    routeSlug = 'existing_client';           // sign-in; private scheduling by direct comms only
  }

  // --- look up the route in the ADMIN-only collection (server-side) ---
  const result = await wixData
    .query('RestrictedRoutes')
    .eq('slug', routeSlug)
    .find({ suppressAuth: true });           // admin-read collection; never expose to client
  const route = result.items[0] || {};

  // Destination is returned ONLY for a route explicitly marked public AND
  // carrying the approved fit-call URL. Everything else returns null.
  const isPublic = (route.routeType || '').toLowerCase() === 'public';
  const destination =
    isPublic && route.routeUrl === APPROVED_FIT_CALL ? route.routeUrl : null;

  return {
    routeSlug,
    message: route.notes || '',
    destination,                             // null for all non-qualified branches
  };
}
```

## Part D — Page code (paste into the `/advisory-pathway` results page code)
```js
// Page: Advisory Pathway (results)
import { evaluateAdvisoryPathway } from 'backend/advisoryPathway';

$w.onReady(() => {
  // Bind to the advisory-intake Wix Form's submit event (Forms app),
  // or call after your multi-step form collects answers.
  $w('#advisoryForm').onWixFormSubmitted(async (event) => {
    const submission = event.fields; // map to {audience, existingClient, ...}
    const { destination, message } = await evaluateAdvisoryPathway(submission);

    $w('#resultMessage').text = message || 'Thank you — we will follow up within two business days.';

    if (destination) {
      $w('#fitCallButton').link = destination;   // approved vgp-insight-session only
      $w('#fitCallButton').label = 'Schedule Your VGP Insight Session';
      $w('#fitCallButton').show();               // hidden by default in the editor
      // fire analytics: vgp_insight_session_click on click
    } else {
      $w('#fitCallButton').hide();               // never render the link otherwise
    }
  });
});
```

## Part E — Wiring & guardrails
- In the editor, set `#fitCallButton` **hidden on load** so the fit-call link is never in the initial DOM; it is set + shown only when `destination` is non-null (qualified prospective client). This is the server-gated equivalent of the Shopify rule.
- Never store or render private/active-client or sponsored-program scheduling URLs. The backend returns `destination` only for the one public route.
- CRM: on submit, label the contact (`custom.institutional-inquiry` / `custom.partner-contributor` / advisory) and assign owner per doc 03. Add server-side inside the module if desired.
- **Confirm the advisory qualifying questions** (audience, existing-client) with Dana — the field names above are the contract; adjust to the final Wix Form field keys.

## Status
Velo enablement = **Dana action** (Part A). Backend + page code = **provided here**, ready to paste once Velo is on. This does not publish anything and does not touch the live VGP site.
