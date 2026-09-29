/**
 * Entry-engine regression gate.
 *
 * These are not unit tests for their own sake — every case here is one that was
 * wrong at some point, or is a place where two plausible orderings give
 * opposite answers. A checker that tells somebody the wrong thing about a
 * boarding gate fails quietly, so the build refuses rather than warns.
 *
 * Run by `npm run build` and `npm run check`.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'entry-engine-'));
const runner = join(dir, 'run.ts');
const root = new URL('..', import.meta.url).pathname;

writeFileSync(
  runner,
  `
import { assess, assessArrivalCard, COUNTRY_RULES, supportedCountries, resolveStay } from ${JSON.stringify(join(root, 'src/data/visaFreeEntry.ts'))};
import { routeFor } from ${JSON.stringify(join(root, 'src/data/businessVisitRoutes.ts'))};

const fails: string[] = [];
const eq = (name: string, got: unknown, want: unknown) => {
  if (got !== want) fails.push(\`\${name}: got \${JSON.stringify(got)}, want \${JSON.stringify(want)}\`);
};

const T = { passport: 'ordinary', purpose: 'tourism-visit', days: 10, arrivalDate: '2026-11-10' } as const;

/* ── e-Arrival: the official lists put these on opposite sides ───────────── */
// Order-sensitive. A visa beats an approved K-ETA; a group e-visa beats both.
eq('AC visa+keta', assessArrivalCard(['korean-visa', 'approved-keta']).needed, true);
eq('AC group-visa', assessArrivalCard(['group-visa']).needed, false);
eq('AC group+visa', assessArrivalCard(['group-visa', 'korean-visa']).needed, false);
eq('AC keta alone', assessArrivalCard(['approved-keta']).needed, false);
eq('AC visa alone', assessArrivalCard(['korean-visa']).needed, true);
eq('AC abtc', assessArrivalCard(['abtc']).needed, true);
eq('AC residence card', assessArrivalCard(['residence-card']).needed, false);
eq('AC none', assessArrivalCard(['none']).needed, true);
// Not asked is not 'none'.
eq('AC unasked', assessArrivalCard(undefined).needed, null);

/* ── K-ETA is never derived from the visa-free verdict, nor the reverse ──── */
// Inside the temporary waiver.
eq('KETA US', assess({ ...T, country: 'US' }).keta?.status, 'temporarily-exempt');
// Outside it: a passport fact must not become a personal instruction.
eq('KETA MY', assess({ ...T, country: 'MY' }).keta?.status, 'personal-check');
eq('KETA TH', assess({ ...T, country: 'TH' }).keta?.status, 'personal-check');
// ...and that must NOT drag the visa-free answer down with it.
eq('MY still in scope', assess({ ...T, country: 'MY' }).verdict, 'in-scope');
eq('TH still in scope', assess({ ...T, country: 'TH' }).verdict, 'in-scope');
// An arrival past the waiver expires the K-ETA answer only.
const late = assess({ ...T, country: 'US', arrivalDate: '2027-02-01' });
eq('late keta', late.keta?.status, 'unestablished');
eq('late visa-free', late.verdict, 'in-scope');

/* ── Months are not 30 days ──────────────────────────────────────────────── */
eq('CA 6mo from 2026-03-15', resolveStay({ kind: 'months', value: 6 }, '2026-03-15').limitDays, 184);
eq('CA 6mo from 2026-11-10', resolveStay({ kind: 'months', value: 6 }, '2026-11-10').limitDays, 181);
eq('NL 3mo from 2026-12-01', resolveStay({ kind: 'months', value: 3 }, '2026-12-01').limitDays, 90);

/* ── The UK is six rows, and the majority answer is wrong for five ───────── */
eq('GB unchosen', assess({ ...T, country: 'GB' }).verdict, 'check-required');
eq('GB options', assess({ ...T, country: 'GB' }).categoryChoice?.options.length, 6);
eq('GB citizen 60d', assess({ ...T, country: 'GB', days: 60, nationalityCategory: 'british-citizen' }).verdict, 'in-scope');
eq('GB subject 60d', assess({ ...T, country: 'GB', days: 60, nationalityCategory: 'british-subject' }).verdict, 'out-of-scope');

/* ── Nothing unverified may produce a verdict ────────────────────────────── */
eq('unknown nationality', assess({ ...T, country: 'DE' }).verdict === 'check-required' ? 'x' : 'ok', 'ok'); // DE is known
eq('truly unknown', assess({ ...T, country: 'ZZ' }).verdict, 'check-required');
eq('no basis when unknown', assess({ ...T, country: 'ZZ' }).basis.length, 0);

/* ── Activity decides before passport ───────────────────────────────────── */
eq('paid work, visa-free national', routeFor('paid-work', true).route, 'employment-visa');
eq('meeting, visa-free national', routeFor('meeting', true).route, 'visa-free-visit');
eq('meeting, not visa-free', routeFor('meeting', false).route, 'short-business-visa');
// A 'check-required' entry verdict must not collapse into a no.
eq('meeting, unresolved', routeFor('meeting', null).route, 'check-required');
// Business is inside visa-free entry, not outside it.
eq('business purpose resolves', assess({ ...T, country: 'US', purpose: 'business-meeting' }).verdict, 'in-scope');

/* ── Every row is citable ────────────────────────────────────────────────── */
for (const r of COUNTRY_RULES) {
  if (r.verified.length === 0) fails.push(\`\${r.code}/\${r.category}: no source\`);
  for (const v of r.verified) {
    if (!v.source?.url || !v.verifiedOn || !v.verifiedBy) fails.push(\`\${r.code}/\${r.category}: incomplete provenance\`);
  }
}

if (fails.length) {
  console.error('\\u2717 entry engine: ' + fails.length + ' failing');
  for (const f of fails) console.error('  - ' + f);
  process.exit(1);
}
console.log('\\u2713 Entry engine passed \\u2014 ' + COUNTRY_RULES.length + ' rules, ' + supportedCountries().length + ' nationalities.');
`,
);

// Node's own type stripping, not tsx. A build gate must not depend on a
// package that is only ever fetched on the fly — the day the network is slow is
// the day the gate silently stops running.
try {
  const out = execFileSync(
    process.execPath,
    ['--experimental-strip-types', '--no-warnings', runner],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  process.stdout.write(out);
} catch (err) {
  process.stderr.write(err.stdout ?? '');
  process.stderr.write(err.stderr ?? '');
  process.exit(1);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
