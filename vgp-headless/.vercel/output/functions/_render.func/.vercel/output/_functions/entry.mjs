import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_CJUNGpOV.mjs';
import { manifest } from './manifest_CGs5vqhx.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/accessibility.astro.mjs');
const _page3 = () => import('./pages/advisory-pathway.astro.mjs');
const _page4 = () => import('./pages/api/lead.astro.mjs');
const _page5 = () => import('./pages/api/qualify.astro.mjs');
const _page6 = () => import('./pages/capabilities/_slug_.astro.mjs');
const _page7 = () => import('./pages/capabilities.astro.mjs');
const _page8 = () => import('./pages/case-studies/_slug_.astro.mjs');
const _page9 = () => import('./pages/case-studies.astro.mjs');
const _page10 = () => import('./pages/insights/_slug_.astro.mjs');
const _page11 = () => import('./pages/insights.astro.mjs');
const _page12 = () => import('./pages/institutional-inquiry.astro.mjs');
const _page13 = () => import('./pages/members.astro.mjs');
const _page14 = () => import('./pages/partner-contributor.astro.mjs');
const _page15 = () => import('./pages/privacy.astro.mjs');
const _page16 = () => import('./pages/programs/_slug_.astro.mjs');
const _page17 = () => import('./pages/programs.astro.mjs');
const _page18 = () => import('./pages/speaking.astro.mjs');
const _page19 = () => import('./pages/terms.astro.mjs');
const _page20 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/accessibility.astro", _page2],
    ["src/pages/advisory-pathway.astro", _page3],
    ["src/pages/api/lead.ts", _page4],
    ["src/pages/api/qualify.ts", _page5],
    ["src/pages/capabilities/[slug].astro", _page6],
    ["src/pages/capabilities/index.astro", _page7],
    ["src/pages/case-studies/[slug].astro", _page8],
    ["src/pages/case-studies/index.astro", _page9],
    ["src/pages/insights/[slug].astro", _page10],
    ["src/pages/insights/index.astro", _page11],
    ["src/pages/institutional-inquiry.astro", _page12],
    ["src/pages/members.astro", _page13],
    ["src/pages/partner-contributor.astro", _page14],
    ["src/pages/privacy.astro", _page15],
    ["src/pages/programs/[slug].astro", _page16],
    ["src/pages/programs/index.astro", _page17],
    ["src/pages/speaking.astro", _page18],
    ["src/pages/terms.astro", _page19],
    ["src/pages/index.astro", _page20]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "abffa079-1810-46b0-8ae9-28be6a5f0e66",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
