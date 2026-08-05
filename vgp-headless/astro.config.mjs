import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Adapter is selectable by env so the same repo deploys cleanly:
//   (default)            -> @astrojs/node standalone (local dev/test, Render, Fly, self-host)
//   DEPLOY_TARGET=vercel -> @astrojs/vercel serverless (recommended cheap deploy)
// Vercel sets process.env.VERCEL=1 during its builds, so we auto-select the
// Vercel adapter there even if DEPLOY_TARGET was never set — this guarantees the
// /api/* serverless functions get created (without it, forms 404 silently).
// Hybrid output: pages prerender; /api/* endpoints opt into server rendering.
const target = process.env.DEPLOY_TARGET || (process.env.VERCEL ? 'vercel' : 'node');
let adapter;
if (target === 'vercel') {
  const { default: vercel } = await import('@astrojs/vercel/serverless');
  adapter = vercel();
} else {
  adapter = node({ mode: 'standalone' });
}

export default defineConfig({
  output: 'hybrid',
  adapter,
  site: 'https://www.valugrowthpartners.com',
  vite: {
    // Wix headless SDK is an optional runtime dep (installed only when wiring
    // live CMS data). Keep Rollup from resolving it at build time.
    build: { rollupOptions: { external: ['@wix/sdk', '@wix/data'] } },
    ssr: { external: ['@wix/sdk', '@wix/data'] },
  },
});
