// @ts-check

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import { satteri } from '@astrojs/markdown-satteri';

import { satteriFigures } from './plugins/satteri-figures.mjs';

export default defineConfig({
  site: 'https://expatwon.com',
  integrations: [react(), sitemap()],
  markdown: {
    processor: satteri({ mdastPlugins: [satteriFigures()] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
