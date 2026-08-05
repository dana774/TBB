import type { APIRoute } from 'astro';
import { upsertLead, type LeadFields } from '../../lib/hubspot';

// Lead capture endpoint for the institutional-inquiry and partner-contributor
// forms. Upserts a HubSpot contact with the pathway/source segmentation.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: any = {};
  try {
    const ct = request.headers.get('content-type') || '';
    body = ct.includes('application/json')
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    body = {};
  }

  const isInstitutional = body.pathway === 'institutional';
  const fields: LeadFields = {
    email: String(body.email || ''),
    firstname: body.firstname || body.name?.split?.(' ')?.[0],
    lastname: body.lastname || body.name?.split?.(' ')?.slice(1).join(' '),
    company: body.company || body.org,
    vgp_pathway: body.pathway,
    vgp_source: body.source,
    vgp_message: body.message || body.detail || body.support || body.goals,
    // CRM taxonomy (migration workbook)
    vgp_primary_relationship_type: isInstitutional ? 'Institutional Partner' : 'Referral Partner',
    vgp_business_unit: 'Value Growth Partners',
    vgp_primary_interest: isInstitutional ? 'Partnership' : 'Partnership',
    vgp_original_relationship_source: 'Website',
    vgp_scheduling_eligibility: isInstitutional ? 'Institutional' : 'Public intake only',
    vgp_data_review_status: 'Unreviewed',
  };

  const result = await upsertLead(fields);
  // Always return success to the visitor UX; capture status is logged server-side.
  return new Response(JSON.stringify({ received: true, captured: result.ok }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
