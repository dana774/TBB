import { u as upsertLead } from '../../chunks/hubspot_CV74QOTq.mjs';
export { renderers } from '../../renderers.mjs';

const norm = (s) => String(s ?? "").trim().toLowerCase();
const MESSAGES = {
  qualified: "You're a fit for a 30-minute VGP Insight Session — a fit, pathway and initial-scoping conversation.",
  existing_client: "Welcome back. Sign in and your VGP contact will follow up directly.",
  institutional: "Institutions and ESOs have a dedicated pathway — tell us about your cohort and goals.",
  partner: "Thanks for your interest in partnering — share how you'd like to work together.",
  human_review: "Thank you — we'll review and follow up within two business days."
};
function evaluateAdvisory(submission, fitCallUrl) {
  const audience = norm(submission.audience);
  const prior = norm(submission.priorEngagement);
  const isProspective = audience.includes("prospective");
  const isExisting = audience.includes("existing");
  const isInstitution = audience.includes("institution") || audience.includes("eso");
  const isPartner = audience.includes("partner") || audience.includes("contributor");
  const priorNo = prior === "no" || prior === "false" || prior === "n";
  let route = "human_review";
  if (isProspective && priorNo) route = "qualified";
  else if (isExisting) route = "existing_client";
  else if (isInstitution) route = "institutional";
  else if (isPartner) route = "partner";
  return {
    route,
    message: MESSAGES[route],
    destination: route === "qualified" ? fitCallUrl : null
  };
}

const prerender = false;
const FIT_CALL_URL = "https://calendly.com/valugrowthpartners/vgp-insight-session";
const POST = async ({ request }) => {
  let body = {};
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
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
  if (body.email) {
    await upsertLead({
      email: String(body.email),
      firstname: body.name?.split?.(" ")?.[0],
      lastname: body.name?.split?.(" ")?.slice(1).join(" "),
      vgp_pathway: result.route});
  }
  return new Response(JSON.stringify(result), {
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
