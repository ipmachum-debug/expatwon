/**
 * Which of the calendar's situations the reader has said apply to them.
 *
 * The site has no accounts and no backend, so this lives in the reader's own
 * browser and never leaves it. That is a deliberate ceiling: it means the
 * choice does not follow them to another device, and it can come back empty on
 * any visit. Every caller has to render correctly without it.
 *
 * Storage access itself can throw, not just return null — a private window,
 * blocked site data, or a preview screenshot. So both ends are wrapped, and a
 * failure is treated as "nothing stored" rather than surfaced to the reader.
 */
import type { Audience } from '../data/calendar';

const KEY = 'expatwon:audience';

const VALID: readonly Audience[] = [
  'employee',
  'freelancer',
  'business',
  'car',
  'property',
];

/** Stored ids, filtered against the current set — an id removed from the
 *  calendar in a later build must not resurrect from an old browser. */
export function readAudience(): Audience[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return VALID.filter((id) => parsed.includes(id));
  } catch {
    return [];
  }
}

/** An empty array clears the key rather than storing `[]`, so "never chose"
 *  and "chose everything" stay the same state — which is what the calendar's
 *  own filter already means by an empty selection. */
export function writeAudience(ids: Audience[]): void {
  try {
    const keep = VALID.filter((id) => ids.includes(id));
    if (keep.length === 0) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(keep));
  } catch {
    /* Nothing to do: the reader keeps the session they have. */
  }
}
