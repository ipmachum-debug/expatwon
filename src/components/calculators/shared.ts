import { KRW_PER_USD } from '../../lib/site';

export function fmtKrw(n: number): string {
  return `₩${Math.round(n).toLocaleString('en-US')}`;
}

export function fmtUsd(krwAmount: number): string {
  return `$${Math.round(krwAmount / KRW_PER_USD).toLocaleString('en-US')}`;
}

/**
 * `text-base` below `lg` is not a style choice.
 *
 * iOS Safari zooms the page when a focused form control renders below 16px, and
 * it does not zoom back out. On a calculator that means tapping the first field
 * pushes the header off-screen and leaves the reader panning sideways through
 * the rest of the form. 14px returns at `lg`, where no touch keyboard opens.
 *
 * Applies to the `<select>` in the cost-of-living calculator too, which zooms on
 * the same rule.
 */
export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base text-slate-800 shadow-sm transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none lg:text-sm';
export const labelClass = 'mb-1.5 block text-sm font-medium text-slate-600';
export const cardClass =
  'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7';
export const cardTitleClass =
  'mb-5 font-display text-xl font-semibold text-slate-900';
export const resultRowClass =
  'flex items-baseline justify-between gap-4 border-b border-slate-100 py-2.5 text-sm';
