#!/usr/bin/env node
/**
 * Freshness audit — the detection half of the re-verification policy.
 *
 *   npm run audit                → what is due now (and what is due soon)
 *   npm run audit -- --all       → every post, sorted by age
 *   npm run audit -- --json      → machine-readable
 *   npm run audit -- --queue=3   → today's shortlist, highest priority first
 *
 * It never edits a post. It tells you WHICH guides are due, WHAT figures they
 * assert, and WHERE to verify them — the judgement stays with a human, because
 * a mis-parsed official page silently rewriting a YMYL figure is worse than a
 * stale one.
 *
 * Two inputs decide priority, in this order:
 *
 *   1. Season. A guide tracking an observation series whose `checkMonth` is
 *      the current month is checked now, whatever its age — the minimum wage
 *      is worth looking at in January because that is when it moves, not
 *      because six months happen to have passed.
 *   2. Age since `lastVerified`, falling back to `updatedDate` for guides
 *      written before that field existed. `updatedDate` moves for a typo;
 *      `lastVerified` only moves when a human re-checked the figures, which
 *      is the thing this audit actually cares about.
 *
 * `--queue` is what makes "verify one to three existing guides a day" a real
 * routine rather than an intention: it hands back a shortlist instead of a
 * wall of 280 posts to choose from.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = 'src/content/posts';
const OBS_DIR = 'src/data/observations';
const DUE_DAYS = 182; // ~6 months
const SOON_DAYS = 152; // flag a month ahead

const args = process.argv.slice(2);
const showAll = args.includes('--all');
const asJson = args.includes('--json');
const queueSize = Number(args.find((a) => a.startsWith('--queue='))?.split('=')[1] ?? 0);

/** Observation series by key, so a post's tracked figures can be resolved. */
const series = new Map();
try {
  for (const f of readdirSync(OBS_DIR).filter((n) => n.endsWith('.json'))) {
    const s = JSON.parse(readFileSync(join(OBS_DIR, f), 'utf8'));
    series.set(s.key, s);
  }
} catch {
  // No observation database yet; season priority simply never fires.
}

const thisMonth = Number(
  new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', month: 'numeric' }).format(new Date()),
);

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;

const today = new Date();
const daysBetween = (a, b) => Math.floor((a - b) / 86_400_000);

/** Figures worth re-checking: money amounts, percentages, and dated claims. */
function extractClaims(body) {
  const claims = new Set();
  const patterns = [
    /₩[\d,]+(?:\.\d+)?[MB]?(?:\/(?:day|month|year))?/g,
    /\b\d+(?:\.\d+)?%/g,
    /\bUSD [\d,]+(?:\.\d+)?/g,
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+20\d{2}/g,
  ];
  for (const re of patterns) {
    for (const m of body.matchAll(re)) claims.add(m[0]);
  }
  return [...claims];
}

function parseFrontmatter(raw) {
  const end = raw.indexOf('\n---', 4);
  const fm = raw.slice(4, end);
  const body = raw.slice(end + 4);
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : null;
  };
  const sources = [...fm.matchAll(/^\s+url:\s*'([^']+)'/gm)].map((m) => m[1]);
  const revisionCount = (fm.match(/^\s+- date:/gm) ?? []).length;
  const trackedRaw = get('tracked') ?? '';
  const tracked = trackedRaw
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  return {
    title: get('title'),
    category: get('category'),
    updatedDate: get('updatedDate'),
    lastVerified: get('lastVerified'),
    tracked,
    draft: get('draft') === 'true',
    sources,
    revisionCount,
    body,
  };
}

const posts = readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const raw = readFileSync(join(POSTS_DIR, file), 'utf8');
    const fm = parseFrontmatter(raw);
    // lastVerified is the honest clock: updatedDate moves for a typo.
    const checkedOn = fm.lastVerified ?? fm.updatedDate;
    // A tracked figure that usually moves this month outranks any age.
    const inSeason = fm.tracked.filter((k) => series.get(k)?.checkMonth === thisMonth);
    return {
      slug: file.replace(/\.md$/, ''),
      url: `/${fm.category}/${file.replace(/\.md$/, '')}/`,
      title: fm.title,
      draft: fm.draft,
      updatedDate: fm.updatedDate,
      lastVerified: fm.lastVerified,
      checkedOn,
      tracked: fm.tracked,
      inSeason: inSeason.map((k) => series.get(k).label),
      ageDays: daysBetween(today, new Date(checkedOn)),
      sources: fm.sources,
      revisionCount: fm.revisionCount,
      claims: extractClaims(fm.body),
    };
  })
  .filter((p) => !p.draft)
  .sort((a, b) => b.ageDays - a.ageDays);

const due = posts.filter((p) => p.ageDays >= DUE_DAYS);
const soon = posts.filter((p) => p.ageDays >= SOON_DAYS && p.ageDays < DUE_DAYS);
const inSeason = posts.filter((p) => p.inSeason.length > 0);

/**
 * Today's shortlist. Season first, then overdue, then simply oldest — and
 * within each band, oldest first, so the queue works round the corpus instead
 * of returning the same guides every day.
 */
const queue = [...posts]
  .sort((a, b) => {
    const rank = (p) => (p.inSeason.length > 0 ? 0 : p.ageDays >= DUE_DAYS ? 1 : 2);
    return rank(a) - rank(b) || b.ageDays - a.ageDays;
  })
  .slice(0, queueSize);

if (asJson) {
  console.log(
    JSON.stringify({ generated: today.toISOString(), due, soon, inSeason, queue, posts }, null, 2),
  );
  process.exit(0);
}

if (queueSize > 0) {
  console.log(bold(`\nToday's verification queue — ${queue.length} of ${posts.length} guides\n`));
  for (const [i, p] of queue.entries()) {
    const why =
      p.inSeason.length > 0
        ? yellow(`${p.inSeason.join(', ')} usually ${p.inSeason.length > 1 ? 'move' : 'moves'} this month`)
        : p.ageDays >= DUE_DAYS
          ? red(`${p.ageDays} days since last verified`)
          : dim(`${p.ageDays} days since last verified`);
    console.log(`${bold(String(i + 1) + '.')} ${bold(p.title)}`);
    console.log(dim(`   ${p.url}`));
    console.log(`   ${why}`);
    if (p.tracked.length) console.log(dim(`   tracked: ${p.tracked.join(', ')}`));
    for (const s of p.sources.slice(0, 3)) console.log(dim(`   ↗ ${s}`));
    console.log('');
  }
  console.log(
    dim('After verifying: correct the figure, bump lastVerified, append to the'),
  );
  console.log(dim('observation series, and add a revisions entry if anything moved.\n'));
  process.exit(0);
}

function printPost(p, tag) {
  console.log(`\n${tag} ${bold(p.title)}`);
  console.log(dim(`   ${p.url}`));
  console.log(dim(`   last verified ${p.updatedDate} · ${p.ageDays} days ago · ${p.revisionCount} log entries`));
  if (p.claims.length) {
    const preview = p.claims.slice(0, 12).join('  ');
    console.log(`   ${dim('figures to re-check:')} ${preview}${p.claims.length > 12 ? dim(` …+${p.claims.length - 12}`) : ''}`);
  }
  for (const s of p.sources) console.log(dim(`   ↗ ${s}`));
}

console.log(bold(`\nExpatWon freshness audit — ${today.toISOString().slice(0, 10)}`));
console.log(dim(`${posts.length} published guides · re-verify every ${DUE_DAYS} days\n`));

if (due.length) {
  console.log(red(bold(`DUE NOW (${due.length})`)));
  due.forEach((p) => printPost(p, red('●')));
} else {
  console.log(green('✓ Nothing is overdue.'));
}

if (soon.length) {
  console.log(yellow(bold(`\n\nDUE SOON (${soon.length})`)));
  soon.forEach((p) => printPost(p, yellow('○')));
}

if (showAll) {
  console.log(bold('\n\nALL GUIDES BY AGE'));
  for (const p of posts) {
    const mark = p.ageDays >= DUE_DAYS ? red('●') : p.ageDays >= SOON_DAYS ? yellow('○') : green('·');
    console.log(`${mark} ${String(p.ageDays).padStart(4)}d  ${p.updatedDate}  ${p.title}`);
  }
}

console.log(dim(`\nAfter verifying: update the figure, bump updatedDate, and add a revisions entry.\n`));
