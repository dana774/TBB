# 18 — VGP Advisory-Pathway: Velo Backend + Build Spec (IMPLEMENTATION-READY)

Server-side qualification for `/advisory-pathway` (doc 14). Site: `Vgp Staging 2026` (`6b5d8f63-…`), Studio. **Velo/Dev Mode: ENABLED (Dana, 2026-08-04).** Qualifying rule **confirmed (Dana, 2026-08-04)**. **Advisory Pathway Intake form: CREATED via API 2026-08-04** (id `5b3336f8-45de-458e-a47a-7dbe63eb8c50`) — see Part D for the one editor tweak it needs. Nothing published; live VGP site untouched.

## Confirmed qualification rule
A visitor sees the **VGP Insight Session** fit-call button only when **prospective client AND no prior paid engagement**.
| Audience | Prior paid engagement | Result |
|---|---|---|
| Prospective client | No | **QUALIFIED → fit-call button** |
| Prospective client | Yes | Human review (no Calendly) |
| Existing client | — | Sign-in / direct contact (no Calendly) |
| Institution / ESO | — | Institutional-inquiry pathway |
| Partner or contributor | — | Partner pathway |
| Anything ambiguous | — | Human review, 2-business-day ack |

The fit-call URL is returned **only** for the qualified branch — never for any other result, never in nav/footer/sitemap.

## Part A — Velo enablement (DONE)
Wix Studio → Dev Mode → on. Code panel with `Backend` / `Public` / page code available.

## Part B — Remaining steps (what's done vs to-do)
1. **Backend module** — paste Part C into a new `Backend` file. *(code below)*
2. **Advisory-intake form** — ✅ created via API. **One editor tweak:** set the two questions to radio buttons (Part D) — the Forms REST API on this site silently drops radio options (verified twice), so this must be done in the editor.
3. **Page elements** — place the form + result text + hidden fit-call button (Part E). *(editor)*
4. **Page code** — paste Part F. *(code below)*
5. **Test** — Part G.

The backend and page code are written to be **tolerant**: they match the two answers by content (label text *or* coded value), so the flow works no matter how the radio options end up formatted in the editor.

## Part C — Backend module → create `backend/advisoryPathway.web.js`
```js
// backend/advisoryPathway.web.js
import { Permissions, webMethod } from 'wix-web-module';

const APPROVED_FIT_CALL = 'https://calendly.com/valugrowthpartners/vgp-insight-session';
const norm = (s) => String(s || '').trim().toLowerCase();

/**
 * Server-side advisory-pathway qualification.
 * Tolerant matching: accepts coded values (prospective_client) OR labels (Prospective client).
 * Returns the fit-call URL ONLY for the qualified branch.
 */
export const evaluateAdvisoryPathway = webMethod(
  Permissions.Anyone,
  async (submission) => {
    const audience = norm(submission.audience);
    const prior = norm(submission.priorEngagement);

    const isProspective = audience.includes('prospective');
    const isExisting    = audience.includes('existing');
    const isInstitution = audience.includes('institution') || audience.includes('eso');
    const isPartner     = audience.includes('partner') || audience.includes('contributor');
    const priorNo       = prior === 'no' || prior === 'false' || prior === 'n';

    let route = 'human_review';
    if (isProspective && priorNo) route = 'qualified';
    else if (isExisting)    route = 'existing_client';
    else if (isInstitution) route = 'institutional';
    else if (isPartner)     route = 'partner';

    const messages = {
      qualified: "You're a fit for a 30-minute VGP Insight Session — a fit, pathway and initial-scoping conversation.",
      existing_client: "Welcome back. Sign in and your VGP contact will follow up directly.",
      institutional: "Institutions and ESOs have a dedicated pathway — tell us about your cohort and goals.",
      partner: "Thanks for your interest in partnering — share how you'd like to work together.",
      human_review: "Thank you — we'll review and follow up within two business days."
    };

    const destination = route === 'qualified' ? APPROVED_FIT_CALL : null;
    return { route, message: messages[route], destination };
  }
);
```
> `.jsw` alternative: name the file `advisoryPathway.jsw` and use `export async function evaluateAdvisoryPathway(submission) { … }` (same body, no `webMethod` wrapper).

## Part D — Advisory Pathway Intake form (CREATED via API — one editor tweak)
Form id `5b3336f8-45de-458e-a47a-7dbe63eb8c50`. Already has: First name, Last name, Email (mapped to Contacts), the two questions, Company, Message, Submit, and a thank-you message. Open it in **Add → Forms → your forms → Advisory Pathway Intake** (or Forms & Submissions in the dashboard) and make **one change**:

- Change **"Which best describes you?"** and **"Have you previously engaged VGP for paid advisory or a program?"** from text fields to **Radio buttons** (a Selection field).
  - Audience options (labels): **Prospective client · Existing client · Institution or ESO · Partner or contributor**
  - Prior-engagement options (labels): **No · Yes**
- Option *values* don't matter — the backend matches on the label text too. Just make them selectable choices, not free text.

(Why the editor: the site's Forms REST API silently converts radio options to plain text — verified on create and update 2026-08-04 — so the choice UI has to be set in the editor.)

## Part E — Page elements (Studio editor, `/advisory-pathway`)
- **The form** (Advisory Pathway Intake) → ID `advisoryForm`.
- **Result text** → ID `resultMessage`. **Hidden on load.**
- **Fit-call button** → ID `fitCallButton`, label "Schedule Your VGP Insight Session", **Hidden on load** (must not be in the initial DOM). Link set by code at runtime.
- (Optional) pathway buttons for institutional / partner / sign-in branches.

## Part F — Page code (paste into the `/advisory-pathway` page code)
Reads the two answers by field key when present, else detects them by content — robust to whatever keys/labels the editor produces.
```js
import { evaluateAdvisoryPathway } from 'backend/advisoryPathway.web';

$w.onReady(() => {
  $w('#advisoryForm').onWixFormSubmitted(async (event) => {
    // Normalize the submission into a plain {key: value} object.
    const raw = event.fields || {};
    const byKey = Array.isArray(raw)
      ? Object.fromEntries(raw.map(x => [x.fieldName || x.id, x.fieldValue ?? x.value]))
      : raw;

    let audience = byKey.audience;
    let priorEngagement = byKey.priorEngagement;

    // Fallback: find the answers by content if the keys differ.
    if (!audience || !priorEngagement) {
      const vals = Object.values(byKey).map(v => String(v).toLowerCase());
      audience = audience || vals.find(v => /prospective|existing|institution|eso|partner|contributor/.test(v)) || '';
      priorEngagement = priorEngagement || vals.find(v => v === 'no' || v === 'yes' || v === 'true' || v === 'false') || '';
    }

    const { message, destination } = await evaluateAdvisoryPathway({ audience, priorEngagement });

    $w('#resultMessage').text = message;
    $w('#resultMessage').show();

    if (destination) {
      $w('#fitCallButton').link = destination;   // approved vgp-insight-session ONLY
      $w('#fitCallButton').target = '_blank';
      $w('#fitCallButton').show();
    } else {
      $w('#fitCallButton').hide();
    }
    // Optional: fire analytics 'vgp_insight_session_click' on the button.
  });
});
```

## Part G — Test (before relying on it)
1. Preview → submit **Prospective client + No** → message shows AND the fit-call button appears linking to `vgp-insight-session`.
2. **Prospective client + Yes** → human-review message, **no** button.
3. **Existing client / Institution / Partner** → matching message, **no** button.
4. View source on a non-qualified result → the Calendly URL is **absent** (injected only for the qualified branch).
5. Keep the site **draft** — do not publish.

## Part H — VGP forms & CRM label inventory (verified 2026-08-04)
All three intake forms exist and are **enabled**; each captures the visitor as a Contact via its `CONTACTS_*` name/email fields. (The institutional + partner forms pre-existed from the earlier staging build; the advisory form was created this session.)
| Form | Form ID | Purpose / page | Segmentation label |
|---|---|---|---|
| Advisory Pathway Intake | `5b3336f8-45de-458e-a47a-7dbe63eb8c50` | `/advisory-pathway` (qualification) | `custom.vgp-qualified-lead` — **apply only on the qualified result**, not every submission |
| Institutional Inquiry | `bfeb795f-543c-40a6-8c29-3712031cfc1c` | `/institutional-inquiry` | `custom.institutional-lead` |
| Partner & Contributor Inquiry | `f37ecc59-bf20-4daf-8485-8ec883f13de7` | `/partner-contributor` | `custom.partner-contributor-lead` (created this session) |
| (Speaking inquiry — build when the Speaking page is composed) | — | `/speaking` | `custom.speaking-lead` |

Contact labels present: `custom.institutional-lead`, `custom.vgp-qualified-lead`, `custom.speaking-lead`, `custom.partner-contributor-lead`. (These supersede the doc 03 placeholder names `custom.institutional-inquiry` / `custom.partner-contributor`.)

**Applying the labels on submission — recommended: Wix Automations** (dashboard → Automations → "When a form is submitted → Add label"), one per form, mapping each form to the label above. This is the standard, safe pattern and doesn't touch the working form schemas. For the **advisory** form, do NOT blanket-label; apply `custom.vgp-qualified-lead` only for the qualified branch — either via an Automation conditioned on the result, or by adding a `wix-crm-backend` label call inside the qualified branch of `advisoryPathway.web.js`.

## Guardrails
Fit-call destination returned only for the qualified branch · button hidden on load · no private/active-client or sponsored-program URL anywhere · Calendly schedules approved conversations only, never the qualification layer · nothing published · live VGP site untouched.
