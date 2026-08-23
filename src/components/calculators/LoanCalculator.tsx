import { useState } from 'react';

import {
  cardClass,
  fmtKrw,
  fmtUsd,
  inputClass,
  labelClass,
  resultRowClass,
} from './shared';

function amortize(principal: number, annualRatePct: number, months: number) {
  if (principal <= 0 || months <= 0) return { monthly: 0, totalInterest: 0, totalPaid: 0 };
  const r = annualRatePct / 100 / 12;
  const monthly =
    r === 0 ? principal / months : (principal * r) / (1 - Math.pow(1 + r, -months));
  const totalPaid = monthly * months;
  return { monthly, totalInterest: totalPaid - principal, totalPaid };
}

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState(30_000_000);
  const [rate, setRate] = useState(5.5);
  const [months, setMonths] = useState(36);

  const base = amortize(principal, rate, months);
  const higher = amortize(principal, rate + 1, months);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Loan terms</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              Principal <span className="text-slate-400">(KRW)</span>
            </label>
            <input
              type="number"
              min={0}
              step={1000000}
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value) || 0))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Annual interest rate <span className="text-slate-400">(%)</span>
            </label>
            <input
              type="number"
              min={0}
              max={30}
              step={0.1}
              value={rate}
              onChange={(e) =>
                setRate(Math.min(30, Math.max(0, Number(e.target.value) || 0)))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              Term <span className="text-slate-400">(months)</span>
            </label>
            <input
              type="number"
              min={1}
              step={12}
              value={months}
              onChange={(e) => setMonths(Math.max(1, Number(e.target.value) || 1))}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Repayment</h2>
        <dl>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Monthly payment</dt>
            <dd className="font-semibold text-slate-900">
              {fmtKrw(base.monthly)}{' '}
              <span className="font-normal text-slate-400">≈ {fmtUsd(base.monthly)}</span>
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Total interest</dt>
            <dd className="font-semibold text-slate-900">
              {fmtKrw(base.totalInterest)}{' '}
              <span className="font-normal text-slate-400">
                ≈ {fmtUsd(base.totalInterest)}
              </span>
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Total repaid</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(base.totalPaid)}</dd>
          </div>
        </dl>

        <h3 className="mt-6 mb-2 text-sm font-bold text-slate-900">
          If your rate were 1%p higher ({(rate + 1).toFixed(1)}%)
        </h3>
        <dl>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Monthly payment</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(higher.monthly)}</dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Extra interest over the term</dt>
            <dd className="font-semibold text-rose-600">
              +{fmtKrw(higher.totalInterest - base.totalInterest)}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-slate-500">
          Equal monthly installment (원리금균등) formula. Actual bank quotes may
          differ slightly and may add fees or early-repayment charges.
        </p>
      </div>
    </div>
  );
}
