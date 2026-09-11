// @ts-check

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import { satteri } from '@astrojs/markdown-satteri';

import { satteriFigures } from './plugins/satteri-figures.mjs';

export default defineConfig({
  site: 'https://expatwon.com',
  integrations: [
    react(),
    sitemap({
      // Individual figure pages are reachable from the guides that cite them
      // and from site search, and that is the whole of their job. Submitting
      // 166 of them alongside 50 guides spends a new domain's crawl allowance
      // on 240-word pages while the guides sit in the queue uncrawled. The
      // /tracked/ index itself stays in — it is a real page.
      filter: (page) => !/\/tracked\/[^/]+\//.test(new URL(page).pathname),
    }),
  ],
  markdown: {
    processor: satteri({ mdastPlugins: [satteriFigures()] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
