import type { CollectionEntry } from 'astro:content';

/**
 * The guides an article links to in its own body, ranked.
 *
 * The author decided these relationships while writing the sentence around
 * each link, so deriving onward navigation from them means a recommendation
 * cannot drift from the argument it came out of.
 *
 * Two signals, and position only breaks ties. A guide linked several times is
 * load-bearing rather than mentioned in passing; a guide in the same category
 * is the one the reader is still inside. Ranking by first link alone sent the
 * savings-bank guide to a question about car rental and pushed three unrelated
 * guides onto the same loans article.
 *
 * Shared so the end-of-article card and the mid-article question read the same
 * ranking and take different places in it — otherwise the same guide is
 * offered twice on one page.
 */
export function rankLinkedGuides(
  post: CollectionEntry<'posts'>,
  byId: Map<string, CollectionEntry<'posts'>>,
  skip: Set<string>,
): CollectionEntry<'posts'>[] {
  const scored = new Map<string, { count: number; first: number }>();
  let seen = 0;

  // Body links are written as /category/slug/ — the last segment is the id.
  for (const m of (post.body ?? '').matchAll(
    /\]\(\/[a-z-]+\/([a-z0-9-]+)\/[^)]*\)/g,
  )) {
    const id = m[1];
    seen += 1;
    if (skip.has(id) || !byId.has(id)) continue;
    const prev = scored.get(id);
    if (prev) prev.count += 1;
    else scored.set(id, { count: 1, first: seen });
  }

  return [...scored.entries()]
    .map(([id, s]) => {
      const target = byId.get(id)!;
      return {
        target,
        weight: s.count + (target.data.category === post.data.category ? 2 : 0),
        first: s.first,
      };
    })
    .sort((a, b) => b.weight - a.weight || a.first - b.first)
    .map((r) => r.target);
}
