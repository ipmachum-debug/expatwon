import { KRW_PER_USD } from '../../lib/site';

export function fmtKrw(n: number): string {
  return `₩${Math.round(n).toLocaleString('en-US')}`;
}

export function fmtUsd(krwAmount: number): string {
  return `$${Math.round(krwAmount / KRW_PER_USD).toLocaleString('en-US')}`;
}

export const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none';
export const labelClass = 'mb-1 block text-sm font-medium text-slate-700';
export const cardClass = 'rounded-lg border border-slate-200 bg-white p-5';
export const resultRowClass =
  'flex items-baseline justify-between gap-4 border-b border-slate-100 py-2 text-sm';
