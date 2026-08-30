/**
 * Publishes any scheduled draft whose publishDate has arrived.
 *
 * A staged post carries `draft: true` and a future `publishDate`. Astro excludes
 * drafts from the build and the sitemap, so a staged file can sit in main
 * harmlessly. This script removes the `draft: true` line once the day arrives,
 * in Asia/Seoul — the timezone the publishing schedule is actually kept in.
 *
 * It only ever deletes that one line. Everything editorial — reverse internal
 * links from related guides, the content-plan marker — stays a human step.
 *
 * Run by .github/workflows/publish-scheduled.yml; safe to run by hand:
 *   node scripts/publish-due-drafts.mjs          # publish what is due
 *   node scripts/publish-due-drafts.mjs --dry    # report only
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const POSTS = 'src/content/posts';
const dry = process.argv.includes('--dry');

/** Today in Asia/Seoul as YYYY-MM-DD, so a date string compares lexically. */
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const published = [];

for (const name of readdirSync(POSTS).filter((f) => f.endsWith('.md'))) {
  const path = join(POSTS, name);
  const source = readFileSync(path, 'utf8');
  const end = source.indexOf('\n---', 4);
  if (!source.startsWith('---') || end === -1) continue;

  const frontmatter = source.slice(0, end);
  if (!/^draft:\s*true\s*$/m.test(frontmatter)) continue;

  const date = frontmatter.match(/^publishDate:\s*(\d{4}-\d{2}-\d{2})/m)?.[1];
  if (!date) {
    console.warn(`skip ${name}: draft with no parseable publishDate`);
    continue;
  }
  if (date > today) continue;

  published.push({ name, date });
  if (!dry) {
    writeFileSync(path, source.replace(/^draft:\s*true\s*\n/m, ''), 'utf8');
  }
}

if (published.length === 0) {
  console.log(`nothing due (${today} KST)`);
} else {
  for (const { name, date } of published) {
    console.log(`${dry ? 'due' : 'published'}: ${name} (${date})`);
  }
}

// The workflow reads this to decide whether to commit.
console.log(`::count::${published.length}`);
