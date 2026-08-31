/**
 * Quick SEO frontmatter lint — same limits as the zod schema in
 * src/content.config.ts (which fails the build), but runnable in ~0s
 * without a full `astro build`. Usage: npm run lint:seo
 */
import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../src/content/posts/', import.meta.url);
const files = (await readdir(root)).filter((f) => f.endsWith('.md'));
let failed = false;

const fail = (file, msg) => {
  console.error(`✗ ${file}: ${msg}`);
  failed = true;
};

for (const file of files) {
  const text = await readFile(new URL(file, root), 'utf8');
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const title = fm.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1] ?? '';
  const desc = fm.match(/^description:\s*["']?(.*?)["']?\s*$/m)?.[1] ?? '';

  if (title.length < 10) fail(file, `title too short (${title.length}/10 min)`);
  if (title.length > 60) fail(file, `title too long (${title.length}/60 max)`);
  if (desc.length < 50) fail(file, `description too short (${desc.length}/50 min)`);
  if (desc.length > 155) fail(file, `description too long (${desc.length}/155 max)`);
  if (!/^sources:/m.test(fm)) fail(file, 'missing sources (official links required)');


  // Tracking parameters get appended by whatever tool surfaced a page, and
  // publishing them puts a third party's analytics tag on the site's own
  // citations. Cheap to strip, invisible once shipped.
  for (const [, url] of fm.matchAll(/^\s+url:\s*'([^']+)'/gm)) {
    const junk = [...url.matchAll(/[?&](utm_[a-z_]+|fbclid|gclid)=/g)].map((m) => m[1]);
    if (junk.length > 0) fail(file, `source url carries tracking parameters: ${junk.join(', ')}`);
  }  if (!/^\s+url: /m.test(fm) && /^sources:/m.test(fm))
    fail(file, 'sources must be {label, url} objects');
}

if (failed) process.exit(1);
console.log(`✓ SEO lint passed for ${files.length} posts.`);
