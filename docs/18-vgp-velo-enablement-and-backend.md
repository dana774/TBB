# 18 — VGP Advisory-Pathway: Velo Backend + Build Spec (IMPLEMENTATION-READY)

Server-side qualification for `/advisory-pathway` (doc 14). Site: `Vgp Staging 2026` (`6b5d8f63-…`), Studio. **Velo/Dev Mode: ENABLED by Dana 2026-08-04.** Qualifying rule **confirmed by Dana 2026-08-04** (below). Nothing here publishes; the live VGP site is untouched.

## Confirmed qualification rule
Intake asks two qualifying questions; a visitor sees the **VGP Insight Session** fit-call button only when **prospective client AND no prior paid engagement**.
| Audience | Prior paid engagement | Result |
|---|---|---|
| Prospective client | No | **QUALIFIED → fit-call button** |
| Prospective client | Yes | Human review (no Calendly) |
| Existing client | — | Sign-in / direct contact (no Calendly) |
| Institution / ESO | — | Institutional-inquiry pathway |
| Partner or contributor | — | Partner pathway |
| Anything ambiguous | — | Human review, 2-business-day ack |

The fit-call URL is returned **only** for the qualified branch — never rendered for any other result, never in nav/footer/sitemap.

## Part A — Velo enablement (DONE)
Wix Studio → **Dev Mode** toggle → on. Code panel with `Backend` / `Public` / page code now available.

## Part B — Build order (what's code vs editor)
1. **Backend module** — paste Part C into a new `Backend` file. *(code, provided)*
2. **Advisory-intake form** — build per Part D spec in the Wix Forms editor (or I create it via the Forms API when the connector is stable). *(spec, provided)*
3. **Page elements** — place the form + result text + hidden fit-call button on the `/advisory-pathway` page. *(editor list, Part E)*
4. **Page code** — paste Part F into the page's code. *(code, provided)*
5. **Test** — Part G.

## Part C — Backend module → create `backend/advisoryPathway.web.js`
Current Velo web-module format (`.web.js`). The approved fit-call URL lives **server-side only** and is returned solely for the qualified branch, so it is never in client source for non-qualified visitors.
```js
// backend/advisoryPathway.web.js
import { Permissions, webMethod } from 'wix-web-module';

const APPROVED_FIT_CALL = 'https://calendly.com/valugrowthpartners/vgp-insight-session';

/**
 * Server-side advisory-pathway qualification.
 * Input: { audience, priorEngagement } (values from the form's field keys — see Part D).
 * Output: { route, message, destination } — destination is the fit-call URL ONLY when qualified, else null.
 */
export const evaluateAdvisoryPathway = webMethod(
  Permissions.Anyone,
  async (submission) => {
    const audience = String(submission.audience || '').toLowerCase();
    const prior = String(submission.priorEngagement || '').toLowerCase();

    let route = 'human_review';
    if (audience === 'prospective_client' && prior === 'no') route = 'qualified';
    else if (audience === 'existing_client') route = 'existing_client';
    else if (audience === 'institution_eso') route = 'institutional';
    else if (audience === 'partner_contributor') route = 'partner';

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
> `.jsw` alternative: if your editor uses classic web modules, name the file `backend/advisoryPathway.jsw` and replace the `webMethod(Permissions.Anyone, async (submission) => { … })` wrapper with `export async function evaluateAdvisoryPathway(submission) { … }` (same body).

## Part D — Advisory-intake form spec (Wix Forms editor)
Form name: **Advisory Pathway Intake**. Set each option's **value** exactly as shown (label is what visitors see; value is what the backend reads — Wix Forms lets you set both).
| # | Field label | Type | Required | Field key | Option values (label → value) |
|---|---|---|---|---|---|
| 1 | Full name | Text | Yes | `name` | — |
| 2 | Email | Email | Yes | `email` | — |
| 3 | Which best describes you? | Radio (single) | Yes | `audience` | Prospective client → `prospective_client` · Existing client → `existing_client` · Institution or ESO → `institution_eso` · Partner or contributor → `partner_contributor` |
| 4 | Have you previously engaged VGP for paid advisory or a program? | Radio (single) | Yes | `priorEngagement` | Yes → `yes` · No → `no` |
| 5 | Company / organization | Text | No | `company` | — |
| 6 | What would you like help with? | Long text | No | `message` | — |
CRM: on submit, label the contact (`custom.institutional-inquiry` / `custom.partner-contributor` / advisory) per doc 03.

## Part E — Page elements (Studio editor, `/advisory-pathway`)
Place on the page (or a results section) and set these element IDs in the editor's properties panel:
- **The form** (Advisory Pathway Intake) → keep default or set ID `advisoryForm`.
- **Result text** → ID `resultMessage`. Set **Hidden on load** (Properties → uncheck "Visible").
- **Fit-call button** → ID `fitCallButton`, label "Schedule Your VGP Insight Session". Set **Hidden on load** (critical: it must not be in the initial DOM). Link is set by code at runtime.
- (Optional) pathway buttons for institutional / partner / sign-in branches, shown by extending the page code.

## Part F — Page code (paste into the `/advisory-pathway` page code)
```js
import { evaluateAdvisoryPathway } from 'backend/advisoryPathway.web';

$w.onReady(() => {
  $w('#advisoryForm').onWixFormSubmitted(async (event) => {
    // event.fields is keyed by field key in current Wix Forms.
    // If your form returns an array of {fieldName, fieldValue}, map it to an object first.
    const f = event.fields || {};
    const audience = f.audience ?? f['audience'];
    const priorEngagement = f.priorEngagement ?? f['priorEngagement'];

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
    // Optional: fire analytics 'vgp_insight_session_click' on #fitCallButton click.
  });
});
```
> If `onWixFormSubmitted` gives `event.fields` as an array, normalize first:
> `const f = Object.fromEntries((event.fields||[]).map(x => [x.fieldName || x.id, x.fieldValue ?? x.value]));`

## Part G — Test (before relying on it)
1. Preview the page. Submit as **Prospective client + No** → result message shows AND the fit-call button appears linking to `vgp-insight-session`.
2. Submit as **Prospective client + Yes** → human-review message, **no** button.
3. Submit as **Existing client / Institution / Partner** → the matching message, **no** button.
4. View page source on a non-qualified result → confirm the Calendly URL is **absent** (it's only injected for the qualified branch).
5. Keep the site in **draft** — do not publish.

## Guardrails
Fit-call destination returned only for the qualified branch · button hidden on load · no private/active-client or sponsored-program URL anywhere · Calendly schedules approved conversations only, never the qualification layer · nothing published · live VGP site untouched.
