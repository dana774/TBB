// Content layer. Reads VGP Wix CMS collections when a headless client ID is
// configured (PUBLIC_WIX_CLIENT_ID); otherwise falls back to editorial-review
// seed content so every page renders and looks right during the build-out.
//
// Wiring live data: set PUBLIC_WIX_CLIENT_ID (Wix Headless project client ID)
// and install the optional deps (@wix/sdk, @wix/data). The queryCollection()
// helper below is the single integration point.

export type Item = Record<string, any>;

const CLIENT_ID = import.meta.env.PUBLIC_WIX_CLIENT_ID as string | undefined;

/** Live query against a Wix data collection; returns [] if not configured. */
export async function queryCollection(collectionId: string, limit = 50): Promise<Item[]> {
  if (!CLIENT_ID) return [];
  try {
    // Lazy import so the site builds without the optional deps present.
    // @vite-ignore keeps Vite from trying to resolve/bundle them at build time.
    const { createClient, OAuthStrategy } = await import(/* @vite-ignore */ '@wix/sdk');
    const { items } = await import(/* @vite-ignore */ '@wix/data');
    const client = createClient({
      modules: { items },
      auth: OAuthStrategy({ clientId: CLIENT_ID }),
    });
    const res = await client.items
      .queryDataItems({ dataCollectionId: collectionId })
      .limit(limit)
      .find();
    return res.items.map((i: any) => i.data);
  } catch (err) {
    console.warn(`[content] live query failed for ${collectionId}, using seed`, err);
    return [];
  }
}

const R = '[EDITORIAL REVIEW]';

/** Seed content (editorial-review). Replaced by live CMS when configured. */
const SEED = {
  capabilities: [
    { slug: 'commercial-readiness', title: 'Commercial Readiness', outcome: `${R} Get a business truly ready to sell and scale.` },
    { slug: 'operating-systems', title: 'Operating Systems', outcome: `${R} Install the systems that make growth repeatable.` },
    { slug: 'growth-strategy', title: 'Growth Strategy', outcome: `${R} Map the path from where you are to where you're going.` },
    { slug: 'go-to-market', title: 'Go-to-Market', outcome: `${R} Reach the right buyers with the right offer.` },
    { slug: 'brand-positioning', title: 'Brand & Positioning', outcome: `${R} Sharpen what you stand for in the market.` },
    { slug: 'capital-readiness', title: 'Capital Readiness', outcome: `${R} Prepare for funding conversations with confidence.` },
  ],
  programs: [
    { slug: 'eso-cohort', title: `${R} ESO Cohort Program`, summary: `${R} Move a cohort of founders from access to commercial readiness.` },
    { slug: 'accelerator-track', title: `${R} Accelerator Advisory Track`, summary: `${R} Embedded advisory for accelerator portfolios.` },
    { slug: 'institution-partnership', title: `${R} Institutional Partnership`, summary: `${R} Long-term capability-building partnership.` },
  ],
  caseStudies: [
    { slug: 'case-one', title: `${R} Case study in preparation`, outcome: `${R} Measured growth outcome pending approval.` },
    { slug: 'case-two', title: `${R} Case study in preparation`, outcome: `${R} Measured growth outcome pending approval.` },
    { slug: 'case-three', title: `${R} Case study in preparation`, outcome: `${R} Measured growth outcome pending approval.` },
  ],
  insights: [
    { slug: 'insight-one', title: `${R} From access to commercial readiness`, summary: `${R} Field note placeholder.` },
    { slug: 'insight-two', title: `${R} What ESOs miss about growth`, summary: `${R} Field note placeholder.` },
    { slug: 'insight-three', title: `${R} Operating systems for founders`, summary: `${R} Field note placeholder.` },
  ],
  speaking: [] as Item[], // placeholders hidden until verified (doc 07 §6)
  danaProfile: {
    name: 'Dana Ammons',
    positioning: `${R} Dana Ammons brings verified brand and commercial leadership from P&G, PepsiCo and Colgate-Palmolive to founders and the organizations that support them.`,
  },
};

async function withFallback(collectionId: keyof typeof SEED, live: () => Promise<Item[]>): Promise<Item[]> {
  const items = await live();
  return items.length ? items : (SEED[collectionId] as Item[]);
}

export const getCapabilities = () => withFallback('capabilities', () => queryCollection('Capabilities'));
export const getPrograms = () => withFallback('programs', () => queryCollection('Programs'));
export const getCaseStudies = () => withFallback('caseStudies', () => queryCollection('CaseStudies'));
export const getInsights = () => withFallback('insights', () => queryCollection('Insights'));
export const getSpeaking = () => withFallback('speaking', () => queryCollection('Speaking'));

export async function getDanaProfile(): Promise<Item> {
  const live = await queryCollection('DanaProfile', 1);
  return live[0] ?? SEED.danaProfile;
}

export const POSITIONING_LINE =
  'VGP helps entrepreneurship support organizations move founders from access to commercial readiness.';
