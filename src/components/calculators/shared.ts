import { KRW_PER_USD } from '../../lib/site';

export function fmtKrw(n: number): string {
  return `₩${Math.round(n).toLocaleString('en-US')}`;
}

export function fmtUsd(krwAmount: number): string {
  return `$${Math.round(krwAmount / KRW_PER_USD).toLocaleString('en-US')}`;
}

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:outline-none';
export const labelClass = 'mb-1.5 block text-sm font-medium text-slate-600';
export const cardClass =
  'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7';
export const cardTitleClass =
  'mb-5 font-display text-xl font-semibold text-slate-900';
export const resultRowClass =
  'flex items-baseline justify-between gap-4 border-b border-slate-100 py-2.5 text-sm';
