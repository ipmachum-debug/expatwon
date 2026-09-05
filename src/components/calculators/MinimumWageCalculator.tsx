import { useState } from 'react';

import {
  cardClass,
  fmtKrw,
  inputClass,
  labelClass,
  resultRowClass,
} from './shared';

/** 2026 statutory minimum wage — see /tracked/minimum-wage/. */
const MIN_WAGE_2026 = 10_320;
/** (52.14 weeks / 12 months) — the average number of weeks in a month. */
const WEEKS_PER_MONTH = 52.14 / 12;
/** Below this four-week average, the paid weekly holiday does not apply. */
const THRESHOLD_HOURS = 15;

function compute(weeklyHours: number, hourlyRate: number) {
  const entitled = weeklyHours >= THRESHOLD_HOURS;
  // Weekly holiday hours scale with contractual hours, capped at the
  // full-time 8: hours / 40 * 8.
  const holidayHours = entitled ? Math.min(weeklyHours / 40, 1) * 8 : 0;
  const paidWeeklyHours = weeklyHours + holidayHours;
  // Rounded to the nearest whole hour, as the official monthly conversion is:
  // (40 + 8) x 4.345 = 208.56, published as 209.
  const monthlyHours = Math.round(paidWeeklyHours * WEEKS_PER_MONTH);
  return {
    entitled,
    holidayHours,
    paidWeeklyHours,
    holidayPay: holidayHours * hourlyRate,
    weeklyPay: paidWeeklyHours * hourlyRate,
    monthlyHours,
    monthlyPay: monthlyHours * hourlyRate,
  };
}

export default function MinimumWageCalculator() {
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [hourlyRate, setHourlyRate] = useState(MIN_WAGE_2026);
  const [monthlySalary, setMonthlySalary] = useState(2_200_000);

  const r = compute(weeklyHours, hourlyRate);

  // The reverse test: a monthly salary divided by the same conversion hours.
  const effectiveHourly = r.monthlyHours > 0 ? monthlySalary / r.monthlyHours : 0;
  const clears = effectiveHourly >= MIN_WAGE_2026;
  const shortfall = (MIN_WAGE_2026 - effectiveHourly) * r.monthlyHours;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">
          Your contract
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              Contractual working hours{' '}
              <span className="text-slate-400">(per week)</span>
            </label>
            <input
              type="number"
              min={0}
              max={52}
              step={1}
              value={weeklyHours}
              onChange={(e) =>
                setWeeklyHours(Math.min(52, Math.max(0, Number(e.target.value) || 0)))
              }
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              The hours in your contract, not the hours a particular week
              happened to produce.
            </p>
          </div>
          <div>
            <label className={labelClass}>
              Hourly rate <span className="text-slate-400">(KRW)</span>
            </label>
            <input
              type="number"
              min={0}
              step={10}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value) || 0))}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              2026 statutory minimum: ₩{MIN_WAGE_2026.toLocaleString('en-US')}.
            </p>
          </div>
          <div>
            <label className={labelClass}>
              Monthly salary to test{' '}
              <span className="text-slate-400">(KRW, optional)</span>
            </label>
            <input
              type="number"
              min={0}
              step={10000}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Math.max(0, Number(e.target.value) || 0))}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">
          Paid hours and lawful minimum
        </h2>

        {!r.entitled && weeklyHours > 0 && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Below a four-week average of {THRESHOLD_HOURS} hours a week, the paid
            weekly holiday does not apply — so no weekly holiday hours are added.
          </div>
        )}

        <dl>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Weekly holiday hours</dt>
            <dd className="font-semibold text-slate-900">
              {r.holidayHours.toFixed(1)} h
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Weekly holiday pay</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(r.holidayPay)}</dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Paid hours a week</dt>
            <dd className="font-semibold text-slate-900">
              {r.paidWeeklyHours.toFixed(1)} h
              <span className="font-normal text-slate-400">
                {' '}
                ({weeklyHours} worked)
              </span>
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Monthly conversion hours</dt>
            <dd className="font-semibold text-slate-900">
              {r.monthlyHours} h
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="font-medium text-slate-800">Lawful monthly minimum</dt>
            <dd className="font-bold text-slate-900">{fmtKrw(r.monthlyPay)}</dd>
          </div>
        </dl>

        <h3 className="mt-6 mb-2 text-sm font-bold text-slate-900">
          Testing a monthly salary
        </h3>
        <dl>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Effective hourly rate</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(effectiveHourly)}</dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Against the 2026 minimum</dt>
            <dd className={clears ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-600'}>
              {clears ? 'Clears it' : `Short by ${fmtKrw(shortfall)} a month`}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-slate-500">
          Monthly conversion hours are rounded to the nearest whole hour, as the
          official notice does — 48 x 4.345 = 208.56, published as 209. A monthly
          salary is tested by dividing by the conversion hours above,
          not by hours actually worked. This model assumes no overtime, night or
          holiday premiums and no allowances excluded from the minimum wage
          comparison; a real check needs the contract and the payslip.
        </p>
      </div>
    </div>
  );
}
