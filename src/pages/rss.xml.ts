import { getCollection } from 'astro:content';

import { getCategory } from '../lib/categories';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../lib/site';

/**
 * RSS 2.0 feed of every published guide, newest first.
 *
 * Hand-written rather than pulled from a package: the output is small, the
 * escaping is the only subtle part, and Naver Search Advisor wants a plain
 * RSS document it can poll.
 */
const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET() {
  const posts = (await getCollection('posts', (p) => !p.data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/${getCategory(post.data.category).slug}/${post.id}/`;
      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <category>${escapeXml(getCategory(post.data.category).shortTitle)}</category>
      <pubDate>${post.data.publishDate.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
