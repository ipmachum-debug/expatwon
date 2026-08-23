export const SITE_TITLE = 'ExpatWon';
export const SITE_URL = 'https://expatwon.com';
export const SITE_DESCRIPTION =
  'Practical money guides for expats in Korea: bank accounts, loans, cars, business registration, insurance, and cost of living.';

/**
 * Manual exchange rate. Update by hand when it drifts meaningfully.
 * Used only for rough USD equivalents shown next to KRW figures.
 */
export const KRW_PER_USD = 1380;
export const EXCHANGE_RATE_NOTE = `Approximate conversion at ₩${KRW_PER_USD.toLocaleString('en-US')}/USD, updated manually.`;

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
