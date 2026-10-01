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
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import tls from 'node:tls';

const OUT = 'src/data/live/exchange-rates.json';
/** Overridable so the parse path can be exercised against a local mock; the
 * live API cannot be reached from a sandbox and an untested parser is how a
 * per-100 quote ends up on the page as a per-1 one. Defaults to the real one. */
const ENDPOINT = process.env.KEXIM_ENDPOINT ?? 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON';
/** Everything the site may want, which is a superset of what the card shows. */
const WANTED = ['USD', 'EUR', 'JPY', 'VND', 'CNH', 'CNY', 'GBP', 'AUD', 'CAD', 'PHP', 'THB', 'IDR'];
/** Business days are never more than a few apart, even across a long holiday. */
const MAX_LOOKBACK_DAYS = 10;

/**
 * The host serves its leaf certificate without the intermediate above it, so
 * the chain does not reach a trusted root on its own. NODE_EXTRA_CA_CERTS was
 * the obvious lever and did not take — undici, which backs global fetch, did
 * not honour it here. Rather than guess at why, the trust material is now
 * handed over explicitly: the full default root set PLUS the intermediate,
 * passed as `ca` to a plain node:https request.
 *
 * This is stricter than it looks and nothing is being waived. Every root Node
 * normally trusts is still required, the intermediate still has to be signed
 * by one of them, and a forged certificate fails exactly as before. The only
 * thing added is the one certificate the server should have sent itself.
 *
 * Without KEXIM_EXTRA_CA the defaults are used untouched, so a host with a
 * complete chain needs none of this.
 */
const extraCaPath = process.env.KEXIM_EXTRA_CA;
const CA = (() => {
  if (!extraCaPath) return undefined;
  if (!existsSync(extraCaPath)) {
    console.warn(`KEXIM_EXTRA_CA points at ${extraCaPath}, which does not exist. Using defaults.`);
    return undefined;
  }
  const pem = readFileSync(extraCaPath, 'utf8');
  const n = (pem.match(/BEGIN CERTIFICATE/g) ?? []).length;
  if (n === 0) {
    console.warn(`${extraCaPath} holds no certificate. Using defaults.`);
    return undefined;
  }
  // Say what was loaded. A silently empty or unreadable trust file looks
  // identical to a server problem from the error alone, and that cost a run.
  console.log(`Trust store: ${tls.rootCertificates.length} default roots + ${n} from ${extraCaPath}`);
  return [...tls.rootCertificates, pem];
})();

/**
 * GET a JSON body. node:https rather than fetch, for the `ca` option above —
 * which also means redirects are not followed for us, as fetch would. This
 * host answers 302, so they are followed here, with a cap.
 */
function getJson(url, timeoutMs, hops = 5, jar = new Map()) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === 'http:' ? http : https;
    const headers = {
      // Some portals answer a bare client with a redirect loop rather than a
      // refusal, so this is not decoration.
      'User-Agent': 'expatwon-exchange-sync/1 (+https://expatwon.com)',
      Accept: 'application/json, text/plain, */*',
    };
    if (jar.size) headers.Cookie = [...jar].map(([k, v]) => `${k}=${v}`).join('; ');
    const req = mod.get(url, { ca: u.protocol === 'https:' ? CA : undefined, headers }, (res) => {
      // Carry cookies across hops. A server that answers 302 to the SAME
      // path is usually setting a session cookie and waiting to be shown it
      // again; without a jar that is an endless loop back to where we were.
      for (const c of res.headers['set-cookie'] ?? []) {
        const pair = c.split(';')[0];
        const i = pair.indexOf('=');
        if (i > 0) jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
      }
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        res.resume();
        const loc = res.headers.location;
        if (!loc || hops === 0) {
          reject(Object.assign(new Error(`HTTP ${res.statusCode} with nowhere to follow`), { status: res.statusCode }));
          return;
        }
        // Where it goes matters: a redirect to a login or error page is a
        // different problem from a redirect to the same resource elsewhere,
        // and the status code alone cannot tell those apart.
        const next = new URL(loc, url);
        const same = next.origin + next.pathname === u.origin + u.pathname;
        // Whether the query survived matters: a redirect that drops authkey
        // and searchdate lands on the same path asking for nothing.
        console.log(
          `  -> ${res.statusCode} to ${same ? 'the same path' : next.origin + next.pathname}` +
            `, query ${next.search ? 'kept' : 'DROPPED'}` +
            `, cookies now ${jar.size}`,
        );
        // Keep the query when the server drops it on a same-path redirect.
        if (same && !next.search && u.search) next.search = u.search;
        resolve(getJson(next.toString(), timeoutMs, hops - 1, jar));
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(Object.assign(new Error(`HTTP ${res.statusCode}`), { status: res.statusCode }));
        return;
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          // "not JSON" names the symptom and hides the cause. What comes back
          // instead is usually an HTML page saying something useful — a
          // rejected key, a blocked client, maintenance — and that sentence
          // is worth more than ten more attempts.
          const peek = body
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 300);
          const err = Object.assign(new Error('response was not JSON'), { notJson: true });
          err.peek = `${res.headers['content-type'] ?? 'no content-type'} | ${body.length}B | ${peek || '(empty body)'}`;
          reject(err);
        }
      });
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error('timed out')));
    req.on('error', reject);
  });
}

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
  let body;
  try {
    body = await getJson(url, 20_000);
  } catch (e) {
    // The reason lives on e.code for a TLS or socket failure and on e.status
    // for an HTTP one. Without it, a host that cannot be reached at all reads
    // in the log exactly like a quiet holiday.
    const why = e.code ?? e.cause?.code ?? e.message;
    console.warn(`  ${ymd}: request failed — ${why}`);
    if (e.notJson) {
      // Redact the key before anything from the wire reaches the log.
      console.warn(`     ${String(e.peek).split(key).join('***')}`);
      return null;
    }
    return { stop: `cannot reach ${new URL(ENDPOINT).host} (${why})` };
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
