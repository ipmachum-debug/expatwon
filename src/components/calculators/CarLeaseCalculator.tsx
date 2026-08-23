import { useState } from 'react';

import {
  cardClass,
  fmtKrw,
  fmtUsd,
  inputClass,
  labelClass,
  resultRowClass,
} from './shared';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  suffix?: string;
}

function NumberField({ label, value, onChange, step = 10000, suffix }: NumberFieldProps) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {suffix ? <span className="text-slate-400"> ({suffix})</span> : null}
      </label>
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className={inputClass}
      />
    </div>
  );
}

export default function CarLeaseCalculator() {
  const [downPayment, setDownPayment] = useState(5_000_000);
  const [deposit, setDeposit] = useState(0);
  const [monthly, setMonthly] = useState(700_000);
  const [termMonths, setTermMonths] = useState(36);
  const [residual, setResidual] = useState(15_000_000);

  const totalPayments = monthly * termMonths;
  // Deposit is refundable at lease end, so it is cash tied up, not cash spent.
  const totalIfReturned = downPayment + totalPayments;
  const totalIfPurchased = totalIfReturned + residual;
  const effectiveMonthlyReturned = termMonths > 0 ? totalIfReturned / termMonths : 0;
  const effectiveMonthlyPurchased = termMonths > 0 ? totalIfPurchased / termMonths : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">Lease terms</h2>
        <div className="space-y-4">
          <NumberField label="Down payment (선수금)" value={downPayment} onChange={setDownPayment} step={100000} suffix="KRW" />
          <NumberField label="Refundable deposit (보증금)" value={deposit} onChange={setDeposit} step={100000} suffix="KRW" />
          <NumberField label="Monthly payment (월납입금)" value={monthly} onChange={setMonthly} step={10000} suffix="KRW" />
          <NumberField label="Term (계약기간)" value={termMonths} onChange={setTermMonths} step={12} suffix="months" />
          <NumberField label="Residual / buyout value (잔존가치)" value={residual} onChange={setResidual} step={100000} suffix="KRW" />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">Total cost</h2>
        <dl>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Sum of monthly payments</dt>
            <dd className="font-semibold text-slate-900">
              {fmtKrw(totalPayments)} <span className="font-normal text-slate-400">≈ {fmtUsd(totalPayments)}</span>
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Total if you return the car</dt>
            <dd className="font-semibold text-slate-900">
              {fmtKrw(totalIfReturned)} <span className="font-normal text-slate-400">≈ {fmtUsd(totalIfReturned)}</span>
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Total if you buy it out at the end</dt>
            <dd className="font-semibold text-slate-900">
              {fmtKrw(totalIfPurchased)} <span className="font-normal text-slate-400">≈ {fmtUsd(totalIfPurchased)}</span>
            </dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Effective monthly cost (return)</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(effectiveMonthlyReturned)}</dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Effective monthly cost (buyout)</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(effectiveMonthlyPurchased)}</dd>
          </div>
          {deposit > 0 && (
            <div className={resultRowClass}>
              <dt className="text-slate-600">Deposit tied up (refunded at end)</dt>
              <dd className="font-semibold text-slate-900">{fmtKrw(deposit)}</dd>
            </div>
          )}
        </dl>
        <p className="mt-4 text-xs text-slate-500">
          Excludes insurance, fuel, and any excess-mileage or damage charges.
          The refundable deposit is not counted as a cost, but you cannot use
          that money during the lease.
        </p>
      </div>
    </div>
  );
}
