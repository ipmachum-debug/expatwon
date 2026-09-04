/**
 * What a foreign resident can actually do, by which kind of phone line.
 *
 * This is deliberately NOT an observation series. A series records one number
 * moving over time and renders as a history; this records a state per task,
 * which is a matrix. Forcing "can this line open a bank app" into a numeric
 * series would chart a 0 against a 1 and mean nothing.
 *
 * The three states matter in a specific way. `works` and `needs-rc` are the
 * obvious pair. `alternative` is what stops the dataset overstating: almost
 * nothing in Korea is genuinely closed to someone without a verifiable line —
 * a bank counter, a hospital reception desk, a paper lease and a joint
 * certificate all still work. What breaks is the online, unattended route,
 * and it breaks repeatedly across services that look unrelated to each other.
 *
 * Adding an area: drop in `verification/<id>.json`. Picked up here with no
 * registration step; `scripts/lint-data.mjs` refuses the build on a bad shape
 * or a state outside the three.
 */

export type VerificationState = 'works' | 'needs-rc' | 'alternative';

export interface VerificationItem {
  /** The thing someone is trying to do, in their words. */
  task: string;
  state: VerificationState;
  /** Why it lands there. One or two sentences. */
  note: string;
}

export interface VerificationArea {
  id: string;
  /** Heading for the group, e.g. "Banking". */
  area: string;
  /** One line that survives on its own in a table caption. */
  summary: string;
  items: VerificationItem[];
  /** Who says so. An unsourced claim about what a service permits rots fast. */
  source: string;
}

export const VERIFICATION_STATES: Record<VerificationState, { label: string; blurb: string }> = {
  works: {
    label: 'Works',
    blurb: 'Available on a passport-opened line',
  },
  'needs-rc': {
    label: 'Needs the card',
    blurb: 'Needs a line registered against your alien registration card',
  },
  alternative: {
    label: 'Another way in',
    blurb: 'Blocked on the mobile route, but another path exists',
  },
};

const files = import.meta.glob<{ default: VerificationArea }>('./verification/*.json', {
  eager: true,
});

export const VERIFICATION: VerificationArea[] = Object.values(files)
  .map((m) => m.default)
  .sort((a, b) => a.area.localeCompare(b.area, 'en'));

export function countByState(state: VerificationState): number {
  return VERIFICATION.reduce(
    (n, area) => n + area.items.filter((i) => i.state === state).length,
    0,
  );
}
