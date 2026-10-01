/**
 * Exchange rates, read once and shared.
 *
 * The file this reads is written by scripts/sync-exchange-rates.mjs on a
 * schedule and committed. Nothing fetches at runtime: the site is static, the
 * API needs a key, and a key that reaches the browser is a leaked key. So the
 * rate is as fresh as the last sync and the page says so rather than implying
 * otherwise.
 *
 * Three rules this module exists to enforce, in one place, for every surface
 * that shows a rate:
 *
 *   1. A rate is shown with the date it was quoted on. Never bare.
 *   2. A rate older than MAX_AGE_DAYS is not shown at all. A card labelled
 *      LIVE that is quietly three weeks stale is worse than no card — it is
 *      the one failure mode where being silent beats being wrong.
 *   3. This is the published reference rate (매매기준율). It is not what a
 *      bank gives you. Every surface says that, because a reader comparing
 *      this against their own transfer and finding a gap should understand
 *      why before they conclude the site is wrong.
 *
 * Seeded empty on purpose. Until the first sync runs with a key, every
 * consumer gets null and renders nothing — no invented numbers ship, and the
 * build does not depend on the feed being up.
 */
import raw from '../data/live/exchange-rates.json';

/** Beyond this, the feed is treated as down rather than merely quiet. */
export const MAX_AGE_DAYS = 10;

export interface Rate {
  /** Won per `per` units of the currency. */
  krw: number;
  /** Quote unit. Eximbank quotes JPY and some others per 100, not per 1. */
  per: number;
  /** The currency's name as the source gives it. */
  name: string;
}

export interface ExchangeRates {
  /** The date the rates were quoted on (고시일), YYYY-MM-DD. */
  quotedOn: string;
  /** When the sync last wrote the file. */
  fetchedAt: string;
  source: { label: string; url: string };
  rates: Record<string, Rate>;
  /** Whole days between quotedOn and today. 0 on the day it was quoted. */
  ageDays: number;
}

/**
 * What the homepage card shows, in this order. Chosen from the content:
 * USD appears in 115 places across the guides, and the corridors with their
 * own guides are the US and China. EUR, JPY and VND follow the readership.
 *
 * A code listed here that the feed does not carry is simply absent from the
 * card. That is deliberate — it is not known ahead of time whether every one
 * of these is in the Eximbank table, and a missing currency should quietly
 * not render rather than break the build or show a zero.
 */
export const CARD_CURRENCIES = ['USD', 'EUR', 'JPY', 'VND'] as const;

const daysBetween = (from: string, to: Date): number =>
  Math.floor((to.getTime() - new Date(from + 'T00:00:00Z').getTime()) / 86_400_000);

/**
 * The rates, or null when there is nothing honest to show — never synced,
 * synced empty, or too old to call current.
 */
export function exchangeRates(now: Date = new Date()): ExchangeRates | null {
  const d = raw as {
    quotedOn: string | null;
    fetchedAt: string | null;
    source: { label: string; url: string };
    rates: Record<string, Rate>;
  };
  if (!d.quotedOn || !d.fetchedAt) return null;
  if (!d.rates || Object.keys(d.rates).length === 0) return null;

  const ageDays = daysBetween(d.quotedOn, now);
  if (ageDays > MAX_AGE_DAYS) return null;

  return { ...d, quotedOn: d.quotedOn, fetchedAt: d.fetchedAt, ageDays };
}

/** The card's currencies that the feed actually carries, in order. */
export function cardRates(now?: Date): { code: string; rate: Rate }[] {
  const d = exchangeRates(now);
  if (!d) return [];
  return CARD_CURRENCIES.filter((c) => d.rates[c]).map((c) => ({ code: c, rate: d.rates[c] }));
}

/**
 * Convert a won amount into `code`, or null when that rate is not held.
 * Here so the cost-of-living and remittance pages can reuse the same feed
 * without each one re-deriving the per-100 handling.
 */
export function fromKrw(krw: number, code: string, now?: Date): number | null {
  const d = exchangeRates(now);
  const r = d?.rates[code];
  if (!r || !r.krw) return null;
  return (krw / r.krw) * r.per;
}

/** "1 USD" / "100 JPY" — the unit the quote is actually for. */
export function quoteUnit(code: string, rate: Rate): string {
  return `${rate.per === 1 ? '1' : rate.per.toLocaleString('en-US')} ${code}`;
}
