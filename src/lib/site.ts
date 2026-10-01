import { usdForConversion } from './exchangeRates';
export const SITE_TITLE = 'ExpatWon';
export const SITE_URL = 'https://expatwon.com';
/**
 * Homepage meta and og:description, and the RSS channel description.
 *
 * Kept under 80 characters: Naver's optimisation checker asks for it, and a
 * meta description is not a ranking input for Google — it only has to earn
 * the click, where a short line displays in full on mobile. Article
 * descriptions stay in the 50–155 band the content schema enforces; those are
 * written for Google's snippet and are not shortened for Naver.
 */
export const SITE_DESCRIPTION =
  'How money works in Korea, for foreigners: banking, loans, cars, tax, insurance.';

/**
 * Naver Search Advisor site-ownership token, e.g. 'a1b2c3...'.
 * Empty string = no verification meta tag is emitted.
 *
 * Naver matters far less than Google here — this site is in English and
 * Naver's traffic is overwhelmingly Korean-language — but registration is
 * free, low-risk, and Korea is where the clicks actually come from.
 *
 * A PUBLIC token that appears in page source. Not a secret.
 */
export const NAVER_SITE_VERIFICATION = '0f5ddc6a055c9066ee1771e95c18298b27128f1f';

/**
 * AdSense publisher ID, e.g. 'ca-pub-1234567890123456'.
 * Empty string = no AdSense markup is emitted anywhere.
 *
 * When set, BaseHead emits both the AdSense code snippet and the
 * google-adsense-account meta tag on every page. The snippet is the
 * verification method selected for this site, and is also the loader the
 * ad units need after approval.
 *
 * This is a PUBLIC identifier that appears in page source — it is not a
 * secret and belongs in the repo. Never put an API key or token here.
 */
export const ADSENSE_PUBLISHER_ID = 'ca-pub-6014562863132369';

/**
 * The rate behind every "≈ $X" on the site.
 *
 * It was a hand-maintained constant with a note saying to verify it before
 * launch. By 2026-10-01 it read 1380 against a market near 1356 — 1.8% out,
 * five and a half weeks stale, and two calculators were printing dollar
 * figures from it without showing a rate or a date at all.
 *
 * It now comes from the daily Eximbank sync, so it is as current as the last
 * successful one and dates itself. The constants below are the floor for a
 * repository that has never synced; once it has, they are not consulted.
 */
const FALLBACK_KRW_PER_USD = 1380;
const FALLBACK_UPDATED = '2026-08-23';
const liveUsd = usdForConversion();

export const KRW_PER_USD = liveUsd?.krw ?? FALLBACK_KRW_PER_USD;
export const KRW_PER_USD_UPDATED = liveUsd?.quotedOn ?? FALLBACK_UPDATED;
export const EXCHANGE_RATE_NOTE = `Approximate conversion at ₩${KRW_PER_USD.toLocaleString('en-US')}/USD — the Korea Eximbank reference rate quoted ${KRW_PER_USD_UPDATED}, not a rate your bank will give you.`;

export function krw(amount: number): string {
  return `₩${Math.round(amount).toLocaleString('en-US')}`;
}

export function usd(amountKrw: number): string {
  const value = amountKrw / KRW_PER_USD;
  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}
