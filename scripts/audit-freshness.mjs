#!/usr/bin/env node
/**
 * Freshness audit — the detection half of the six-month re-verification policy.
 *
 *   npm run audit           → what is due now (and what is due soon)
 *   npm run audit -- --all  → every post, sorted by age
 *   npm run audit -- --json → machine-readable, for a future scheduled job
 *
 * It never edits a post. It tells you WHICH guides are due, WHAT figures they
 * assert, and WHERE to verify them — the judgement stays with a human, because
 * a mis-parsed official page silently rewriting a YMYL figure is worse than a
 * stale one.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = 'src/content/posts';
const DUE_DAYS = 182; // ~6 months
const SOON_DAYS = 152; // flag a month ahead

const args = process.argv.slice(2);
const showAll = args.includes('--all');
const asJson = args.includes('--json');

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
  return {
    title: get('title'),
    category: get('category'),
    updatedDate: get('updatedDate'),
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
    const updated = new Date(fm.updatedDate);
    return {
      slug: file.replace(/\.md$/, ''),
      url: `/${fm.category}/${file.replace(/\.md$/, '')}/`,
      title: fm.title,
      draft: fm.draft,
      updatedDate: fm.updatedDate,
      ageDays: daysBetween(today, updated),
      sources: fm.sources,
      revisionCount: fm.revisionCount,
      claims: extractClaims(fm.body),
    };
  })
  .filter((p) => !p.draft)
  .sort((a, b) => b.ageDays - a.ageDays);

const due = posts.filter((p) => p.ageDays >= DUE_DAYS);
const soon = posts.filter((p) => p.ageDays >= SOON_DAYS && p.ageDays < DUE_DAYS);

if (asJson) {
  console.log(JSON.stringify({ generated: today.toISOString(), due, soon, posts }, null, 2));
  process.exit(0);
}

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;

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
