/**
 * Visa-free entry to Korea — a condition checker, not an eligibility promise.
 *
 * Two things make this file different from an ordinary lookup table.
 *
 * 1. NOTHING IS ASSERTED THAT HAS NOT BEEN READ AT SOURCE. A country produces
 *    a yes or a no only when a `CountryRule` for it exists, and a rule cannot
 *    be constructed without a `source` and a `verifiedOn`. `COUNTRY_RULES`
 *    starts empty on purpose: with no rules, every nationality resolves to
 *    `check-required` and the reader is sent to the official page. That is the
 *    correct behaviour, not a placeholder — a wrong yes here is not a wrong
 *    sentence in a guide, it is somebody refused at a boarding gate.
 *
 * 2. THE VERDICT IS ABOUT SCOPE, NEVER ABOUT ADMISSION. An immigration officer
 *    decides admission at the counter; no table can. So the language is "you
 *    are in scope for visa-free entry", and there is no wording anywhere in
 *    this file that promises entry. Same rule the loan tool runs on: no odds,
 *    no scoring, no "you are likely to be approved".
 *
 * Scope of the first version, deliberately narrow: ORDINARY passports,
 * TOURISM or SHORT VISIT. Diplomatic and official passports, employment,
 * study, Jeju's separate scheme and transit all resolve to `check-required`
 * with a route, because each runs on a different rule set and half-covering
 * them is worse than not covering them.
 */

/* ---------------------------------------------------------------------------
 * Provenance. Every claim in the checker carries one of these.
 * ------------------------------------------------------------------------- */

export interface Source {
  label: string;
  url: string;
}

export interface Verified {
  /** ISO date the page was actually opened and read. */
  verifiedOn: string;
  /**
   * Who read it. 'author' means the site owner opened the official page and
   * reported the content; 'claude' means it was fetched and read directly.
   * Recorded because the two are not the same standard of evidence.
   */
  verifiedBy: 'author' | 'claude';
  source: Source;
}

/* ---------------------------------------------------------------------------
 * What the reader tells us. Kept to five fields — every extra field is a
 * reader who abandons the form.
 * ------------------------------------------------------------------------- */

export type PassportKind = 'ordinary' | 'diplomatic-official' | 'other';
export type Purpose = 'tourism-visit' | 'business-meeting' | 'work-study' | 'other';

export interface CheckerInput {
  /** ISO 3166-1 alpha-2, or '' before a choice is made. */
  country: string;
  passport: PassportKind;
  purpose: Purpose;
  /** Nights the reader intends to stay. */
  days: number | null;
  /** ISO date of intended arrival — temporary exemptions are dated. */
  arrivalDate: string;
}

/* ---------------------------------------------------------------------------
 * What comes back. Three outcomes, and the third is the honest default.
 * ------------------------------------------------------------------------- */

export type Verdict =
  /** In scope for visa-free entry on the stated conditions. Not an admission. */
  | 'in-scope'
  /** The stated conditions put this outside visa-free entry. A visa is the route. */
  | 'out-of-scope'
  /** We will not judge this combination. Official check, with the link. */
  | 'check-required';

export interface CheckerResult {
  verdict: Verdict;
  /** Why, in the reader's own terms. Always populated. */
  reasons: string[];
  /** Days permitted, when a verified rule says so. */
  stayDays?: number;
  /** null = we do not know for this nationality, which is not the same as 'no'. */
  ketaNeeded?: boolean | null;
  arrivalCardNeeded?: boolean | null;
  /** Where to go next, in the order the reader needs it. */
  next: { label: string; href: string }[];
  /** Everything the verdict rests on. Empty means we asserted nothing. */
  basis: Verified[];
  /** Shown whenever we could not resolve it ourselves. */
  officialCheck?: Source;
}

/* ---------------------------------------------------------------------------
 * The two legal bases. Korean "visa-free" is one word covering two schemes
 * that differ in who is covered and for how long, which is why the checker
 * asks about passport kind at all.
 *
 * NOT YET VERIFIED AT SOURCE — so this array only labels the distinction for
 * the reader. No duration is stated here, and nothing in it feeds a verdict.
 * ------------------------------------------------------------------------- */

export interface EntryBasis {
  id: 'agreement' | 'designation';
  label: string;
  what: string;
}

export const ENTRY_BASES: EntryBasis[] = [
  {
    id: 'agreement',
    label: 'Visa exemption agreement',
    what:
      'A treaty between Korea and your country. What it grants can differ by ' +
      'the kind of passport you hold.',
  },
  {
    id: 'designation',
    label: 'Visa-free entry by designation',
    what:
      'Not a treaty — a permission Korea extends to nationals of countries it ' +
      'designates, for tourism and transit.',
  },
];

/* ---------------------------------------------------------------------------
 * Verified facts. This is the only place a claim may enter the checker.
 * ------------------------------------------------------------------------- */

export const KETA_NOTICE: Source = {
  label: 'K-ETA — Notice on extension of the temporary exemption',
  url: 'https://www.k-eta.go.kr/portal/board/viewboarddetail.do?bbsSn=299707&locale=EN',
};

export const FACTS: (Verified & { id: string; statement: string })[] = [
  {
    id: 'keta-temporary-exemption-through-2026',
    statement:
      'The temporary K-ETA exemption for the countries and regions already ' +
      'covered by it runs to 31 December 2026.',
    verifiedOn: '2026-09-28',
    verifiedBy: 'author',
    source: KETA_NOTICE,
  },
  {
    id: 'keta-voluntary-application-arrival-card',
    statement:
      'Someone covered by the exemption may still apply for K-ETA, for a fee. ' +
      'An APPROVED K-ETA carries an exemption from submitting the arrival ' +
      'card. Applying alone does not — the approval is what carries it.',
    verifiedOn: '2026-09-28',
    verifiedBy: 'author',
    source: KETA_NOTICE,
  },
];

/** The date the exemption above stops. Arrivals after it need re-checking. */
export const KETA_EXEMPTION_ENDS = '2026-12-31';

/* ---------------------------------------------------------------------------
 * Country rules. EMPTY UNTIL READ AT SOURCE — see the header.
 *
 * Filling one in is the whole job: a row may only be added from an official
 * page that was actually opened, with its URL and the date it was read.
 * ------------------------------------------------------------------------- */

export interface CountryRule {
  /** ISO 3166-1 alpha-2. */
  code: string;
  name: string;
  basis: EntryBasis['id'];
  /** Days granted to an ordinary passport holder for tourism or a short visit. */
  ordinaryPassportDays: number;
  /** true = K-ETA required · false = exempt · null = not established. */
  keta: boolean | null;
  verified: Verified;
}

export const COUNTRY_RULES: CountryRule[] = [];

/* ---------------------------------------------------------------------------
 * The assessment. Order matters: scope gates run before any lookup, so an
 * out-of-scope reader is routed rather than judged on data we do not have.
 * ------------------------------------------------------------------------- */

const OFFICIAL_CHECK: Source = {
  label: 'Korea Immigration Service — check your nationality',
  url: 'https://www.k-eta.go.kr/',
};

export function assess(input: CheckerInput): CheckerResult {
  const basis: Verified[] = [];
  const next: CheckerResult['next'] = [];

  // Gate 1 — purpose. Work and study are not a harder case of visa-free entry;
  // they are a different route entirely, and the checker says so rather than
  // letting a "yes" for tourism read as a yes for turning up to job-hunt.
  if (input.purpose === 'work-study') {
    return {
      verdict: 'out-of-scope',
      reasons: [
        'This checker covers tourism and short visits only.',
        'Coming to work or study runs on the visa for that status, applied for before you travel.',
      ],
      next: [
        { label: 'Work visas and what separates them', href: '/employment/' },
        { label: 'Studying Korean: the D-4 route', href: '/study/' },
      ],
      basis,
    };
  }

  // Gate 2 — passport kind. Agreements can differ by passport, so an ordinary
  // passport is the only kind this version will resolve.
  if (input.passport !== 'ordinary') {
    return {
      verdict: 'check-required',
      reasons: [
        'What an exemption agreement grants can differ by the kind of passport you hold.',
        'This version resolves ordinary passports only.',
      ],
      next: [],
      basis,
      officialCheck: OFFICIAL_CHECK,
    };
  }

  // Gate 3 — do we have a verified rule for this nationality at all? With
  // COUNTRY_RULES empty this catches everyone, which is the intended state
  // until the official lists have been read.
  const rule = COUNTRY_RULES.find((r) => r.code === input.country);
  if (!rule) {
    return {
      verdict: 'check-required',
      reasons: [
        'We have not yet confirmed this nationality against the official list, so we are not going to guess it.',
      ],
      next: [],
      basis,
      officialCheck: OFFICIAL_CHECK,
    };
  }
  basis.push(rule.verified);

  const reasons: string[] = [];

  // Length of stay. Visa-free entry is a fixed period, and overstaying it is
  // not a paperwork problem — it is the thing a visa exists for.
  if (input.days != null && input.days > rule.ordinaryPassportDays) {
    return {
      verdict: 'out-of-scope',
      reasons: [
        `Visa-free entry for your nationality runs to ${rule.ordinaryPassportDays} days.`,
        `You have entered ${input.days}, so the stay you are planning needs a visa applied for before you travel.`,
      ],
      next: [{ label: 'Long-stay routes and what each requires', href: '/study/' }],
      basis,
      officialCheck: OFFICIAL_CHECK,
    };
  }

  reasons.push(
    `Your nationality is in scope for visa-free entry for up to ${rule.ordinaryPassportDays} days on an ordinary passport.`,
  );

  // K-ETA. The dated exemption is the reason arrival date is asked for: a trip
  // after it ends cannot be answered from what we verified.
  let ketaNeeded: boolean | null = rule.keta;
  if (input.arrivalDate && input.arrivalDate > KETA_EXEMPTION_ENDS) {
    ketaNeeded = null;
    reasons.push(
      `The temporary K-ETA exemption we verified runs to ${KETA_EXEMPTION_ENDS}. Your arrival is after that, so check K-ETA again closer to the date.`,
    );
  } else if (ketaNeeded === false) {
    basis.push(FACTS[0]);
    reasons.push(
      'You are covered by the temporary K-ETA exemption, so K-ETA is not required.',
    );
    // The part almost everyone misses: exempt does not mean there is nothing
    // to gain from applying.
    basis.push(FACTS[1]);
    reasons.push(
      'You may still apply and pay for one. An approved K-ETA exempts you from submitting the arrival card — approval, not the application, is what carries it.',
    );
  }

  const arrivalCardNeeded = ketaNeeded === false ? true : null;

  next.push(
    { label: 'Which entry filing you actually need', href: '/cost-of-living/' },
    { label: 'Paying and getting connected on arrival', href: '/banking/' },
  );

  return {
    verdict: 'in-scope',
    reasons,
    stayDays: rule.ordinaryPassportDays,
    ketaNeeded,
    arrivalCardNeeded,
    next,
    basis,
    officialCheck: OFFICIAL_CHECK,
  };
}
