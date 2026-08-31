/**
 * Layer 3 — EXPERIENCED.
 *
 * First-party evidence: what actually happened when the author went through
 * the procedure. Not "a bank may ask for additional KYC" but "these were the
 * seven documents the bank asked for in August 2026".
 *
 * This is the only layer a competitor cannot rebuild from public sources, and
 * it is the one that stays empty by default — Layer 1 writes itself from the
 * statute, Layer 2 accumulates from the monthly audit, Layer 3 exists only if
 * someone deliberately keeps the paperwork. The registry is here so that
 * "nothing collected yet" is a visible number rather than an absence nobody
 * notices.
 *
 * Adding a record: drop in `evidence/<id>.json` and put the asset under
 * `public/evidence/<cluster>/`. Redact before it leaves the machine — company
 * registration numbers, account numbers, resident registration numbers,
 * addresses, names. `redaction` must say what was removed; a record without
 * it fails the build.
 */

export interface EvidenceRecord {
  id: string;
  /**
   * `first_party` — the author's own paperwork or screen.
   * `observed`     — something seen first-hand but not the author's own.
   */
  type: 'first_party' | 'observed';
  /** When the thing happened, not when it was published. */
  date: string;
  title: string;
  /** Grouping folder: vat, corporation, payroll, bank-account, insurance… */
  cluster: string;
  /** Public path to the image or PDF. */
  asset: string;
  /** Alt text. Required — an evidence image nobody can read is not evidence. */
  alt: string;
  /** What this shows, and what a reader should take from it. */
  note: string;
  /** What was masked before publication. Required. */
  redaction: string;
  /** Observation series this evidence supports, if any. */
  supports?: string[];
}

const modules = import.meta.glob<{ default: EvidenceRecord }>('./evidence/*.json', {
  eager: true,
});

export const EVIDENCE: EvidenceRecord[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => b.date.localeCompare(a.date));

export const EVIDENCE_IDS = EVIDENCE.map((e) => e.id);

export function getEvidence(id: string): EvidenceRecord | undefined {
  return EVIDENCE.find((e) => e.id === id);
}

/**
 * The clusters worth collecting for, and whether anything has been collected.
 * Rendered on the internal status page so the gap is countable.
 */
export const EVIDENCE_CLUSTERS = [
  'bank-account',
  'vat',
  'corporation',
  'payroll',
  'insurance',
  'mortgage',
  'cars',
  'visas',
] as const;
