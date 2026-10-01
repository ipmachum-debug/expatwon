/**
 * Pull the day's reference rates from Korea Eximbank into a committed JSON.
 *
 * Run by .github/workflows/exchange-sync.yml once a day. The key comes from
 * KEXIM_API_KEY in the environment and is never written anywhere this script
 * can reach — not into the output, not into a log line.
 *
 * The single rule that shapes everything below: A BAD SYNC MUST LEAVE THE
 * LAST GOOD FILE ALONE. The feed has several ordinary ways of returning
 * nothing, and none of them mean "the rates are gone":
 *
 *   - It publishes on business days. Saturday, Sunday and a public holiday
 *     return an empty array, which is correct, not an outage.
 *   - It returns an empty array before the day's rates are posted, so a run
 *     that lands early in the Korean morning sees nothing.
 *   - It has its own result codes for a bad key and for a daily call limit.
 *
 * So: walk back day by day until a day answers, and if none does, exit 0
 * having written nothing. A failed sync is a no-op, never an erasure. The
 * only thing that fails the run is a missing key, which is a setup error
 * rather than a bad day.
 *
 * Whether every currency in WANTED is in the Eximbank table is not assumed.
 * Whatever comes back is kept; what is asked for and missing is reported at
 * the end so it shows up in the Actions log rather than silently never
 * appearing on the page.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = 'src/data/live/exchange-rates.json';
/** Overridable so the parse path can be exercised against a local mock; the
 * live API cannot be reached from a sandbox and an untested parser is how a
 * per-100 quote ends up on the page as a per-1 one. Defaults to the real one. */
const ENDPOINT = process.env.KEXIM_ENDPOINT ?? 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON';
/** Everything the site may want, which is a superset of what the card shows. */
const WANTED = ['USD', 'EUR', 'JPY', 'VND', 'CNH', 'CNY', 'GBP', 'AUD', 'CAD', 'PHP', 'THB', 'IDR'];
/** Business days are never more than a few apart, even across a long holiday. */
const MAX_LOOKBACK_DAYS = 10;

const key = process.env.KEXIM_API_KEY;
if (!key) {
  console.error('KEXIM_API_KEY is not set. Add it as a repository secret.');
  process.exit(1);
}

const kstDate = (d) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

/** Eximbank's own result codes. 1 is success; the rest are worth naming. */
const RESULT = { 2: 'DATA code error', 3: 'authentication error', 4: 'daily call limit reached' };

async function fetchDay(ymd) {
  const url = `${ENDPOINT}?authkey=${encodeURIComponent(key)}&searchdate=${ymd}&data=AP01`;
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  } catch (e) {
    // fetch reports every network-level failure as a bare TypeError, so the
    // name alone says nothing. The reason — DNS, TLS, refused, timed out —
    // is on e.cause, and without it a run that cannot reach the host at all
    // looks exactly like a quiet holiday in the log.
    const c = e.cause;
    const why = c?.code ?? c?.message ?? e.message ?? e.name;
    console.warn(`  ${ymd}: request failed — ${why}`);
    return { stop: `cannot reach ${new URL(ENDPOINT).host} (${why})` };
  }
  if (!res.ok) {
    console.warn(`  ${ymd}: HTTP ${res.status}`);
    return { stop: `${new URL(ENDPOINT).host} answered HTTP ${res.status}` };
  }
  let body;
  try {
    body = await res.json();
  } catch {
    console.warn(`  ${ymd}: response was not JSON`);
    return null;
  }
  if (!Array.isArray(body) || body.length === 0) {
    console.log(`  ${ymd}: no quotes (non-business day, or not yet published)`);
    return null;
  }
  const bad = body.find((r) => r.result && r.result !== 1);
  if (bad) {
    // A rejected key, a bad data code and a spent call quota are all states
    // of the request, not of the day. Asking for an older date repeats the
    // same rejection ten more times, so these stop the walk immediately.
    const label = RESULT[bad.result] ?? `result code ${bad.result}`;
    console.warn(`  ${ymd}: ${label}`);
    return { stop: `the API rejected the request — ${label}` };
  }
  return body;
}

/** "JPY(100)" -> { code: 'JPY', per: 100 };  "USD" -> { code: 'USD', per: 1 } */
function parseUnit(cur) {
  const m = /^([A-Z]{3})\s*\(\s*([\d,]+)\s*\)$/.exec(cur.trim());
  if (m) return { code: m[1], per: Number(m[2].replace(/,/g, '')) };
  return { code: cur.trim().toUpperCase(), per: 1 };
}

const num = (s) => {
  const n = Number(String(s ?? '').replace(/,/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

let rows = null;
let quotedOn = null;
let unreachable = 0;
for (let back = 0; back <= MAX_LOOKBACK_DAYS; back++) {
  const ymd = kstDate(new Date(Date.now() - back * 86_400_000));
  const got = await fetchDay(ymd.replace(/-/g, ''));
  if (got?.stop) {
    // One retry covers a blip. Past that, the request itself is being
    // refused — unreachable host, bad key, spent quota — and asking for an
    // older date repeats the same refusal. These are states of the request,
    // not of the day, so the walk ends here and says which one it was.
    if (++unreachable >= 2) {
      console.error(`Giving up after ${unreachable} attempts: ${got.stop}.`);
      console.error('Not a quiet day — the request never succeeded. Leaving the file untouched.');
      console.log('::count::0');
      process.exit(0);
    }
    continue;
  }
  if (got) {
    rows = got;
    quotedOn = ymd;
    break;
  }
}

if (!rows) {
  console.log(`No day answered within ${MAX_LOOKBACK_DAYS} days. Leaving ${OUT} untouched.`);
  console.log('::count::0');
  process.exit(0);
}

const rates = {};
for (const row of rows) {
  const { code, per } = parseUnit(row.cur_unit ?? '');
  const krw = num(row.deal_bas_r);
  if (!WANTED.includes(code) || krw === null) continue;
  rates[code] = { krw, per, name: (row.cur_nm ?? '').trim() };
}

if (Object.keys(rates).length === 0) {
  console.warn(`${quotedOn} answered but carried none of the wanted currencies. Leaving ${OUT} untouched.`);
  console.log('::count::0');
  process.exit(0);
}

const prev = JSON.parse(readFileSync(OUT, 'utf8'));
const next = {
  source: prev.source,
  quotedOn,
  fetchedAt: new Date().toISOString(),
  // Sorted so a day with no change produces no diff beyond the timestamps.
  rates: Object.fromEntries(Object.keys(rates).sort().map((k) => [k, rates[k]])),
};

const changed =
  prev.quotedOn !== next.quotedOn || JSON.stringify(prev.rates) !== JSON.stringify(next.rates);
if (!changed) {
  console.log(`${quotedOn}: identical to what is already committed. Nothing to write.`);
  console.log('::count::0');
  process.exit(0);
}

writeFileSync(OUT, JSON.stringify(next, null, 2) + '\n');
const missing = WANTED.filter((c) => !rates[c]);
console.log(`${quotedOn}: wrote ${Object.keys(rates).length} rates to ${OUT}`);
if (missing.length) console.log(`  not carried by the feed: ${missing.join(', ')}`);
console.log('::count::1');
