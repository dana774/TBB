// Advisory-pathway qualification — server-side only (see src/pages/api/qualify.ts).
// Confirmed rule (Dana 2026-08-04): a visitor is QUALIFIED for the VGP Insight
// Session fit call ONLY when prospective client AND no prior paid engagement.
// The fit-call URL is returned ONLY for the qualified branch.

export type AdvisorySubmission = {
  audience?: string;
  priorEngagement?: string;
};

export type AdvisoryResult = {
  route: 'qualified' | 'existing_client' | 'institutional' | 'partner' | 'human_review';
  message: string;
  destination: string | null; // fit-call URL only when qualified
};

const norm = (s: unknown) => String(s ?? '').trim().toLowerCase();

const MESSAGES: Record<AdvisoryResult['route'], string> = {
  qualified:
    "You're a fit for a 30-minute VGP Insight Session — a fit, pathway and initial-scoping conversation.",
  existing_client:
    'Welcome back. Sign in and your VGP contact will follow up directly.',
  institutional:
    'Institutions and ESOs have a dedicated pathway — tell us about your cohort and goals.',
  partner:
    "Thanks for your interest in partnering — share how you'd like to work together.",
  human_review:
    "Thank you — we'll review and follow up within two business days.",
};

export function evaluateAdvisory(
  submission: AdvisorySubmission,
  fitCallUrl: string
): AdvisoryResult {
  const audience = norm(submission.audience);
  const prior = norm(submission.priorEngagement);

  const isProspective = audience.includes('prospective');
  const isExisting = audience.includes('existing');
  const isInstitution = audience.includes('institution') || audience.includes('eso');
  const isPartner = audience.includes('partner') || audience.includes('contributor');
  const priorNo = prior === 'no' || prior === 'false' || prior === 'n';

  let route: AdvisoryResult['route'] = 'human_review';
  if (isProspective && priorNo) route = 'qualified';
  else if (isExisting) route = 'existing_client';
  else if (isInstitution) route = 'institutional';
  else if (isPartner) route = 'partner';

  return {
    route,
    message: MESSAGES[route],
    destination: route === 'qualified' ? fitCallUrl : null,
  };
}
