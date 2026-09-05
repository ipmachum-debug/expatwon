import { useState } from 'react';

import {
  cardClass,
  fmtKrw,
  inputClass,
  labelClass,
  resultRowClass,
} from './shared';

const DAY_MS = 24 * 60 * 60 * 1000;
/** Both statutory gates: one year of service, 15 contractual hours a week. */
const MIN_SERVICE_DAYS = 365;
const MIN_WEEKLY_HOURS = 15;

function parseDate(v: string): Date | null {
  const d = new Date(`${v}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Calendar days in the three months ending the day before `end`. */
function calendarDaysInPeriod(end: Date): number {
  const day = end.getDate();
  const start = new Date(end);
  // Set the day first, or a 31st rolls forward into the following month.
  start.setDate(1);
  start.setMonth(start.getMonth() - 3);
  const lastOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
  start.setDate(Math.min(day, lastOfMonth));
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}

export default function SeveranceCalculator() {
  const [startDate, setStartDate] = useState('2023-09-01');
  const [endDate, setEndDate] = useState('2026-09-01');
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [threeMonthWages, setThreeMonthWages] = useState(15_000_000);
  const [annualBonus, setAnnualBonus] = useState(0);
  const [ordinaryDaily, setOrdinaryDaily] = useState(0);

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const serviceDays =
    start && end ? Math.max(0, Math.round((end.getTime() - start.getTime()) / DAY_MS)) : 0;
  const periodDays = end ? calendarDaysInPeriod(end) : 0;

  // Regular bonuses enter as 3/12 of what was paid over the prior 12 months.
  const bonusShare = (annualBonus * 3) / 12;
  const wageTotal = threeMonthWages + bonusShare;
  const computedDaily = periodDays > 0 ? wageTotal / periodDays : 0;

  // Statutory floor: where the average wage is below the ordinary wage, the
  // ordinary wage is used as the average wage.
  const floorApplies = ordinaryDaily > 0 && ordinaryDaily > computedDaily;
  const dailyAverage = floorApplies ? ordinaryDaily : computedDaily;

  const eligible = serviceDays >= MIN_SERVICE_DAYS && weeklyHours >= MIN_WEEKLY_HOURS;
  const severance = eligible ? dailyAverage * 30 * (serviceDays / 365) : 0;

  const gateMessage = !eligible
    ? serviceDays < MIN_SERVICE_DAYS
      ? `Continuous service is ${serviceDays} days — under the one-year gate, so no statutory entitlement arises.`
      : `Contractual hours average under ${MIN_WEEKLY_HOURS} a week, so no statutory entitlement arises.`
    : null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">
          Your service and pay
        </h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Leaving date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <p className="-mt-1 text-xs text-slate-500">
            The legal leaving date, which is not always your last day in the
            office.
          </p>

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
          </div>

          <div>
            <label className={labelClass}>
              Total wages, final 3 months{' '}
              <span className="text-slate-400">(KRW)</span>
            </label>
            <input
              type="number"
              min={0}
              step={100000}
              value={threeMonthWages}
              onChange={(e) =>
                setThreeMonthWages(Math.max(0, Number(e.target.value) || 0))
              }
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              From the payslips: base pay, fixed allowances and premium pay.
              Exclude regular bonuses — they go in the next field.
            </p>
          </div>

          <div>
            <label className={labelClass}>
              Regular bonuses, prior 12 months{' '}
              <span className="text-slate-400">(KRW)</span>
            </label>
            <input
              type="number"
              min={0}
              step={100000}
              value={annualBonus}
              onChange={(e) => setAnnualBonus(Math.max(0, Number(e.target.value) || 0))}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Three twelfths of this is added to the wage total.
            </p>
          </div>

          <div>
            <label className={labelClass}>
              Ordinary wage, daily{' '}
              <span className="text-slate-400">(KRW, optional)</span>
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={ordinaryDaily}
              onChange={(e) => setOrdinaryDaily(Math.max(0, Number(e.target.value) || 0))}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Enter this if your final months included leave, unpaid time or
              reduced hours. Where the average wage falls below it, the law uses
              the ordinary wage instead.
            </p>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">
          Statutory severance
        </h2>

        {gateMessage && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {gateMessage}
          </div>
        )}

        <dl>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Continuous service</dt>
            <dd className="font-semibold text-slate-900">
              {serviceDays} days
              <span className="font-normal text-slate-400">
                {' '}
                ({(serviceDays / 365).toFixed(2)} yr)
              </span>
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Calendar days in the period</dt>
            <dd className="font-semibold text-slate-900">{periodDays} days</dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Bonus share (3/12)</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(bonusShare)}</dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Computed average wage, daily</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(computedDaily)}</dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Basis used</dt>
            <dd
              className={
                floorApplies ? 'font-semibold text-amber-700' : 'font-semibold text-slate-900'
              }
            >
              {floorApplies ? 'Ordinary wage (floor applies)' : 'Average wage'}
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="font-medium text-slate-800">Statutory severance</dt>
            <dd className="font-bold text-slate-900">{fmtKrw(severance)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-slate-500">
          Daily average wage × 30 × (service days ÷ 365). The divisor is the
          calendar days in the three-month period, not the days you worked —
          dividing by working days overstates the result by roughly half. This
          model does not apply to a defined contribution (DC) plan, where the
          entitlement is built from each year's employer contributions rather
          than from a final average wage.
        </p>
      </div>
    </div>
  );
}
