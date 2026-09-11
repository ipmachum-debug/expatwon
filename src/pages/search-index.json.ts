import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { getCategory } from '../lib/categories';
import { TOOLS } from '../lib/tools';
import { OBSERVATIONS, latest } from '../data/observations';

/**
 * The search index, built once at build time and fetched by the search dialog
 * the first time someone opens it.
 *
 * Deliberately not fetched on page load. Most visits never search, and a
 * reader who lands on a guide from Google should not pay for an index they
 * will not use.
 *
 * Keys are single letters because this ships over the wire: across a few
 * hundred entries the difference between `title` and `t` is real, and nothing
 * but the dialog ever reads it.
 *
 *   t  title        u  url
 *   k  kind         c  category or group label
 *   d  description  x  extra terms — tags, key facts, section headings
 */
interface Entry {
  t: string;
  u: string;
  k: 'guide' | 'figure' | 'tool';
  c: string;
  d: string;
  x: string;
}

/** `## Section headings` are what a reader is usually looking for. */
function headings(body: string): string[] {
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const guides: Entry[] = posts.map((post) => ({
    t: post.data.title,
    u: `/${post.data.category}/${post.id}/`,
    k: 'guide',
    c: getCategory(post.data.category).shortTitle,
    d: post.data.description,
    x: [
      ...(post.data.tags ?? []),
      ...(post.data.keyFacts ?? []).map((f) => `${f.label} ${f.value}`),
      ...headings(post.body ?? ''),
    ].join(' '),
  }));

  // Figures and calculators earn their place here more than anywhere else: a
  // reader who wants "minimum wage" wants the number and the calculator, not
  // only the guide that discusses them.
  const figures: Entry[] = OBSERVATIONS.map((series) => ({
    t: series.label,
    u: `/tracked/${series.key}/`,
    k: 'figure',
    c: 'Tracked figure',
    d: latest(series).display,
    x: `${series.key.replace(/-/g, ' ')} ${series.unit} ${series.appliesTo}`,
  }));

  const tools: Entry[] = TOOLS.map((tool) => ({
    t: tool.title,
    u: tool.href,
    k: 'tool',
    c: 'Calculator',
    d: tool.description,
    x: '',
  }));

  return new Response(JSON.stringify([...guides, ...figures, ...tools]), {
    headers: { 'Content-Type': 'application/json' },
  });
};
