import type { APIRoute } from 'astro';
import { upsertLead } from '../../lib/hubspot';

// Calendly → HubSpot: when a fit-call is booked, mark the contact as booked.
// Setup (Dana): Calendly → Integrations → Webhooks → subscribe `invitee.created`
// to https://<your-domain>/api/calendly-webhook. (Optional hardening: verify the
// Calendly-Webhook-Signature with your signing key — set CALENDLY_WEBHOOK_KEY.)
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return new Response('bad request', { status: 400 });
  }

  const evt = body?.event;
  const payload = body?.payload || {};
  const email = payload?.email;

  if (evt === 'invitee.created' && email) {
    const name = String(payload?.name || '');
    await upsertLead({
      email: String(email),
      firstname: name.split(' ')[0] || undefined,
      lastname: name.split(' ').slice(1).join(' ') || undefined,
      vgp_pathway: 'booked_fit_call',
      vgp_source: 'calendly',
    });
  }

  // Always 200 so Calendly doesn't retry on non-actionable events.
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
