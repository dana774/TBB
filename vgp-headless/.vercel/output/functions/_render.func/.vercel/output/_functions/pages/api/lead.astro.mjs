import { u as upsertLead } from '../../chunks/hubspot_CV74QOTq.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  let body = {};
  try {
    const ct = request.headers.get("content-type") || "";
    body = ct.includes("application/json") ? await request.json() : Object.fromEntries((await request.formData()).entries());
  } catch {
    body = {};
  }
  ({
    email: String(body.email || ""),
    firstname: body.firstname || body.name?.split?.(" ")?.[0],
    lastname: body.lastname || body.name?.split?.(" ")?.slice(1).join(" "),
    company: body.company || body.org,
    vgp_pathway: body.pathway,
    vgp_source: body.source,
    vgp_message: body.message || body.detail || body.support || body.goals
  });
  const result = await upsertLead();
  return new Response(JSON.stringify({ received: true, captured: result.ok }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
