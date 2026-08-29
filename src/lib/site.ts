export const SITE_TITLE = 'ExpatWon';
export const SITE_URL = 'https://expatwon.com';
export const SITE_DESCRIPTION =
  'Practical money guides for expats in Korea: bank accounts, loans, cars, business registration, insurance, and cost of living.';

/**
 * AdSense publisher ID, e.g. 'ca-pub-1234567890123456'.
 * Empty string = no AdSense markup is emitted anywhere.
 *
 * Set this to the ID Google gives you when you start the application; it
 * makes BaseHead emit the site-verification meta tag on every page, which
 * is one of the three accepted verification methods (the others being the
 * AdSense code snippet and an ads.txt line).
 *
 * This is a PUBLIC identifier that appears in page source — it is not a
 * secret and belongs in the repo. Never put an API key or token here.
 */
export const ADSENSE_PUBLISHER_ID = '';

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
