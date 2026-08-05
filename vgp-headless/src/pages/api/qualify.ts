import type { APIRoute } from 'astro';
import { evaluateAdvisory } from '../../lib/qualify';

// Server-rendered endpoint: qualification runs on the server, so the fit-call
// URL is never in client source for non-qualified visitors.
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

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
