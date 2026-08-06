// Content layer. Source of truth is the in-repo content below (Wix is being
// retired). The Wix reader is kept as a dormant, optional hook only for a
// transition period — set PUBLIC_WIX_CLIENT_ID to temporarily read Wix CMS.
// Long term, replace the seed with real approved content here, or swap in a
// no-code CMS (HubSpot HubDB / Sanity) at the queryCollection() seam.

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

/** Seed content. Replaced by live CMS when configured. Capability & program
 *  copy describes the VGP offering in first-person-plural ("we") — no invented
 *  client numbers, no asserted personal pronouns. Partners & insights carry a
 *  `review` flag so their pages show a "pending confirmation" banner while the
 *  site is in staging. */
const SEED = {
  capabilities: [
    {
      slug: 'commercial-readiness',
      title: 'Commercial Readiness',
      outcome: 'Get a business genuinely ready to sell, scale and hold its place on the shelf.',
      whoFor: 'Founders and the organizations that back them — where the idea, the funding or the access is already there, but the business is not yet built to win at retail.',
      outcomes: 'A clear, honest read on what "ready" means for this business, the specific gaps between here and there, and a prioritized plan to close them before capital, headcount or retail commitments are on the line.',
    },
    {
      slug: 'operating-systems',
      title: 'Operating Systems',
      outcome: 'Install the systems that make growth repeatable instead of heroic.',
      whoFor: 'Teams whose results still depend on a few people improvising — where every win takes a scramble and nothing is yet written down or repeatable.',
      outcomes: 'The operating rhythm, decision rights and core processes a business needs to grow without breaking: planning cadences, account and channel management, and the metrics that tell you the truth early.',
    },
    {
      slug: 'growth-strategy',
      title: 'Growth Strategy',
      outcome: 'Map the path from where the business actually is to where it is going.',
      whoFor: 'Founders and institutions choosing among too many directions at once, and needing a defensible sequence rather than a wish list.',
      outcomes: 'A focused growth thesis — which customers, channels and categories to win first, in what order, and the few moves that matter most this year — grounded in how CPG, beauty and beverage buyers actually make decisions.',
    },
    {
      slug: 'go-to-market',
      title: 'Go-to-Market',
      outcome: 'Reach the right buyers with the right offer, in the channels that will actually pay back.',
      whoFor: 'Brands preparing to launch or expand distribution — DTC, retail, or both — who cannot afford to learn distribution economics the expensive way.',
      outcomes: 'A go-to-market plan that fits the brand and the shelf: channel strategy, retail and buyer readiness, pricing and trade architecture, and the proof points a buyer needs to say yes.',
    },
    {
      slug: 'brand-positioning',
      title: 'Brand & Positioning',
      outcome: 'Sharpen what the brand stands for so it earns its place in a crowded category.',
      whoFor: 'Founders whose product is strong but whose story does not yet cut through — or whose positioning has drifted as the business grew.',
      outcomes: 'A positioning that is true, differentiated and commercially useful — the reason a buyer stocks it and a shopper reaches for it — carried consistently from pitch deck to packaging to shelf.',
    },
    {
      slug: 'capital-readiness',
      title: 'Capital Readiness',
      outcome: 'Walk into funding conversations prepared, on your terms.',
      whoFor: 'Founders and the investor networks and ESOs supporting them, ahead of a raise, a lending decision, or an ownership transition.',
      outcomes: 'A business that can withstand diligence: a credible growth story, the numbers and unit economics to back it, and clarity on whether — and what kind of — capital is the right tool for the next stage. Delivered with trusted financing and finance partners where a referral serves the founder better than advice alone.',
    },
  ],
  programs: [
    {
      slug: 'eso-cohort',
      title: 'ESO Cohort Program',
      summary: 'Move a whole cohort of founders from access to commercial readiness — together, on a shared timeline.',
      detail: 'A structured program for entrepreneurship support organizations that run cohorts. VGP works alongside your founders across the cohort arc — diagnosing where each business really is, teaching the commercial fundamentals most programs skip, and leaving founders with a concrete readiness plan rather than another certificate. Format and depth are scoped to your cohort size, stage and goals.',
      image: '/assets/img/vgp-home-advisory.jpg',
    },
    {
      slug: 'accelerator-track',
      title: 'Accelerator Advisory Track',
      summary: 'Embedded commercial advisory for an accelerator portfolio, matched to each company\'s stage.',
      detail: 'For accelerators that want more than a guest lecture. VGP embeds as a commercial advisor across the portfolio — office hours, readiness reviews, and buyer- and investor-facing preparation — so promising companies convert access into distribution and revenue. Engagement can run per-cohort or as an ongoing track.',
      image: '/assets/img/vgp-capabilities-advisory.jpg',
    },
    {
      slug: 'institution-partnership',
      title: 'Institutional Partnership',
      summary: 'A long-term partnership that builds durable commercial capability inside your institution.',
      detail: 'For universities, economic-development bodies and investor networks investing in founder outcomes over years, not weeks. VGP partners to build repeatable commercial-readiness capability into how your institution supports founders — curriculum, advisory model, and measurement — so the impact compounds after any single engagement ends.',
      image: '/assets/img/vgp-operations.jpg',
    },
  ],
  // Real, in-preparation engagements. No fabricated metrics: case studies stay
  // in preparation until Dana supplies (and each client approves) the specifics.
  caseStudies: [
    { slug: 'case-one', title: 'Commercial-readiness engagement', outcome: 'In preparation — full details published once the client approves specifics. No numbers are shown until they can be verified.', review: true },
    { slug: 'case-two', title: 'Go-to-market & retail readiness', outcome: 'In preparation — full details published once the client approves specifics. No numbers are shown until they can be verified.', review: true },
    { slug: 'case-three', title: 'ESO cohort program', outcome: 'In preparation — full details published once the institution approves specifics. No numbers are shown until they can be verified.', review: true },
  ],
  insights: [
    {
      slug: 'access-is-not-readiness',
      title: 'Access is not commercial readiness',
      summary: 'The programs, capital and introductions are more available than ever — and most founders still are not ready to sell. The gap is commercial, not access.',
      body: [
        'The ecosystem has gotten very good at access. There are more accelerators, more grants, more pitch nights and more warm introductions than at any point in the last decade. And yet the failure rate at the shelf has barely moved. That is the tell: access was never the binding constraint.',
        'Commercial readiness is. A founder can have a funded round, a beautiful product and a buyer\'s email address and still not be ready — because being ready means the unit economics survive a real trade calendar, the supply chain can hold a promotion, and the story lands with a category buyer who has ninety seconds and a spreadsheet.',
        'For the organizations that support founders, the implication is direct: the highest-leverage thing you can add is not one more introduction. It is closing the commercial gap before the introduction is spent.',
      ],
    },
    {
      slug: 'what-esos-miss',
      title: 'What ESOs miss about growth',
      summary: 'Support organizations optimize for what is easy to measure — sessions delivered, founders served. The commercial outcomes that matter show up later, and elsewhere.',
      body: [
        'Most entrepreneurship support is measured by activity: workshops run, founders enrolled, demo days held. Those numbers are real, but they are inputs. The outcome that actually justifies the work — a business that can sell and scale — often shows up months later, in a distribution win or a second purchase order, where the program never sees it.',
        'The result is a quiet misalignment. Curricula fill with fundraising and storytelling because those are teachable in a room, while the things that decide whether a brand survives — trade math, buyer readiness, operating cadence — get one guest session, if that.',
        'Fixing it does not require more programming. It requires putting commercial readiness at the center of the cohort arc and measuring founders against it, so the program is optimizing for the outcome instead of the activity.',
      ],
    },
    {
      slug: 'operating-systems-for-founders',
      title: 'Operating systems for founders',
      summary: 'Early growth runs on heroics. The businesses that last replace the scramble with a few boring systems — before they have to.',
      body: [
        'In the early days, everything works because a few people will it to work. That is a feature, not a bug — until it becomes the ceiling. The scramble that got a brand its first thousand customers is exactly what breaks at its first real retail order.',
        'The fix is unglamorous: a planning cadence, clear decision rights, and a short list of metrics that tell the truth early enough to act on. Not a binder of process for its own sake — the minimum operating system that lets growth repeat without a hero on every deal.',
        'The founders who install this before they need it look slower for a quarter and faster for years. The ones who wait usually install it during a crisis, which is the most expensive possible time.',
      ],
    },
  ],
  // Referral & delivery partners — sourced from Dana's own partner files. Each
  // record stays at editorial-review (review:true) until that partner confirms
  // their public listing. No internal tier/pricing detail; personal contact
  // details deliberately excluded (privacy).
  partners: [
    {
      slug: 'ark-la-tex-financial',
      name: 'Ark-La-Tex Financial Consultants',
      type: 'Referral Partner — Financing & Lending',
      focus: 'USDA B&I, SBA and commercial lending navigation for rural growth and acquisitions',
      description: 'Ark-La-Tex Financial Consultants helps founders and small businesses finance rural growth and acquisitions with local expertise and creative solutions — specializing in USDA Business & Industry guaranteed loans, SBA 7(a) and 504 loans, and commercial lending across acquisitions, ownership transitions, real estate and equipment, and refinance-plus-growth.',
      website: 'https://arklatexfinancial.net',
      logo: '/assets/partners/ark-la-tex-financial-consultants-logo.png',
      review: true,
    },
    {
      slug: 'patrice-malloy',
      name: 'Patrice Malloy — The Affluent CFO',
      type: 'Referral Partner — Financial & Tax Strategy',
      focus: 'Tax strategy and financial advisory for founders',
      description: 'Patrice Malloy, known as The Affluent CFO, is a master tax strategist and financial advisor who helps entrepreneurs pursue financial freedom through her Unapologetic Affluence platform, and collaborates on the Finance Blueprint for Founders series.',
      review: true,
    },
    {
      slug: 'heloise-lanoix',
      name: 'Heloise Lanoix',
      type: 'Creative & Digital Partner',
      focus: 'Digital product & app design and creative direction',
      description: 'Heloise Lanoix is Value Growth Partners’ lead digital design and creative director — a creative and digital contractor specializing in digital product and app design, from app-flow diagrams and wireframes through visual design and coordination with development.',
      review: true,
    },
    {
      slug: 'kaylee-mcferson',
      name: 'Kaylee McFerson',
      type: 'Paid Media & Digital Partner',
      focus: 'Paid Search, Paid Social and Programmatic strategy and execution',
      description: 'Kaylee McFerson is a paid-media strategist specializing in Paid Search, Paid Social and Programmatic — driving full-funnel campaign strategy, audience-first planning, and performance optimization against KPIs like CPA and ROAS across verticals including CPG, e-commerce, healthcare and tourism.',
      review: true,
    },
    {
      slug: 'sengo',
      name: 'Sengo',
      type: 'Capital Intelligence Platform',
      focus: 'Capital intelligence and fractional-finance support for founders',
      description: 'Sengo is a capital-intelligence and fractional-finance platform in the Value Growth Partners network. It helps founders assess whether capital is the right tool for their next stage and use it well, with founders owning their Sengo account directly.',
      review: true,
    },
    {
      slug: 'nudge',
      name: 'Nudge',
      type: 'Commerce Intelligence Platform',
      focus: 'Shopify-native commerce intelligence and paid-media visibility',
      description: 'Nudge is a Shopify-native commerce-intelligence platform in the Value Growth Partners network. It turns Shopify performance, channel behavior and paid-media data into a clear weekly briefing so founders can make decision-grade retail, inventory, channel and promotional calls.',
      review: true,
    },
  ],
  // Sourced from public info (Venture Café Cambridge speaker listing) — confirm with Dana.
  speaking: [
    { title: 'Venture Café Cambridge — speaker', detail: '[SOURCED — confirm] Founder-readiness and go-to-market for emerging CPG brands.' },
  ] as Item[],
  // Bio drafted from public sources (LinkedIn, VGP site, podcast listings, Venture Café)
  // 2026-08-04 — PENDING Dana's confirmation. Sole-host rule applied (no co-host language).
  // The $115M PepsiCo figure is deliberately excluded (gated, doc 07 §2).
  danaProfile: {
    name: 'Dana Ammons',
    // Drafted from public sources (LinkedIn, VGP site, podcast/Venture Café listings),
    // 2026-08-04. `sourced:true` renders a "pending confirmation" banner. Written in
    // name-based / third-person voice (no asserted pronouns). The $115M PepsiCo figure
    // is gated (doc 07 §2) and shown only when pepsico_claim_status === 'approved'.
    sourced: true,
    positioning:
      'Dana Ammons is the founder and principal of Value Growth Partners — a CPG, beauty and beverage veteran with commercial leadership experience across Procter & Gamble, PepsiCo, Colgate-Palmolive and SC Johnson. Value Growth Partners works with emerging businesses, accelerators and investor networks to build founder readiness, launch strategy and lasting commercial growth.',
    philosophy:
      'Access is not the same as commercial readiness. VGP helps founders — and the organizations that support them — close that gap, turning promising ideas into brands that can actually sell, scale and hold their place on the shelf.',
    experience_timeline:
      'At Procter & Gamble, Dana served as Director of Sales, leading key accounts including Target and Sam\'s Club and earning the Triple Crown Award for driving top-line, bottom-line and market-share growth. Additional brand and commercial leadership followed across PepsiCo, Colgate-Palmolive and SC Johnson — a career spent turning products into brands that win at retail.',
    credentials: [
      'Procter & Gamble — Director of Sales (Target, Sam\'s Club); Triple Crown Award',
      'Commercial & brand leadership across PepsiCo, Colgate-Palmolive and SC Johnson',
      'Founder & principal, Value Growth Partners',
      'Speaker on commercial readiness and founder ecosystems (incl. Venture Café Cambridge)',
    ],
    pepsico_claim_status: 'pending-proof',
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
export const getPartners = () => withFallback('partners', () => queryCollection('Partners'));

export async function getDanaProfile(): Promise<Item> {
  const live = await queryCollection('DanaProfile', 1);
  return live[0] ?? SEED.danaProfile;
}

export const POSITIONING_LINE =
  'VGP helps entrepreneurship support organizations move founders from access to commercial readiness.';
