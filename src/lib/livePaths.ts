import { getCollection } from 'astro:content';

import { getCategory } from './categories';

/**
 * The slug paths of the guides that are actually on the site right now.
 *
 * Guides are written ahead and published one a day, so a path that exists in
 * the repo is not a path a reader can open: a draft resolves to 404 until its
 * publishDate. Anything that links to a guide by path — the calendar, the
 * deadline strip, the corrections page, the home page — has to check first,
 * and they were all building this map for themselves.
 *
 * Returns the paths rather than the posts where only existence matters; the
 * map is there for callers that also need the title.
 */
export async function livePosts() {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  return new Map(
    posts.map((p) => [`/${getCategory(p.data.category).slug}/${p.id}/`, p]),
  );
}

export async function livePaths() {
  return new Set((await livePosts()).keys());
}
