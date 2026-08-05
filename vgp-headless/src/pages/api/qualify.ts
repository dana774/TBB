import type { APIRoute } from 'astro';
import { evaluateAdvisory } from '../../lib/qualify';
import { upsertLead, createAdvisoryDeal } from '../../lib/hubspot';

// Server-rendered endpoint: qualification runs on the server, so the fit-call
// URL is never in client source for non-qualified visitors. Also captures the
// lead into HubSpot with its pathway (when name/email are provided).
export const prerender = false;

const FIT_CALL_URL =
  import.meta.env.FIT_CALL_URL ||
  'https://calendly.com/valugrowthpartners/vgp-insight-session';

export const POST: APIRoute = async ({ request }) => {
  let body: any = {};
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      body = await request.json();
    } else {
      const form = await request.formData();
      body = Object.fromEntries(form.entries());
    }
  } catch {
    body = {};
  }

  const result = evaluateAdvisory(
    { audience: body.audience, priorEngagement: body.priorEngagement },
    FIT_CALL_URL
  );

  // Capture the advisory lead into HubSpot with its pathway (no-ops without
  // email/token). Fully isolated: any failure here must never affect the
  // qualification result the visitor sees.
  if (body.email) {
    try {
      const qualified = result.route === 'qualified';
      const lead = await upsertLead({
        email: String(body.email),
        firstname: body.name?.split?.(' ')?.[0],
        lastname: body.name?.split?.(' ')?.slice(1).join(' '),
        vgp_pathway: result.route,
        vgp_source: 'advisory-pathway',
        // CRM taxonomy (migration workbook)
        vgp_primary_relationship_type:
          result.route === 'existing_client' ? 'Active Client' : 'Consulting Prospect',
        vgp_business_unit: 'Value Growth Partners',
        vgp_primary_interest: 'Consulting',
        vgp_original_relationship_source: 'Website',
        vgp_scheduling_eligibility: qualified ? 'Qualified prospect' : 'Public intake only',
        vgp_data_review_status: 'Unreviewed',
      });
      // A qualified prospective client is a real opportunity → create a Deal.
      if (result.route === 'qualified' && lead.contactId) {
        await createAdvisoryDeal(lead.contactId, `VGP Advisory — ${body.name || body.email}`);
      }
    } catch {
      /* capture is best-effort; never block the response */
    }
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
