/**
 * Layer 2 — OBSERVED.
 *
 * One JSON file per tracked figure under `observations/`, each holding the
 * full history of that figure. Articles reference a series by key and never
 * carry the history themselves: a monthly audit appends one line to one JSON
 * file instead of rewriting the frontmatter of every article that mentions
 * the number.
 *
 * The value of a series is not its current value — that is on the article
 * anyway. It is the sequence. "The bottom corporate bracket was 9% until
 * fiscal 2026, then 10%" is not something a competitor can look up; they can
 * only see today.
 *
 * Adding a series: drop in `observations/<key>.json`. It is picked up here
 * with no registration step, and `scripts/lint-data.mjs` will refuse the
 * build if the shape is wrong or an article points at a key that is missing.
 */

export interface ObservationPoint {
  /** ISO date. When the value took effect, or when we first verified it. */
  date: string;
  /** Numeric where possible, so a series can be charted. */
  value: number;
  /** How it should read on the page, with unit and formatting. */
  display: string;
  /** Who says so. Short — the article carries the full citation. */
  source: string;
  note?: string;
}

export interface ObservationSeries {
  key: string;
  label: string;
  unit: string;
  /** `amount` money, `rate` percentage, `schedule` a bracket set. */
  type: 'amount' | 'rate' | 'schedule';
  /** How often it is worth re-checking. */
  check: 'annual' | 'quarterly' | 'monthly';
  /** Month (1–12) the change usually lands, so the audit can prioritise. */
  checkMonth?: number;
  appliesTo: string;
  /** Why this number is worth tracking at all. Shown on the history page. */
  why: string;
  /** Oldest first. */
  history: ObservationPoint[];
  /**
   * Changes already legislated but not yet in force, oldest first.
   *
   * Deliberately not part of `history`, because `latest()` reads the last
   * history entry as the current figure — a future value stored there would
   * be published as though it applied today. The national pension rate is the
   * case that forced this: its path to 2033 is already fixed in law, and it is
   * genuinely useful to show, but showing it as the current rate would be
   * wrong every year until then.
   *
   * When a scheduled date arrives, move the entry into `history`.
   * `scripts/lint-data.mjs` warns once it is past due.
   */
  scheduled?: ObservationPoint[];
}

const modules = import.meta.glob<{ default: ObservationSeries }>('./observations/*.json', {
  eager: true,
});

export const OBSERVATIONS: ObservationSeries[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.label.localeCompare(b.label));

export const OBSERVATION_KEYS = OBSERVATIONS.map((s) => s.key);

export function getSeries(key: string): ObservationSeries | undefined {
  return OBSERVATIONS.find((s) => s.key === key);
}

/** Newest point in a series. Series are stored oldest-first. */
export function latest(series: ObservationSeries): ObservationPoint {
  return series.history[series.history.length - 1];
}

/**
 * True when the figure has actually moved while we were watching — one
 * recorded point is a reading, two or more is a history. Only the second kind
 * is worth a page of its own.
 */
export function hasHistory(series: ObservationSeries): boolean {
  return series.history.length > 1;
}
