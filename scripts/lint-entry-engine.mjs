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

/* ── e-Arrival reads the ROUTE, not the set of documents held ────────────── */
// The case the route model exists for: both documents, opposite answers.
eq('AC keta only', assessArrivalCard({ entryRoute: 'visa-free', validApprovedKeta: true }).needed, false);
eq('AC keta but entering on visa',
  assessArrivalCard({ entryRoute: 'visa', validVisaOnEntryDate: true, validApprovedKeta: true }).needed, true);
// A KOR-approved ABTC is its own must-file entry.
eq('AC abtc valid', assessArrivalCard({ entryRoute: 'abtc', validAbtcForKorea: true }).needed, true);
// Conditions unchecked: we do not decide on a condition we were told is unknown.
eq('AC abtc unverified', assessArrivalCard({ entryRoute: 'abtc' }).needed, null);
eq('AC abtc failed KOR', assessArrivalCard({ entryRoute: 'abtc', validAbtcForKorea: false }).needed, null);
// Validity, not possession — a visa that lapses before arrival is not the route.
eq('AC visa lapsed', assessArrivalCard({ entryRoute: 'visa', validVisaOnEntryDate: false }).needed, null);
eq('AC visa unconfirmed', assessArrivalCard({ entryRoute: 'visa' }).needed, null);
// Exclusions.
eq('AC residence', assessArrivalCard({ entryRoute: 'residence', validResidenceCard: true }).needed, false);
eq('AC group visa', assessArrivalCard({ entryRoute: 'group-visa' }).needed, false);
// Named routes.
eq('AC sofa', assessArrivalCard({ entryRoute: 'sofa' }).needed, true);
eq('AC un', assessArrivalCard({ entryRoute: 'un' }).needed, true);
// Not asked is not a route.
eq('AC unasked', assessArrivalCard(undefined).needed, null);
eq('AC other', assessArrivalCard({ entryRoute: 'other' }).needed, null);

/* ── Every route out of K-ETA leads into the declaration ─────────────────── */
for (const r of ['temporary-country-exemption', 'age-under-17', 'age-over-65', 'diplomatic-service-passport'] as const) {
  const out = assessArrivalCard({ entryRoute: 'visa-free', ketaExempt: r });
  eq('AC keta-exempt ' + r, out.needed, true);
  if (!out.reasons.join(' ').includes('exempt from K-ETA')) fails.push('AC keta-exempt ' + r + ': does not say why');
}
// Visa-free with no K-ETA and no exemption: files, and says the answer can flip.
const bare = assessArrivalCard({ entryRoute: 'visa-free', validApprovedKeta: false });
eq('AC visa-free bare', bare.needed, true);
if (!bare.reasons.join(' ').includes('flips')) fails.push('AC visa-free bare: does not say the answer can change');

/* ── assess() hands the exemption reason down, so the reader is told why ─── */
const usFree = assess({ ...T, country: 'US', arrival: { entryRoute: 'visa-free', validApprovedKeta: false } });
eq('US visa-free files', usFree.arrivalCard?.needed, true);
if (!usFree.arrivalCard?.reasons.join(' ').includes('temporary country waiver'))
  fails.push('US visa-free: exemption reason not passed down from assess()');
// Same nationality, different route, opposite answer. That is the whole point.
eq('US on a visa files', assess({ ...T, country: 'US', arrival: { entryRoute: 'visa', validVisaOnEntryDate: true } }).arrivalCard?.needed, true);
eq('US on residence excluded', assess({ ...T, country: 'US', arrival: { entryRoute: 'residence', validResidenceCard: true } }).arrivalCard?.needed, false);

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

/* ── Block 3 answers on every path — it does not depend on nationality ───── */
// Found by clicking: an early return left the previous reader's answer on screen.
const route = { entryRoute: 'visa', validVisaOnEntryDate: true } as const;
for (const [name, input] of [
  ['unknown nationality', { ...T, country: 'ZZ', arrival: route }],
  ['GB category unchosen', { ...T, country: 'GB', arrival: route }],
  ['stay too long', { ...T, country: 'US', days: 400, arrival: route }],
  ['work or study', { ...T, country: 'US', purpose: 'work-study', arrival: route }],
  ['diplomatic passport', { ...T, country: 'US', passport: 'diplomatic-official', arrival: route }],
] as const) {
  eq('AC present: ' + name, assess(input as any).arrivalCard?.needed, true);
}

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

// Out-of-scope leaves K-ETA unanswered ON PURPOSE — it is the authorisation for
// travelling WITHOUT a visa, so it is not on the path of a trip that needs one.
// The screen relies on this to say 'Not this route' instead of pretending it is
// still waiting for the nationality it was just given.
{
  const over = assess({ ...T, country: 'ZA', days: 40 });
  eq('over the allowance is out of scope', over.verdict, 'out-of-scope');
  eq('out of scope answers no K-ETA', over.keta, undefined);
  // And the reason has to be citable, or the screen has a claim with nothing under it.
  if (over.basis.length === 0) fails.push('ZA over-limit: verdict with no basis');
}

/* ── The expansion rows: shape, uniqueness, and no invented K-ETA ────────── */
{
  const seen = new Set();
  for (const r of COUNTRY_RULES) {
    const key = r.code + '/' + r.category;
    if (seen.has(key)) fails.push('duplicate row ' + key);
    seen.add(key);
    if (!/^[A-Z]{2}$/.test(r.code)) fails.push(key + ': not an ISO alpha-2 code');
    if (!r.name.trim()) fails.push(key + ': no name');
    // A category other than 'default' must tell the reader what it is — that is
    // the whole reason the row was split off.
    if (r.category !== 'default' && !r.categoryLabel) fails.push(key + ': split row with no label');
    // A waiver is a claim with an end date. One without an end date renders as
    // "exempt" forever.
    if (r.keta.temporaryExemption && !r.keta.temporaryExemption.until) fails.push(key + ': waiver with no end date');
    // The inference this expansion must never make: visa-free therefore K-ETA.
    if (r.keta.eligible !== true && r.keta.temporaryExemption) fails.push(key + ': waiver on a row not established as in scope');
  }
}

// A row whose K-ETA position was never read must say so and hand over the
// official page — never a silent 'no', and never a blocked visa-free verdict.
{
  const unread = COUNTRY_RULES.find((r) => r.keta.eligible === null && r.category === 'default');
  if (!unread) {
    fails.push('expected at least one row with an unread K-ETA position');
  } else {
    const res = assess({ ...T, country: unread.code, days: 1 });
    eq('unread keta says so', res.keta?.status, 'unestablished');
    eq('unread keta is not a no', res.keta?.needed, null);
    eq('unread keta still routes', Boolean(res.officialCheck), true);
    // The point of splitting the two verdicts: an unknown K-ETA position must
    // not reach back and change the visa-free answer.
    if (res.verdict === 'out-of-scope') fails.push(unread.code + ': unread K-ETA blocked the visa-free verdict');
  }
}

// Rolling allowances count earlier visits this form does not ask for, so they
// must land on check-required rather than a confident yes.
for (const r of COUNTRY_RULES) {
  if (r.stay.kind !== 'rolling') continue;
  const res = assess({ ...T, country: r.code, days: 1 });
  if (res.verdict !== 'check-required') fails.push(r.code + ': rolling allowance resolved to ' + res.verdict);
}

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
