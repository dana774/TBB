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
  // VGP capability areas — sourced from the VGP Client-Facing Messaging &
  // Capability Content Pack. `includes` = what the engagement covers; `bestFor`
  // = the client it fits. `outcome` is the one-line promise.
  capabilities: [
    {
      slug: 'strategic-growth-architecture',
      title: 'Strategic Growth Architecture',
      outcome: 'Turn a promising business into a clear model, market path and roadmap you can actually run.',
      includes: ['Business model clarity', 'Market path', 'Pricing logic', 'Operating priorities', 'Growth roadmap', 'Founder decision cadence'],
      bestFor: 'Founders needing structure and strategic focus.',
    },
    {
      slug: 'growth-os-diagnostic-build',
      title: 'Growth OS Diagnostic & Build',
      outcome: 'Install the operating system — dashboards, workflows and automation — that makes growth repeatable.',
      includes: ['Tool audit', 'Workflow map', 'Dashboards', 'Forecast workbook', 'Meeting intelligence', 'Action trackers', 'Automation roadmap'],
      bestFor: 'Founders or programs ready to systematize operations.',
      definition: 'Growth OS is not generic software consulting. It is the implementation system that turns strategy into durable operating infrastructure — making the advisory work repeatable, measurable, and scalable. Strategy becomes the dashboards, workflows, and accountability you actually run.',
      sequence: [
        'Confirm the client archetype, commercial objective, operating pain, and decision owner.',
        'Inventory current tools, data sources, access levels, reporting gaps, and recurring handoffs.',
        'Choose one system of record — never build logic across competing sources of truth.',
        'Stand up the AI workspace, naming conventions, folder structure, and export standards.',
        'Launch one to three revenue-critical or time-saving workflows before secondary automations.',
        'Build dashboard v1, data definitions, and an adoption-ready operating cadence.',
        'Train only the people who will use the workflows; publish SOPs and a change log.',
        'Move into managed optimization once the foundation is stable and owners are clear.',
      ],
    },
    {
      slug: 'funding-forecast-readiness',
      title: 'Funding & Forecast Readiness',
      outcome: 'Walk into funding conversations with a forecast, a gap analysis and the assets to back them.',
      includes: ['Forecast model', 'Funding gap analysis', 'Grant and investor readiness', 'Opportunity matching', 'Pitch assets', 'Funder preparation'],
      bestFor: 'Capital-seeking founders and nonprofit / program partners.',
    },
    {
      slug: 'retail-distribution-strategy',
      title: 'Retail & Distribution Strategy',
      outcome: 'Get shelf-ready — buyer materials, channel strategy and the trade math to win at retail.',
      includes: ['Retail readiness', 'Buyer materials', 'Distributor / broker strategy', 'Wholesale approach', 'Retail trial activation', 'Channel planning'],
      bestFor: 'Consumer products — CPG, beauty, wellness, food & beverage, and retail-enabled brands.',
    },
    {
      slug: 'digital-growth-ai',
      title: 'Digital Growth & AI Optimization',
      outcome: 'Build scalable demand — email, paid media, marketplace and AI-search visibility that compounds.',
      includes: ['Klaviyo / email', 'Paid media strategy', 'Amazon / marketplace readiness', 'AI search & answer-engine optimization', 'Content systems'],
      bestFor: 'Brands needing scalable digital demand generation.',
    },
    {
      slug: 'operations-sourcing',
      title: 'Operations Sourcing',
      outcome: 'Move from small-batch to scalable — the right manufacturing, 3PL and distribution partners.',
      includes: ['Contract manufacturing', '3PL, storage & fulfillment', 'Distributor sourcing', 'Wholesaler sourcing', 'Broker sourcing'],
      bestFor: 'Brands moving from handmade / small-batch to scalable operations.',
    },
    {
      slug: 'partner-investor-orchestration',
      title: 'Partner & Investor Orchestration',
      outcome: 'The right introductions at the right time — partners, investors and ecosystem visibility.',
      includes: ['Referral partner matching', 'Investor-readiness signal', 'Warm introductions', 'Ecosystem visibility'],
      bestFor: 'Founders ready for external relationships.',
    },
  ],
  programs: [
    {
      slug: 'eso-cohort',
      title: 'ESO Cohort Program',
      summary: 'Move a whole cohort of founders from access to commercial readiness — together, on a shared timeline.',
      detail: 'A structured program for entrepreneurship support organizations that run cohorts. VGP works alongside your founders across the cohort arc — diagnosing where each business really is, teaching the commercial fundamentals most programs skip, and leaving founders with a concrete readiness plan rather than another certificate. Format and depth are scoped to your cohort size, stage and goals.',
      image: '/assets/img/vgp-speaking-event.jpg',
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
    { slug: 'case-one', title: 'Commercial-readiness engagement', outcome: 'In preparation — full details published once the client approves specifics. No numbers are shown until they can be verified.', image: '/assets/img/vgp-capabilities-advisory.jpg', review: true },
    { slug: 'case-two', title: 'Go-to-market & retail readiness', outcome: 'In preparation — full details published once the client approves specifics. No numbers are shown until they can be verified.', image: '/assets/img/vgp-operations.jpg', review: true },
    { slug: 'case-three', title: 'ESO cohort program', outcome: 'In preparation — full details published once the institution approves specifics. No numbers are shown until they can be verified.', image: '/assets/img/vgp-programs-cohort.jpg', review: true },
  ],
  insights: [
    {
      slug: 'access-is-not-readiness',
      title: 'Access is not commercial readiness',
      image: '/assets/img/vgp-capabilities-advisory.jpg',
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
      image: '/assets/img/vgp-programs-cohort.jpg',
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
      image: '/assets/img/vgp-operations.jpg',
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
  // Real engagements from Dana. Carrington years pending her confirmation
  // (~2017–2018). Venture Café entry sourced from public info — confirm.
  speaking: [
    { title: 'CIC Demo Day — Host & Moderator', detail: 'Hosted and moderated the retail cohort Demo Day, May 2025.' },
    { title: 'Carrington College — Commencement Speaker', detail: 'Delivered the graduation keynote two consecutive years. [Years pending confirmation]' },
    { title: 'Venture Café Cambridge — Speaker', detail: 'Founder-readiness and go-to-market for emerging CPG brands. [Sourced — confirm]' },
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

// The five-layer operating model / ascension ladder (Growth OS Manual v2).
// Signal Engine → Founder Network → VGP Advisory → Growth OS → Apex.
export const ECOSYSTEM_OPERATING_LAYERS = [
  { name: 'Signal Engine', role: 'Media + Intelligence', body: 'Content, podcast, newsletter and market intelligence create visibility and signal — how founders and opportunities get discovered.', href: null },
  { name: 'Founder Network', role: 'Membership + Community', body: 'The $99/month entry membership — signal, funding access, tools, and the referral network. The front door.', href: '/membership' },
  { name: 'VGP Advisory', role: 'Strategy + Execution', body: 'Senior strategic advisory and hands-on execution — retainers, diagnostics, strategy sprints, and scoped implementation.', href: '/how-we-work' },
  { name: 'Growth OS', role: 'Systems + Automation', body: 'The implementation layer — dashboards, workflows, forecasts and automation that turn strategy into durable operating infrastructure.', href: '/capabilities/growth-os-diagnostic-build' },
  { name: 'Apex', role: 'Fractional Leadership', body: 'Fractional strategic operating support — weekly decision cadence, complex workstream oversight, and senior operator leadership for founders ready for it.', href: '/how-we-work' },
];

// The three-layer ecosystem architecture (Brand Architecture Bible v5.2).
// Voice: VGP = "strategic advisory and operating firm"; Brand Blueprint =
// "founder-facing ecosystem"; Growth OS = "implementation layer". No guarantees.
export const ECOSYSTEM_LAYERS = [
  {
    name: 'The Brand Blueprint',
    role: 'The founder-facing ecosystem',
    tagline: 'The front door.',
    body: 'The Brand Blueprint is where founders find community, content, and momentum — a content platform, newsletter, podcast, Founder Network, and opportunity engine that builds visibility and signal.',
    gets: ['Community & Founder Network', 'Content, newsletter & podcast', 'Visibility & investor signal', 'Partner access & opportunity flow'],
  },
  {
    name: 'Value Growth Partners',
    role: 'The strategic advisory & operating firm',
    tagline: 'The advisory and execution engine.',
    body: 'Value Growth Partners is the senior expertise and execution discipline behind the ecosystem. Where a founder needs real strategy and hands-on implementation, VGP carries the advisory, the build, and the accountability.',
    gets: ['Strategic advisory & diagnostics', 'Strategy sprints & implementation scopes', 'Managed systems & fractional support', 'Retail, funding & partner orchestration'],
    anchor: true,
  },
  {
    name: 'Growth OS',
    role: 'The implementation layer',
    tagline: 'Where guidance becomes infrastructure.',
    body: 'Growth OS is not generic software consulting — it is the implementation system that makes the advisory repeatable, measurable, and scalable. It turns strategy into operating infrastructure: the dashboards, workflows, forecasts, routines, and accountability that make growth repeatable instead of heroic.',
    gets: ['Dashboards & forecast workbooks', 'Workflows & automation', 'Operating routines & cadence', 'Action trackers & accountability'],
  },
];
