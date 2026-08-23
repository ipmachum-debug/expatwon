import { useState } from 'react';

import { KRW_PER_USD } from '../../lib/site';
import {
  cardClass,
  fmtKrw,
  fmtUsd,
  inputClass,
  labelClass,
  resultRowClass,
} from './shared';

const CITY_PRESETS: Record<string, { label: string; rent: number }> = {
  seoul: { label: 'Seoul', rent: 800_000 },
  busan: { label: 'Busan', rent: 550_000 },
  incheon: { label: 'Incheon / Gyeonggi', rent: 600_000 },
  other: { label: 'Other city', rent: 450_000 },
};

interface LineItem {
  key: string;
  label: string;
  hint?: string;
}

const ITEMS: LineItem[] = [
  { key: 'rent', label: 'Monthly rent (월세)', hint: 'excluding the lump-sum deposit' },
  { key: 'utilities', label: 'Utilities & building fee (공과금·관리비)' },
  { key: 'phone', label: 'Phone & internet (통신비)' },
  { key: 'food', label: 'Food & groceries (식비)' },
  { key: 'transport', label: 'Transport (교통비)' },
  { key: 'other', label: 'Everything else (기타)' },
];

const DEFAULTS: Record<string, number> = {
  rent: 800_000,
  utilities: 150_000,
  phone: 70_000,
  food: 600_000,
  transport: 80_000,
  other: 300_000,
};

export default function CostOfLivingCalculator() {
  const [city, setCity] = useState('seoul');
  const [values, setValues] = useState<Record<string, number>>(DEFAULTS);

  const setItem = (key: string, v: number) =>
    setValues((prev) => ({ ...prev, [key]: Math.max(0, v) }));

  const pickCity = (slug: string) => {
    setCity(slug);
    setItem('rent', CITY_PRESETS[slug]?.rent ?? values.rent);
  };

  const total = ITEMS.reduce((sum, item) => sum + (values[item.key] ?? 0), 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className={cardClass}>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Your monthly budget</h2>
        <div className="mb-4">
          <label className={labelClass}>City</label>
          <select
            value={city}
            onChange={(e) => pickCity(e.target.value)}
            className={inputClass}
          >
            {Object.entries(CITY_PRESETS).map(([slug, preset]) => (
              <option key={slug} value={slug}>
                {preset.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Picking a city fills a typical one-room (원룸) rent — adjust to your
            actual numbers.
          </p>
        </div>
        <div className="space-y-4">
          {ITEMS.map((item) => (
            <div key={item.key}>
              <label className={labelClass}>
                {item.label}
                {item.hint ? (
                  <span className="text-slate-400"> — {item.hint}</span>
                ) : null}
              </label>
              <input
                type="number"
                min={0}
                step={10000}
                value={values[item.key] ?? 0}
                onChange={(e) => setItem(item.key, Number(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Monthly total</h2>
        <dl>
          {ITEMS.map((item) => (
            <div key={item.key} className={resultRowClass}>
              <dt className="text-slate-600">{item.label}</dt>
              <dd className="font-medium text-slate-900">{fmtKrw(values[item.key] ?? 0)}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="font-bold text-slate-900">Total</dt>
            <dd className="text-lg font-bold text-slate-900">
              {fmtKrw(total)}{' '}
              <span className="text-sm font-normal text-slate-400">≈ {fmtUsd(total)}</span>
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-slate-500">
          USD conversion at ₩{KRW_PER_USD.toLocaleString('en-US')}/USD (manually
          updated). Korean rentals also require a lump-sum deposit (보증금) that
          is returned when you move out — it is not part of this monthly total.
        </p>
      </div>
    </div>
  );
}
