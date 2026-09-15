import { useEffect, useState } from 'react';

/**
 * `useState` that survives leaving the page.
 *
 * A reader working out whether to buy or rent puts twelve numbers into that
 * calculator. Coming back a week later to change one of them should not mean
 * entering the other eleven again — and the numbers are the reader's own
 * situation, which is the part of this site worth remembering.
 *
 * Kept in the reader's browser and nowhere else. No account, no backend, and
 * nothing leaves the device: these are salaries and deposits.
 *
 * Two things this deliberately does not do:
 *
 * - It never reads storage during render. The calculators are server-rendered
 *   and hydrated (`client:visible`), so a first client render that disagreed
 *   with the shipped HTML would be a hydration mismatch. The stored value
 *   arrives one frame after mount instead, which shows the defaults briefly.
 * - It never writes before it has read. Otherwise the mount pass would push
 *   the default over a stored value before that value had a chance to load.
 */
const PREFIX = 'expatwon:calc:';

/** Stored objects are merged over the defaults, key by key, and keys the
 *  defaults no longer have are dropped. Replacing wholesale would mean a row
 *  added to a calculator later reads back `undefined` — and then `NaN` all the
 *  way through the result — for every reader with an older value stored. */
function reconcile<T>(initial: T, stored: unknown): T | null {
  if (stored === null || stored === undefined) return null;

  if (
    typeof initial === 'object' &&
    initial !== null &&
    !Array.isArray(initial)
  ) {
    if (typeof stored !== 'object' || stored === null || Array.isArray(stored)) {
      return null;
    }
    const out = { ...(initial as Record<string, unknown>) };
    for (const key of Object.keys(out)) {
      const v = (stored as Record<string, unknown>)[key];
      if (typeof v === typeof out[key]) out[key] = v;
    }
    return out as T;
  }

  return typeof stored === typeof initial ? (stored as T) : null;
}

export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw !== null) {
        const next = reconcile(initial, JSON.parse(raw) as unknown);
        if (next !== null) setValue(next);
      }
    } catch {
      /* Blocked or unavailable storage: the defaults stand. */
    }
    setReady(true);
    // The key is fixed per call site and `initial` is only a fallback, so this
    // runs once per mount by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* Nothing to do: the reader keeps the session they have. */
    }
  }, [ready, key, value]);

  return [value, setValue] as const;
}
