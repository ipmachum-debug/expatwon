// @ts-check

import { readdirSync, readFileSync } from 'node:fs';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import { satteri } from '@astrojs/markdown-satteri';

import { satteriFigures } from './plugins/satteri-figures.mjs';

/**
 * Last-modified dates for the sitemap, read straight off the markdown.
 *
 * Why this exists: the sitemap was shipping 102 URLs and not one <lastmod>.
 * To a crawler that is a list of addresses with no news in it — rewrite a
 * title, restructure a guide, move six pages into a new category, and the
 * file Google re-reads looks exactly as it did before. Nothing in it says
 * anything changed.
 *
 * What this is NOT is a diagnosis of why anything was slow. A sitemap is a
 * hint; submitting one guarantees neither crawling nor indexing, and no
 * measurement here could attribute a re-crawl delay to a missing field. The
 * honest claim is narrower and still worth acting on: a re-crawl signal that
 * Google documents itself as using was absent, on a site whose whole problem
 * right now is that recent changes are not being seen.
 *
 * Dates are real or absent, which is the condition Google attaches to using
 * the field at all — it reads lastmod only where a site's dates are
 * consistently accurate. A guide carries its own updatedDate; a category
 * listing carries the newest date among its own guides; the home page and the
 * library carry the newest date on the site. Pages whose content is code
 * rather than posts — the calculators, about, privacy — get nothing, because
 * the honest answer is that this file does not know when they last changed.
 * A build timestamp on every URL would claim the whole site changes daily,
 * which is both untrue and the kind of claim crawlers learn to discount.
 */
function postDates() {
  const byUrl = new Map();
  const byCategory = new Map();
  let newest = '';
  for (const name of readdirSync('src/content/posts').filter((f) => f.endsWith('.md'))) {
    const src = readFileSync('src/content/posts/' + name, 'utf8');
    const fm = src.slice(0, src.indexOf('\n---', 4));
    if (/^draft:\s*true\s*$/m.test(fm)) continue;
    const category = fm.match(/^category:\s*(\S+)/m)?.[1];
    const updated = fm.match(/^updatedDate:\s*(\d{4}-\d{2}-\d{2})/m)?.[1];
    if (!category || !updated) continue;
    byUrl.set(`/${category}/${name.slice(0, -3)}/`, updated);
    if (updated > (byCategory.get(category) ?? '')) byCategory.set(category, updated);
    if (updated > newest) newest = updated;
  }
  return { byUrl, byCategory, newest };
}

const DATES = postDates();

/** The path's lastmod, or undefined when we do not honestly have one. */
function lastmodFor(pathname) {
  const own = DATES.byUrl.get(pathname);
  if (own) return own;
  const category = pathname.match(/^\/([a-z-]+)\/$/)?.[1];
  if (category && DATES.byCategory.has(category)) return DATES.byCategory.get(category);
  if (pathname === '/' || pathname === '/articles/') return DATES.newest;
  return undefined;
}

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
      serialize: (item) => {
        const lastmod = lastmodFor(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  markdown: {
    processor: satteri({ mdastPlugins: [satteriFigures()] }),
    // Every one of the 296 code fences on this site is an untagged ASCII figure
    // — a checklist, a rate table, a flow. None of them is code. Shiki was
    // stamping a github-dark background on each one inline, which fought the
    // paper palette and made the text unreadable on mobile. Plain <pre><code>
    // instead; the block is styled in global.css like any other figure.
    syntaxHighlight: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
