#!/usr/bin/env node
/**
 * Referential integrity for the three content layers.
 *
 * Articles reference observation series and evidence records by key. Nothing
 * in Astro checks that those keys resolve, so a renamed JSON file would leave
 * an article silently pointing at nothing — the failure mode that makes a
 * data layer stop being trustworthy. This runs before the build and refuses
 * the build on any dangling reference or malformed record.
 *
 * Also enforces the rules that only matter to a human: evidence must say what
 * was redacted, and an observation history must run oldest-first so "latest"
 * means what the code assumes it means.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const OBS_DIR = 'src/data/observations';
const EV_DIR = 'src/data/evidence';
const VERIFY_DIR = 'src/data/verification';
const POSTS_DIR = 'src/content/posts';

const errors = [];
const warnings = [];

const readJson = (dir, file) => {
  try {
    return JSON.parse(readFileSync(join(dir, file), 'utf8'));
  } catch (err) {
    errors.push(`${dir}/${file}: not valid JSON — ${err.message}`);
    return null;
  }
};

const listJson = (dir) => {
  try {
    return readdirSync(dir).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
};

// ---------------------------------------------------------------- observations
const TYPES = new Set(['amount', 'rate', 'schedule']);
const CADENCE = new Set(['annual', 'quarterly', 'monthly']);
const observationKeys = new Set();

for (const file of listJson(OBS_DIR)) {
  const s = readJson(OBS_DIR, file);
  if (!s) continue;
  const where = `${OBS_DIR}/${file}`;
  const expected = basename(file, '.json');

  if (s.key !== expected) errors.push(`${where}: key "${s.key}" does not match the filename`);
  observationKeys.add(s.key);

  for (const field of ['label', 'unit', 'appliesTo', 'why']) {
    if (!s[field]?.trim()) errors.push(`${where}: "${field}" is required`);
  }
  if (!TYPES.has(s.type)) errors.push(`${where}: type must be one of ${[...TYPES].join(', ')}`);
  if (!CADENCE.has(s.check)) errors.push(`${where}: check must be one of ${[...CADENCE].join(', ')}`);

  if (!Array.isArray(s.history) || s.history.length === 0) {
    errors.push(`${where}: history must hold at least one reading`);
    continue;
  }

  let previous = '';
  for (const [i, p] of s.history.entries()) {
    const at = `${where} history[${i}]`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date ?? '')) errors.push(`${at}: date must be YYYY-MM-DD`);
    else if (p.date < previous) errors.push(`${at}: out of order — history runs oldest-first`);
    else previous = p.date;

    if (typeof p.value !== 'number' || Number.isNaN(p.value))
      errors.push(`${at}: value must be a number, so the series can be charted`);
    if (!p.display?.trim()) errors.push(`${at}: display is required`);
    if (!p.source?.trim()) errors.push(`${at}: source is required — an unsourced reading is a rumour`);
  }

  // Changes already in law but not yet in force. Kept out of `history` so the
  // published "current" figure can never silently become a future one; every
  // entry must therefore sit strictly after the last recorded reading.
  if (s.scheduled !== undefined) {
    if (!Array.isArray(s.scheduled) || s.scheduled.length === 0) {
      errors.push(`${where}: scheduled, if present, must hold at least one entry`);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      let prev = previous;
      for (const [i, p] of s.scheduled.entries()) {
        const at = `${where} scheduled[${i}]`;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date ?? '')) {
          errors.push(`${at}: date must be YYYY-MM-DD`);
        } else if (p.date <= prev) {
          errors.push(
            `${at}: ${p.date} is not after the previous entry (${prev}) — ` +
              `scheduled runs oldest-first and starts after the last history point`,
          );
        } else {
          if (p.date <= today) {
            warnings.push(
              `observation "${s.key}" scheduled ${p.date} is now in force — move it into history`,
            );
          }
          prev = p.date;
        }
        if (typeof p.value !== 'number' || Number.isNaN(p.value))
          errors.push(`${at}: value must be a number`);
        if (!p.display?.trim()) errors.push(`${at}: display is required`);
        if (!p.source?.trim()) errors.push(`${at}: source is required`);
      }
    }
  }
}

// ------------------------------------------------------------------- evidence
const evidenceIds = new Set();

for (const file of listJson(EV_DIR)) {
  const e = readJson(EV_DIR, file);
  if (!e) continue;
  const where = `${EV_DIR}/${file}`;

  if (e.id !== basename(file, '.json')) errors.push(`${where}: id does not match the filename`);
  evidenceIds.add(e.id);

  for (const field of ['title', 'cluster', 'asset', 'alt', 'note', 'redaction']) {
    if (!e[field]?.trim()) errors.push(`${where}: "${field}" is required`);
  }
  if (!['first_party', 'observed'].includes(e.type))
    errors.push(`${where}: type must be first_party or observed`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date ?? ''))
    errors.push(`${where}: date must be YYYY-MM-DD`);
  if (e.asset && !e.asset.startsWith('/evidence/')) {
    errors.push(`${where}: asset must live under /evidence/`);
  } else if (e.asset) {
    // A record pointing at a missing image renders a broken picture where the
    // reader was promised proof. Worse than having no evidence at all.
    const onDisk = join('public', e.asset.replace(/^\//, ''));
    if (!existsSync(onDisk)) errors.push(`${where}: asset not found at ${onDisk}`);
  }

  for (const key of e.supports ?? []) {
    if (!observationKeys.has(key))
      errors.push(`${where}: supports unknown observation "${key}"`);
  }
}

// --------------------------------------------------------------- verification
// A state matrix, not a series. Validated here for the same reason the
// series are: the value of the dataset is that every row is trustworthy, and
// one row asserting a service rule with nobody behind it spoils the rest.
const VERIFY_STATES = new Set(['works', 'needs-rc', 'alternative']);
let verifyRows = 0;

for (const file of listJson(VERIFY_DIR)) {
  const a = readJson(VERIFY_DIR, file);
  if (!a) continue;
  const where = `${VERIFY_DIR}/${file}`;

  if (a.id !== basename(file, '.json')) errors.push(`${where}: id does not match the filename`);
  for (const field of ['area', 'summary', 'source']) {
    if (!a[field]?.trim()) errors.push(`${where}: "${field}" is required`);
  }
  if (!Array.isArray(a.items) || a.items.length === 0) {
    errors.push(`${where}: items must hold at least one task`);
    continue;
  }
  for (const [i, item] of a.items.entries()) {
    const at = `${where} items[${i}]`;
    if (!item.task?.trim()) errors.push(`${at}: task is required`);
    if (!item.note?.trim()) errors.push(`${at}: note is required — a bare state explains nothing`);
    if (!VERIFY_STATES.has(item.state))
      errors.push(`${at}: state must be one of ${[...VERIFY_STATES].join(', ')}`);
    verifyRows++;
  }
}

// ------------------------------------------------------------------- articles
const frontmatterList = (body, field) => {
  // inline form: `tracked: [a, b]`
  const inline = body.match(new RegExp(`^${field}:\\s*\\[(.*?)\\]\\s*$`, 'm'));
  if (inline) {
    return inline[1]
      .split(',')
      .map((v) => v.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  }
  // block form: `tracked:` then `  - a`
  const block = body.match(new RegExp(`^${field}:\\s*$([\\s\\S]*?)^\\S`, 'm'));
  if (!block) return [];
  return [...block[1].matchAll(/^\s+-\s*['"]?([^'"\n]+?)['"]?\s*$/gm)].map((m) => m[1].trim());
};

let tracking = 0;
let pairs = 0;
const postMeta = new Map();
const postBodies = [];

for (const file of readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))) {
  const body = readFileSync(join(POSTS_DIR, file), 'utf8');
  const fm = body.split(/^---$/m)[1] ?? '';
  const where = `${POSTS_DIR}/${file}`;
  const scalar = (field) =>
    fm.match(new RegExp(`^${field}:\\s*['\"]?([^'\"\n]+?)['\"]?\\s*$`, 'm'))?.[1]?.trim();

  const slug = basename(file, '.md');
  const meta = {
    slug,
    category: scalar('category') ?? '',
    date: scalar('publishDate') ?? '',
    slot: scalar('slot') === 'pm' ? 'pm' : 'am',
    draft: scalar('draft') === 'true',
  };
  postMeta.set(slug, meta);
  postBodies.push({ where, meta, body: body.split(/^---$/m).slice(2).join('---') });

  const tracked = frontmatterList(fm, 'tracked');
  if (tracked.length > 0) tracking++;
  for (const key of tracked) {
    if (!observationKeys.has(key)) errors.push(`${where}: tracks unknown observation "${key}"`);
  }
  for (const id of frontmatterList(fm, 'evidence')) {
    if (!evidenceIds.has(id)) errors.push(`${where}: cites unknown evidence record "${id}"`);
  }

  // A pair points at the other half of the day. PairedGuide renders nothing
  // when the target is unpublished, so a typo or a since-renamed slug fails
  // silently and the pillar simply never links to its partner. Caught here
  // instead — twice already this has been found only by reading the diff.
  const paired = fm.match(/^pairedWith:\s*['"]?([^'"\n]+?)['"]?\s*$/m)?.[1]?.trim();
  if (paired) {
    pairs++;
    if (!existsSync(join(POSTS_DIR, `${paired}.md`))) {
      errors.push(`${where}: pairedWith "${paired}" does not exist`);
    }
  }
}

// -------------------------------------------------------------- forward links
// A guide may only link to a guide that is already out. At two posts a day
// the morning pillar goes live nine hours before the afternoon piece, so an
// inline link to the day's other half is a 404 for the whole morning — which
// is exactly when the post is being read. PairedGuide exists to carry that
// link safely; this rule stops the manuscript smuggling it back in.
//
// It also catches the quieter failure: the right slug under the wrong
// category prefix, which 404s permanently.
const slotOrder = (m) => `${m.date}#${m.slot === 'pm' ? 1 : 0}`;

for (const { where, meta, body } of postBodies) {
  const links = [
    ...body.matchAll(/\]\(\/([a-z0-9-]+)\/([a-z0-9-]+)\/\)/g),
    ...body.matchAll(/href="\/([a-z0-9-]+)\/([a-z0-9-]+)\/"/g),
  ];
  for (const [, prefix, slug] of links) {
    const target = postMeta.get(slug);
    if (!target) continue; // /tracked/, /tools/ and friends are not posts

    if (target.category !== prefix) {
      errors.push(
        `${where}: links to /${prefix}/${slug}/ but that post lives in "${target.category}"`,
      );
    }
    // Only a target that is *still a draft* can be dead. Once both halves are
    // out the link works, and the window it was dead for is history — there is
    // nothing left to fix in an article published three weeks ago.
    if (target.draft && slotOrder(target) > slotOrder(meta)) {
      errors.push(
        `${where}: links to "${slug}", which publishes later ` +
          `(${target.date} ${target.slot} vs ${meta.date} ${meta.slot}) — dead link on release`,
      );
    }
  }
}

// ------------------------------------------------------------------- unused
for (const key of observationKeys) {
  const cited = readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .some((f) => frontmatterList(readFileSync(join(POSTS_DIR, f), 'utf8'), 'tracked').includes(key));
  if (!cited) warnings.push(`observation "${key}" is not tracked by any article`);
}

// -------------------------------------------------------------------- report
for (const w of warnings) console.warn(`  warn  ${w}`);
if (errors.length > 0) {
  console.error(`\n✗ Data lint failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log(
  `✓ Data lint passed — ${observationKeys.size} observation series, ` +
    `${evidenceIds.size} evidence records, ${tracking} articles tracking figures, ` +
    `${pairs} paired days, ${verifyRows} verification rows.`,
);
