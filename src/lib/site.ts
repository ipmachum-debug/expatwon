export const SITE_TITLE = 'ExpatWon';
export const SITE_URL = 'https://expatwon.com';
export const SITE_DESCRIPTION =
  'Practical money guides for expats in Korea: bank accounts, loans, cars, business registration, insurance, and cost of living.';

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
