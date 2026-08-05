import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Hybrid: pages are static by default; the qualification endpoint opts into
// server rendering (export const prerender = false). The node standalone
// adapter runs anywhere (Vercel/Netlify/Render/self-host). Swap to
// @astrojs/vercel or @astrojs/netlify at deploy time if preferred.
export default defineConfig({
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  site: 'https://www.valugrowthpartners.com',
  vite: {
    // Wix headless SDK is an optional runtime dep (installed only when wiring
    // live CMS data). Keep Rollup from resolving it at build time.
    build: { rollupOptions: { external: ['@wix/sdk', '@wix/data'] } },
    ssr: { external: ['@wix/sdk', '@wix/data'] },
  },
});
