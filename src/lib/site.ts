export const SITE_TITLE = 'ExpatWon';
export const SITE_URL = 'https://expatwon.com';
export const SITE_DESCRIPTION =
  'Practical money guides for expats in Korea: bank accounts, loans, cars, business registration, insurance, and cost of living.';

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
 * Manual exchange rate — a deliberate constant, not a live API.
 * ⚠️ Verify against the current market rate before launch and update
 * KRW_PER_USD_UPDATED whenever you change it.
 */
export const KRW_PER_USD = 1380;
export const KRW_PER_USD_UPDATED = '2026-08-23';
export const EXCHANGE_RATE_NOTE = `Approximate conversion at ₩${KRW_PER_USD.toLocaleString('en-US')}/USD (rate last updated ${KRW_PER_USD_UPDATED}).`;

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
