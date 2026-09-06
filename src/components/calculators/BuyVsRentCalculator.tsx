import { useState } from 'react';

import { cardClass, fmtKrw, inputClass, labelClass, resultRowClass } from './shared';

const MAX_YEARS = 30;
/** Monthly rent tax credit: capped rent base, and the rate at the higher band. */
const RENT_CREDIT_RENT_CAP = 10_000_000;

type Mode = 'jeonse' | 'wolse';

interface YearRow {
  year: number;
  buy: number;
  rent: number;
}

/**
 * Both sides are accumulated as *economic cost*, discounted to today.
 *
 * The symmetry that makes or breaks this comparison: equity tied up in a
 * purchase and equity tied up in a deposit both cost the return they are not
 * earning. Skip either one and the model is biased before any assumption about
 * house prices is made. Loan principal repayment is deliberately absent from
 * both sides — it converts cash into equity rather than consuming it, and it is
 * captured instead through the sale proceeds at the end.
 */
function project(input: {
  price: number;
  equity: number;
  acquisitionPct: number;
  loanRate: number;
  holdingCost: number;
  maintenance: number;
  sellingPct: number;
  growth: number;
  altReturn: number;
  mode: Mode;
  deposit: number;
  monthlyRent: number;
  depositLoan: number;
  depositLoanRate: number;
  rentCreditRate: number;
}): YearRow[] {
  const {
    price,
    equity,
    acquisitionPct,
    loanRate,
    holdingCost,
    maintenance,
    sellingPct,
    growth,
    altReturn,
    mode,
    deposit,
    monthlyRent,
    depositLoan,
    depositLoanRate,
    rentCreditRate,
  } = input;

  const g = growth / 100;
  const r = altReturn / 100;
  const mortgage = Math.max(0, price - equity);
  const acquisitionCost = price * (acquisitionPct / 100);
  // Cash actually locked into the purchase on day one.
  const buyEquity = equity + acquisitionCost;

  const rentEquity = Math.max(0, deposit - depositLoan);
  const annualRent = mode === 'wolse' ? monthlyRent * 12 : 0;
  const rentCredit =
    annualRent > 0
      ? Math.min(annualRent, RENT_CREDIT_RENT_CAP) * (rentCreditRate / 100)
      : 0;

  const rows: YearRow[] = [];
  let buyRunning = acquisitionCost;
  let rentRunning = 0;

  for (let n = 1; n <= MAX_YEARS; n += 1) {
    const df = (1 + r) ** -n;

    // Owning: interest, taxes, upkeep, and the return the tied-up equity forgoes.
    const buyFlow = mortgage * (loanRate / 100) + holdingCost + maintenance + buyEquity * r;
    buyRunning += buyFlow * df;

    // Renting: rent net of the credit, deposit-loan interest, and the return
    // the deposit's own equity forgoes.
    const rentFlow =
      annualRent - rentCredit + depositLoan * (depositLoanRate / 100) + rentEquity * r;
    rentRunning += rentFlow * df;

    // Terminal value only counts if you sell in year n, so it is applied to the
    // running total rather than accumulated.
    const sale = price * (1 + g) ** n;
    const netGain = sale * (1 - sellingPct / 100) - price;
    const buyTotal = buyRunning - netGain * df;

    rows.push({ year: n, buy: buyTotal, rent: rentRunning });
  }
  return rows;
}

export default function BuyVsRentCalculator() {
  const [price, setPrice] = useState(800_000_000);
  const [equity, setEquity] = useState(400_000_000);
  const [acquisitionPct, setAcquisitionPct] = useState(2.5);
  const [loanRate, setLoanRate] = useState(4.2);
  const [holdingCost, setHoldingCost] = useState(1_500_000);
  const [maintenance, setMaintenance] = useState(1_200_000);
  const [sellingPct, setSellingPct] = useState(1.0);
  const [growth, setGrowth] = useState(3.0);
  const [altReturn, setAltReturn] = useState(4.0);

  const [mode, setMode] = useState<Mode>('jeonse');
  const [deposit, setDeposit] = useState(500_000_000);
  const [monthlyRent, setMonthlyRent] = useState(1_500_000);
  const [depositLoan, setDepositLoan] = useState(0);
  const [depositLoanRate, setDepositLoanRate] = useState(3.8);
  const [rentCreditRate, setRentCreditRate] = useState(0);

  const rows = project({
    price,
    equity,
    acquisitionPct,
    loanRate,
    holdingCost,
    maintenance,
    sellingPct,
    growth,
    altReturn,
    mode,
    deposit,
    monthlyRent,
    depositLoan,
    depositLoanRate,
    rentCreditRate,
  });

  const breakEven = rows.find((row) => row.buy <= row.rent);
  const at5 = rows[4];
  const at10 = rows[9];
  const mortgage = Math.max(0, price - equity);

  const num = (
    value: number,
    set: (n: number) => void,
    step: number,
    min = 0,
  ) => (
    <input
      type="number"
      min={min}
      step={step}
      value={value}
      onChange={(e) => set(Math.max(min, Number(e.target.value) || 0))}
      className={inputClass}
    />
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className={cardClass}>
          <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">
            If you buy
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                Purchase price <span className="text-slate-400">(KRW)</span>
              </label>
              {num(price, setPrice, 10_000_000)}
            </div>
            <div>
              <label className={labelClass}>
                Your own equity <span className="text-slate-400">(KRW)</span>
              </label>
              {num(equity, setEquity, 10_000_000)}
              <p className="mt-1.5 text-xs text-slate-500">
                Mortgage: {fmtKrw(mortgage)}. Principal repayment is not a cost —
                it becomes equity, and the sale figure below picks it up.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Acquisition costs <span className="text-slate-400">(% of price)</span>
                </label>
                {num(acquisitionPct, setAcquisitionPct, 0.1)}
                <p className="mt-1.5 text-xs text-slate-500">
                  Acquisition tax, surtaxes, agent, scrivener, bond loss.
                </p>
              </div>
              <div>
                <label className={labelClass}>
                  Mortgage rate <span className="text-slate-400">(% a year)</span>
                </label>
                {num(loanRate, setLoanRate, 0.1)}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Property taxes <span className="text-slate-400">(KRW a year)</span>
                </label>
                {num(holdingCost, setHoldingCost, 100_000)}
              </div>
              <div>
                <label className={labelClass}>
                  Repairs and upkeep <span className="text-slate-400">(KRW a year)</span>
                </label>
                {num(maintenance, setMaintenance, 100_000)}
                <p className="mt-1.5 text-xs text-slate-500">
                  Owner-side only, not the whole management bill.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Selling costs <span className="text-slate-400">(% of sale)</span>
                </label>
                {num(sellingPct, setSellingPct, 0.1)}
                <p className="mt-1.5 text-xs text-slate-500">
                  Agent, plus any capital gains tax you expect to owe.
                </p>
              </div>
              <div>
                <label className={labelClass}>
                  Price growth <span className="text-slate-400">(g, % a year)</span>
                </label>
                {num(growth, setGrowth, 0.1, -20)}
              </div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">
            If you rent
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Lease type</label>
              <div className="flex gap-2">
                {(['jeonse', 'wolse'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                      mode === m
                        ? 'border-blue-400 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {m === 'jeonse' ? 'Jeonse' : 'Wolse'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Deposit <span className="text-slate-400">(KRW)</span>
              </label>
              {num(deposit, setDeposit, 10_000_000)}
            </div>
            {mode === 'wolse' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Monthly rent <span className="text-slate-400">(KRW)</span>
                  </label>
                  {num(monthlyRent, setMonthlyRent, 50_000)}
                </div>
                <div>
                  <label className={labelClass}>
                    Rent tax credit <span className="text-slate-400">(%, 0 if none)</span>
                  </label>
                  {num(rentCreditRate, setRentCreditRate, 1)}
                  <p className="mt-1.5 text-xs text-slate-500">
                    17 or 15 if you qualify. Applied to ₩10,000,000 of rent at most.
                  </p>
                </div>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Deposit loan <span className="text-slate-400">(KRW)</span>
                </label>
                {num(depositLoan, setDepositLoan, 10_000_000)}
                <p className="mt-1.5 text-xs text-slate-500">
                  Own equity in the deposit: {fmtKrw(Math.max(0, deposit - depositLoan))}
                </p>
              </div>
              <div>
                <label className={labelClass}>
                  Deposit loan rate <span className="text-slate-400">(% a year)</span>
                </label>
                {num(depositLoanRate, setDepositLoanRate, 0.1)}
              </div>
            </div>
            <div>
              <label className={labelClass}>
                What your money would earn instead{' '}
                <span className="text-slate-400">(r, % a year)</span>
              </label>
              {num(altReturn, setAltReturn, 0.1)}
              <p className="mt-1.5 text-xs text-slate-500">
                Applied to tied-up equity on <strong>both</strong> sides, and used as
                the discount rate. This single figure decides most comparisons.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-5 font-display text-xl font-semibold text-slate-900">
          Break-even holding period
        </h2>

        <div
          className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
            breakEven
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          {breakEven ? (
            <>
              Buying costs less than renting from <strong>year {breakEven.year}</strong>{' '}
              onward. Below that holding period, renting is the cheaper use of the
              same capital.
            </>
          ) : (
            <>
              Renting stays cheaper for every year up to {MAX_YEARS}. On these
              assumptions the transaction and holding costs are never recovered.
            </>
          )}
        </div>

        <dl>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Cost of buying, held 5 years</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(at5.buy)}</dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Cost of renting, 5 years</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(at5.rent)}</dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Cost of buying, held 10 years</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(at10.buy)}</dd>
          </div>
          <div className={resultRowClass}>
            <dt className="text-slate-600">Cost of renting, 10 years</dt>
            <dd className="font-semibold text-slate-900">{fmtKrw(at10.rent)}</dd>
          </div>
        </dl>

        <p className="mt-5 text-xs leading-relaxed text-slate-500">
          Both figures are total economic cost in today's money, so the smaller
          number wins. The comparison is deliberately symmetrical: equity locked
          into a purchase and equity locked into a deposit are both charged the
          return they are not earning. Loan principal is not a cost on either
          side — it is recovered through the sale. Everything here follows from
          two assumptions, <strong>g</strong> and <strong>r</strong>; change them
          before trusting any result.
        </p>
      </div>
    </div>
  );
}
