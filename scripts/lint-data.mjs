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

for (const file of readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))) {
  const body = readFileSync(join(POSTS_DIR, file), 'utf8');
  const fm = body.split(/^---$/m)[1] ?? '';
  const where = `${POSTS_DIR}/${file}`;

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
    `${pairs} paired days.`,
);
