import { useState } from 'react';

import {
  cardClass,
  fmtKrw,
  inputClass,
  labelClass,
  resultRowClass,
} from './shared';

const STATUTORY_WEEKLY = 40;
const MAX_EXTENDED = 12;

/**
 * Each row is one statutory combination, at the multiple of ordinary wage the
 * Labor Standards Act produces for it. Holiday work carries its own two tiers
 * under art. 56(2); the night premium under 56(3) adds on top of either.
 */
const ROWS = [
  { key: 'extDay', label: 'Extended work, daytime', rate: 1.5 },
  { key: 'extNight', label: 'Extended work, 22:00–06:00', rate: 2.0 },
  { key: 'holDay', label: 'Holiday, within 8 hours', rate: 1.5 },
  { key: 'holNight', label: 'Holiday, within 8 hours, at night', rate: 2.0 },
  { key: 'holOverDay', label: 'Holiday, beyond 8 hours', rate: 2.0 },
  { key: 'holOverNight', label: 'Holiday, beyond 8 hours, at night', rate: 2.5 },
] as const;

type RowKey = (typeof ROWS)[number]['key'];

export default function OvertimePayCalculator() {
  const [monthlyOrdinary, setMonthlyOrdinary] = useState(3_135_000);
  const [conversionHours, setConversionHours] = useState(209);
  const [contractualWeekly, setContractualWeekly] = useState(40);
  const [hours, setHours] = useState<Record<RowKey, number>>({
    extDay: 2,
    extNight: 0,
    holDay: 0,
    holNight: 0,
    holOverDay: 0,
    holOverNight: 0,
  });

  const hourly = conversionHours > 0 ? monthlyOrdinary / conversionHours : 0;

  const lines = ROWS.map((r) => ({
    ...r,
    hours: hours[r.key],
    pay: hourly * hours[r.key] * r.rate,
  }));
  const totalPremiumPay = lines.reduce((sum, l) => sum + l.pay, 0);

  const extendedEntered = hours.extDay + hours.extNight;
  const extraHours = ROWS.reduce((sum, r) => sum + hours[r.key], 0);
  const totalWeek = contractualWeekly + extraHours;

  const overExtendedCap = extendedEntered > MAX_EXTENDED;
  const overWeeklyTotal = totalWeek > STATUTORY_WEEKLY + MAX_EXTENDED;

  const set = (key: RowKey, v: string) =>
    setHours((h) => ({ ...h, [key]: Math.max(0, Number(v) || 0) }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">
          Ordinary wage and hours
        </h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Monthly ordinary wage <span className="text-slate-400">(KRW)</span>
              </label>
              <input
                type="number"
                min={0}
                step={10000}
                value={monthlyOrdinary}
                onChange={(e) =>
                  setMonthlyOrdinary(Math.max(0, Number(e.target.value) || 0))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                Conversion hours <span className="text-slate-400">(monthly)</span>
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={conversionHours}
                onChange={(e) =>
                  setConversionHours(Math.max(1, Number(e.target.value) || 1))
                }
                className={inputClass}
              />
            </div>
          </div>
          <p className="-mt-1 text-xs text-slate-500">
            209 is the conversion for a 40-hour week with eight paid weekly
            holiday hours. It is not universal — a different contractual or paid
            holiday structure gives a different divisor, and using 209 anyway
            understates every premium below. Ordinary wage is also not base pay
            alone: allowances paid regularly and uniformly for contractual work
            can form part of it.
          </p>

          <div>
            <label className={labelClass}>
              Contractual hours this week{' '}
              <span className="text-slate-400">(excluding the rows below)</span>
            </label>
            <input
              type="number"
              min={0}
              max={52}
              step={1}
              value={contractualWeekly}
              onChange={(e) =>
                setContractualWeekly(Math.min(52, Math.max(0, Number(e.target.value) || 0)))
              }
              className={inputClass}
            />
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            {ROWS.map((r) => (
              <div key={r.key} className="flex items-center justify-between gap-4">
                <label className="text-sm text-slate-600">
                  {r.label}{' '}
                  <span className="font-mono text-xs text-slate-400">
                    {r.rate * 100}%
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={hours[r.key]}
                  onChange={(e) => set(r.key, e.target.value)}
                  className={`${inputClass} w-24 shrink-0 text-right`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">
          Premium pay, and the caps
        </h2>

        <dl>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Hourly ordinary wage</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(hourly)}</dd>
          </div>
          {lines
            .filter((l) => l.hours > 0)
            .map((l) => (
              <div key={l.key} className={resultRowClass}>
                <dt className="text-slate-600">
                  {l.label}{' '}
                  <span className="text-slate-400">
                    {l.hours}h × {l.rate * 100}%
                  </span>
                </dt>
                <dd className="font-semibold text-slate-900">{fmtKrw(l.pay)}</dd>
              </div>
            ))}
          <div className={resultRowClass}>
            <dt className="font-medium text-slate-800">Total for these hours</dt>
            <dd className="font-bold text-slate-900">{fmtKrw(totalPremiumPay)}</dd>
          </div>
        </dl>

        <h3 className="mt-6 mb-2 text-sm font-bold text-slate-900">
          Hours check, run separately
        </h3>
        <dl>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Extended hours entered</dt>
            <dd
              className={
                overExtendedCap ? 'font-semibold text-rose-600' : 'font-semibold text-slate-900'
              }
            >
              {extendedEntered} h{' '}
              <span className="font-normal text-slate-400">
                / {MAX_EXTENDED} cap
              </span>
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Total hours this week</dt>
            <dd
              className={
                overWeeklyTotal ? 'font-semibold text-rose-600' : 'font-semibold text-slate-900'
              }
            >
              {totalWeek} h{' '}
              <span className="font-normal text-slate-400">
                / {STATUTORY_WEEKLY + MAX_EXTENDED}
              </span>
            </dd>
          </div>
        </dl>

        {(overExtendedCap || overWeeklyTotal) && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            Paying these premiums in full does not cure an hours breach. The cap
            and the pay duty are separate obligations, and the cap carries a
            criminal penalty.
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Rates from art. 56: 50% for extended work, 50% for night work between
          22:00 and 06:00, and for holiday work 50% within eight hours and 100%
          beyond. Holiday work beyond eight hours is already at the higher tier —
          adding a further extended premium to it double-counts. The hours check
          is a screen against the figures you entered, not a legal
          determination; how holiday hours count toward a weekly total depends on
          how the week is defined at your workplace.
        </p>
      </div>
    </div>
  );
}
