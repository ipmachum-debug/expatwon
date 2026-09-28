/**
 * Visa-free entry to Korea — a condition checker, not an eligibility promise.
 *
 * Two things make this file different from an ordinary lookup table.
 *
 * 1. NOTHING IS ASSERTED THAT HAS NOT BEEN READ AT SOURCE. A country produces
 *    a yes or a no only when a `CountryRule` for it exists, and a rule cannot
 *    be constructed without a source and the date it was read. A nationality
 *    with no row resolves to `check-required` and the reader is sent to the
 *    official page — that is the correct behaviour, not a gap to be filled by
 *    guessing, because a wrong yes here is not a wrong sentence in a guide, it
 *    is somebody refused at a boarding gate.
 *
 *    And the two questions the reader arrives with are answered separately.
 *    `verdict` is about visa-free scope; K-ETA is its own outcome with its own
 *    evidence. Folding them together made one report the other's uncertainty,
 *    which is how a settled three-month allowance came back as "check needed".
 *
 * 2. THE VERDICT IS ABOUT SCOPE, NEVER ABOUT ADMISSION. An immigration officer
 *    decides admission at the counter; no table can. So the language is "you
 *    are in scope for visa-free entry", and there is no wording anywhere in
 *    this file that promises entry. Same rule the loan tool runs on: no odds,
 *    no scoring, no "you are likely to be approved".
 *
 * Scope of the first version, deliberately narrow: ORDINARY passports,
 * tourism, short visits and short business visits. Diplomatic and official
 * passports, employment, study, Jeju's separate scheme and transit all resolve
 * to `check-required` with a route, because each runs on a different rule set
 * and half-covering them is worse than not covering them.
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
   * Who opened the page. 'author' is the site owner; otherwise name the agent
   * or person who read it. Deliberately not a closed union: when the field
   * could only say 'author' or 'claude', a third party's reading had no
   * truthful value to enter, and a schema that forces a wrong attribution is
   * worse than one that records an unfamiliar name.
   */
  verifiedBy: string;
  source: Source;
}

/* ---------------------------------------------------------------------------
 * What the reader tells us. Kept short — every extra field is a reader who
 * abandons the form.
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
  /** Only asked when the chosen country has more than one category. */
  nationalityCategory?: string;
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

/**
 * K-ETA's answer, kept in its own object rather than flattened into the result.
 *
 * It is a different question from "may I enter without a visa", and one shared
 * verdict answered both wrongly: a Malaysian on a ten-day holiday is inside the
 * three-month visa-free allowance — settled — while K-ETA still turns on their
 * age. Reporting "additional check needed" for the whole trip misdescribed the
 * part that was decided. So: two blocks, each with its own reasons and its own
 * evidence, and the page renders them separately.
 */
export interface KetaOutcome {
  status: KetaStatus;
  /** false = not required for this trip · null = it turns on you, not the passport. */
  needed: boolean | null;
  reasons: string[];
  basis: Verified[];
  officialCheck: Source;
}

export interface CheckerResult {
  /**
   * VISA-FREE SCOPE ONLY. Not a summary of everything below — K-ETA has its
   * own verdict in `keta`, and a settled 'in-scope' here never means there is
   * nothing left to do.
   */
  verdict: Verdict;
  /** Why, in the reader's own terms. Always populated. */
  reasons: string[];
  /** Days permitted, when a verified rule says so. */
  stayDays?: number;
  /** Present once a country rule resolved. Its own question, its own answer. */
  keta?: KetaOutcome;
  arrivalCardNeeded?: boolean | null;
  /**
   * Set when the nationality splits into passport categories and the reader
   * has not said which is theirs. The form asks rather than picking one.
   */
  categoryChoice?: { code: string; options: { value: string; label: string }[] };
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
 * The official lists name three things, not two: a treaty, reciprocity, and a
 * unilateral exemption. Reciprocity and unilateral exemption are both Korea
 * extending entry outside a treaty, so both map to `designation` here — which
 * is also how HiKorea groups them.
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
 * Sources. Declared before the facts that cite them, so nothing reads a
 * binding that has not been initialised yet.
 * ------------------------------------------------------------------------- */

/** The dated blanket waiver, and the arrival-card consequence of holding one. */
export const KETA_NOTICE: Source = {
  label: 'K-ETA — Notice on extension of the temporary exemption',
  url: 'https://www.k-eta.go.kr/portal/board/viewboarddetail.do?bbsSn=299707&locale=EN',
};

/**
 * Where the permitted stay per nationality is stated, and where the British
 * passport categories are listed separately. This replaces the site root the
 * file carried while the deep link was unconfirmed.
 */
export const KETA_ELIGIBILITY_PAGE: Source = {
  label: 'K-ETA — eligible countries and permitted period of stay',
  url: 'https://www.k-eta.go.kr/portal/guide/viewetaalification.do?locale=EN',
};

/**
 * Primary source for which scheme a nationality falls under. Preferred over
 * HiKorea's equivalent page because it is current as of September 2026 and
 * states the basis per country; HiKorea's page shows a last-modified date of
 * 2024-12-30, so it is kept as a cross-check rather than the citation.
 */
export const MOFA_VISA_FREE: Source = {
  label:
    'Ministry of Foreign Affairs (0404) — visa-free entry, foreign nationals ' +
    'entering Korea',
  url: 'https://www.0404.go.kr/bbs/contsPst/MST0000000000113/13/detail',
};

/**
 * The page that separates the two schemes and enumerates the designation list
 * by name — which is what makes `basis` verifiable rather than inferred. Read
 * alongside the MOFA list rather than instead of it: this page reports a
 * last-modified date of 2024-12-30, so the MOFA list carries currency and this
 * one carries the explicit split.
 */
export const HIKOREA_VISA_FREE: Source = {
  label:
    'HiKorea — visa exemption agreement countries and visa-free entry by ' +
    'designation (page last modified 2024-12-30)',
  url: 'https://www.hikorea.go.kr/info/InfoDatail.pt?CAT_SEQ=161&PARENT_ID=135',
};

/**
 * The 2023 Ministry of Justice announcement that NAMES the countries inside the
 * temporary K-ETA exemption — 22 of them. The 2026 extension notice does not
 * re-list them; it extends "the countries and regions currently covered". So
 * membership and end date come from two pages, and a row claiming the exemption
 * has to cite both. Without this page, "is my country inside the waiver?" was
 * unanswerable from the extension notice alone.
 */
export const MOJ_TEMP_EXEMPTION_LIST: Source = {
  label:
    'Ministry of Justice — countries and regions under the temporary K-ETA ' +
    'exemption (2023 announcement, 22 listed)',
  url: 'https://www.immigration.go.kr/bbs/immigration/489/569087/artclView.do',
};

/** The Ministry's own K-ETA page, where the personal exemptions are stated. */
export const MOJ_KETA: Source = {
  label: 'Ministry of Justice — Electronic Travel Authorization (K-ETA)',
  url: 'https://www.immigration.go.kr/immigration/3339/subview.do',
};

/* ---------------------------------------------------------------------------
 * Verified facts. This is the only place a claim may enter the checker.
 * ------------------------------------------------------------------------- */

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
  {
    id: 'keta-age-exemption',
    statement:
      'K-ETA is not required of travellers aged 17 or under, or 65 or over, ' +
      'on the date of arrival. This attaches to the traveller, not to the ' +
      'passport, which is why a nationality being inside K-ETA’s scope cannot ' +
      'be turned into "you personally must apply".',
    verifiedOn: '2026-09-28',
    verifiedBy: 'author',
    source: MOJ_KETA,
  },
  {
    id: 'keta-temporary-exemption-countries',
    statement:
      'The temporary K-ETA exemption covers 22 named countries and regions. ' +
      'The United States, Canada, Australia, Japan, Singapore and the United ' +
      'Kingdom are among them; Malaysia is not. The 2026 extension notice does ' +
      'not repeat the list, which is why membership is cited from the 2023 ' +
      'announcement and the end date from the notice.',
    verifiedOn: '2026-09-28',
    verifiedBy: 'author',
    source: MOJ_TEMP_EXEMPTION_LIST,
  },
  {
    id: 'visa-free-purposes',
    statement:
      'The purposes visa-free entry covers are travel, visiting relatives, ' +
      'attending events or conferences, and business purposes with no ' +
      'commercial activities allowed. A short business visit is therefore ' +
      'inside the scope; it is the commercial activity, not the word ' +
      '"business", that puts a trip outside it.',
    verifiedOn: '2026-09-28',
    verifiedBy: 'author',
    source: KETA_ELIGIBILITY_PAGE,
  },
];

export function fact(id: string): Verified & { id: string; statement: string } {
  const found = FACTS.find((f) => f.id === id);
  if (!found) throw new Error(`No verified fact with id "${id}"`);
  return found;
}

/** The date the exemption above stops. Arrivals after it need re-checking. */
export const KETA_EXEMPTION_ENDS = '2026-12-31';

/* ---------------------------------------------------------------------------
 * Country rules. A row may only be added from an official page that was
 * actually opened, with its URL and the date it was read.
 * ------------------------------------------------------------------------- */

/**
 * How long a visa-free stay may run. Not a number of days, because the
 * official lists do not all speak in days: some say months, and at least one
 * is a rolling window. Converting "6 months" to 180 would be inventing a
 * figure the source never gave — the K-ETA page says "06 Months", so that is
 * what this stores.
 */
export type StayAllowance =
  | { kind: 'days'; value: number }
  | { kind: 'months'; value: number }
  /** e.g. 30 continuous days, and no more than 60 within any 180. */
  | { kind: 'rolling'; continuousDays: number; maxInWindow: number; windowDays: number };

/**
 * Four things that "K-ETA" gets used for, and they are not the same thing:
 *
 *   is this nationality visa-free at all   → CountryRule.stay
 *   is it inside K-ETA's scope             → eligible
 *   is it inside the dated blanket waiver  → temporaryExemption
 *   does the person hold an exemption      → personalExemptions
 *
 * Only the first two are properties of a passport. The third is a policy with
 * an end date, and the fourth attaches to the traveller — age, an ABTC, an
 * approved K-ETA already held. The form cannot see the fourth at all, so it is
 * listed for the reader and never applied to a verdict.
 */
export interface KetaPosition {
  /** Inside K-ETA's scope. null = not established, which is not 'no'. */
  eligible: boolean | null;
  /** The dated blanket waiver, when this nationality sits inside it. */
  temporaryExemption?: { until: string };
  /** Named for the reader to check. Never used to decide anything here. */
  personalExemptions: string[];
}

export interface CountryRule {
  /** ISO 3166-1 alpha-2. */
  code: string;
  name: string;
  /**
   * A nationality can split into passport categories that get different
   * allowances — the United Kingdom splits six ways, and alpha-2 cannot tell
   * them apart. 'default' when a country does not split; when it does, the
   * reader is asked which one is theirs rather than being handed the wrong
   * row. This is a nationality category, not the document kind (ordinary vs
   * diplomatic) already asked for separately.
   */
  category: string;
  /** Shown to the reader when a country splits. */
  categoryLabel?: string;
  /**
   * Which of the two schemes this falls under. Explanatory: no verdict reads
   * it, which is why it stays optional — requiring it would block rows whose
   * day counts were verified from a page that does not state the basis.
   */
  basis?: EntryBasis['id'];
  /** What an ordinary passport holder gets for tourism or a short visit. */
  stay: StayAllowance;
  keta: KetaPosition;
  /**
   * More than one page, because a row rests on more than one reading: the
   * permitted stay comes from the K-ETA eligibility page, the scheme from the
   * MOFA list. Both are pushed into the result's basis so the reader sees
   * exactly what each part of the answer came from.
   */
  verified: Verified[];
}

/* Read by the author on 2026-09-28 at the two pages named above. */
const STAY_READ: Verified = {
  verifiedOn: '2026-09-28',
  verifiedBy: 'author',
  source: KETA_ELIGIBILITY_PAGE,
};

const BASIS_READ: Verified = {
  verifiedOn: '2026-09-28',
  verifiedBy: 'author',
  source: MOFA_VISA_FREE,
};

const BASIS_SPLIT_READ: Verified = {
  verifiedOn: '2026-09-28',
  verifiedBy: 'author',
  source: HIKOREA_VISA_FREE,
};

const READ = [STAY_READ, BASIS_READ, BASIS_SPLIT_READ];

/**
 * Exemptions that attach to the traveller rather than the passport. Listed for
 * the reader, never applied: the form does not ask anyone's age, and guessing
 * would turn "K-ETA is normally required for your nationality" into a personal
 * instruction that may be wrong in either direction.
 */
const PERSONAL_EXEMPTIONS = [
  'aged 17 or under on the date of arrival',
  'aged 65 or over on the date of arrival',
];

/**
 * A flat status for the UI to render, derived from KetaPosition — never stored,
 * because a stored enum loses the end date and the end date is the whole point.
 *
 * 'required' is deliberately not a member. A nationality being inside K-ETA's
 * scope is a fact about a passport; "you must apply" is a fact about a
 * traveller, and the personal exemptions above mean this form cannot get from
 * the first to the second. That case is 'personal-check'.
 */
export type KetaStatus =
  /** Inside the dated blanket waiver, and the arrival falls within it. */
  | 'temporarily-exempt'
  /** K-ETA's scope does not reach this nationality at all. */
  | 'not-applicable'
  /** In scope, no waiver — so it turns on the traveller, not the passport. */
  | 'personal-check'
  /** Not read at source, which is not the same as 'no'. */
  | 'unestablished';

/** Inside the dated blanket waiver — see FACTS[0]. */
const TEMP_EXEMPT: KetaPosition = {
  eligible: true,
  temporaryExemption: { until: KETA_EXEMPTION_ENDS },
  personalExemptions: PERSONAL_EXEMPTIONS,
};

/**
 * Seven nationalities, read at source on 2026-09-28.
 *
 * Six of the seven sit inside the temporary K-ETA exemption. Malaysia does
 * not, so its row carries the scope position alone — and that row cannot reach
 * a clean yes here, by design: being inside K-ETA's scope is a fact about the
 * passport, whereas "you must apply" is a fact about the traveller, and the
 * age exemptions above mean the two are not the same sentence.
 *
 * The United Kingdom is six rows, not one. The K-ETA list gives British
 * Citizen 90 days and the other British passport categories 30 days, and an
 * alpha-2 code cannot tell them apart — so the reader is asked which is
 * theirs instead of being handed the majority answer.
 */
export const COUNTRY_RULES: CountryRule[] = [
  {
    code: 'US',
    name: 'United States',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
  {
    code: 'JP',
    name: 'Japan',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
  {
    code: 'SG',
    name: 'Singapore',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
  {
    code: 'AU',
    name: 'Australia',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
  {
    // Months, not 180 days. Six months from 15 March is 15 September.
    code: 'CA',
    name: 'Canada',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'months', value: 6 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
  {
    // Not inside the temporary exemption, unlike the other six.
    code: 'MY',
    name: 'Malaysia',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'months', value: 3 },
    keta: { eligible: true, personalExemptions: PERSONAL_EXEMPTIONS },
    verified: READ,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    category: 'british-citizen',
    categoryLabel: 'British Citizen',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    category: 'british-dependent-territories-citizen',
    categoryLabel: 'British Dependent Territories Citizen',
    basis: 'agreement',
    stay: { kind: 'days', value: 30 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    category: 'british-national-overseas',
    categoryLabel: 'British National (Overseas)',
    basis: 'agreement',
    stay: { kind: 'days', value: 30 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    category: 'british-overseas-citizen',
    categoryLabel: 'British Overseas Citizen',
    basis: 'agreement',
    stay: { kind: 'days', value: 30 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    category: 'british-protected-person',
    categoryLabel: 'British Protected Person',
    basis: 'agreement',
    stay: { kind: 'days', value: 30 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    category: 'british-subject',
    categoryLabel: 'British Subject',
    basis: 'agreement',
    stay: { kind: 'days', value: 30 },
    keta: TEMP_EXEMPT,
    verified: READ,
  },
];

/** Every row for a nationality — more than one when its passport splits. */
export function rulesFor(code: string): CountryRule[] {
  return COUNTRY_RULES.filter((r) => r.code === code);
}

/** The choices to put in front of the reader when a nationality splits. */
export function categoryOptions(code: string): { value: string; label: string }[] {
  return rulesFor(code).map((r) => ({
    value: r.category,
    label: r.categoryLabel ?? r.name,
  }));
}

/** Nationalities the checker can resolve, for the country select. */
export function supportedCountries(): { code: string; name: string }[] {
  const seen = new Map<string, string>();
  for (const r of COUNTRY_RULES) if (!seen.has(r.code)) seen.set(r.code, r.name);
  return [...seen].map(([code, name]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name));
}

/* ---------------------------------------------------------------------------
 * The assessment. Order matters: scope gates run before any lookup, so an
 * out-of-scope reader is routed rather than judged on data we do not have.
 * ------------------------------------------------------------------------- */

const OFFICIAL_CHECK: Source = KETA_ELIGIBILITY_PAGE;

/**
 * Turn an allowance into a day limit against a specific arrival date.
 *
 * Months are resolved by date arithmetic, not by assuming 30 days: three
 * months from 15 March is 15 June, and that is a different number of days
 * depending on when you go. A rolling allowance returns its continuous limit
 * and flags that the window itself cannot be settled from this form.
 */
export function resolveStay(
  stay: StayAllowance,
  arrivalDate: string,
): { limitDays: number; label: string; needsTravelHistory: boolean } {
  if (stay.kind === 'days') {
    return { limitDays: stay.value, label: `${stay.value} days`, needsTravelHistory: false };
  }
  if (stay.kind === 'months') {
    const from = new Date(`${arrivalDate}T00:00:00Z`);
    const to = new Date(from);
    to.setUTCMonth(to.getUTCMonth() + stay.value);
    const limitDays = Math.round((to.getTime() - from.getTime()) / 86_400_000);
    return {
      limitDays,
      label: `${stay.value} months — ${limitDays} days from ${arrivalDate}`,
      needsTravelHistory: false,
    };
  }
  return {
    limitDays: stay.continuousDays,
    label:
      `${stay.continuousDays} continuous days, and no more than ` +
      `${stay.maxInWindow} within any ${stay.windowDays}`,
    needsTravelHistory: true,
  };
}

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
        'This checker covers tourism, short visits and short business visits.',
        'Coming to work or study runs on the visa for that status, applied for before you travel.',
      ],
      next: [
        { label: 'Work visas and what separates them', href: '/employment/' },
        { label: 'Studying Korean: the D-4 route', href: '/study/' },
      ],
      basis,
    };
  }

  // Anything the form cannot name is not judged. "Other" covers medical
  // treatment, transit, Jeju's separate scheme and a dozen things besides, and
  // they do not share a rule.
  if (input.purpose === 'other') {
    return {
      verdict: 'check-required',
      reasons: [
        'Visa-free entry covers specific purposes, and what you have picked is not one we will judge blind.',
        'Transit, medical treatment and Jeju each run on their own rule.',
      ],
      next: [],
      basis,
      officialCheck: OFFICIAL_CHECK,
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

  // Gate 3 — do we have a verified rule for this nationality at all?
  const candidates = rulesFor(input.country);
  if (candidates.length === 0) {
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

  // Gate 4 — the nationality splits and we have not been told which row is
  // theirs. Handing over the most common one would be handing 30-day holders a
  // 90-day answer, so the form asks.
  let rule = candidates[0];
  if (candidates.length > 1) {
    const chosen = candidates.find((r) => r.category === input.nationalityCategory);
    if (!chosen) {
      return {
        verdict: 'check-required',
        reasons: [
          `Passports issued by ${candidates[0].name} come in categories that get different allowances.`,
          'Tell us which one yours says, and we will answer for that one.',
        ],
        categoryChoice: { code: input.country, options: categoryOptions(input.country) },
        next: [],
        basis,
        officialCheck: OFFICIAL_CHECK,
      };
    }
    rule = chosen;
  }
  basis.push(...rule.verified);

  const reasons: string[] = [];

  // Length of stay. Visa-free entry is a fixed period, and overstaying it is
  // not a paperwork problem — it is the thing a visa exists for.
  const stay = resolveStay(rule.stay, input.arrivalDate);
  const who = rule.categoryLabel ? `a ${rule.categoryLabel} passport` : 'your nationality';

  if (input.days != null && input.days > stay.limitDays) {
    return {
      verdict: 'out-of-scope',
      reasons: [
        `Visa-free entry on ${who} runs to ${stay.label}.`,
        `You have entered ${input.days} days, so the stay you are planning needs a visa applied for before you travel.`,
      ],
      next: [{ label: 'Long-stay routes and what each requires', href: '/study/' }],
      basis,
      officialCheck: OFFICIAL_CHECK,
    };
  }

  reasons.push(`You are in scope for visa-free entry on ${who} for up to ${stay.label}.`);

  // The purpose boundary. A short business visit is inside visa-free entry —
  // the mistake this paragraph exists to prevent is reading "business trip" as
  // "business visa". What puts a trip outside is the commercial activity, not
  // the word.
  if (input.purpose === 'business-meeting') {
    basis.push(fact('visa-free-purposes'));
    reasons.push(
      'A short business visit is inside that scope: the purposes named are travel, ' +
        'visiting relatives, attending events or conferences, and business purposes ' +
        'with no commercial activities allowed.',
    );
    reasons.push(
      'That last clause is the line. Meetings, a conference and talks sit inside it; ' +
        'work you are paid for, service delivered on site, and taking up a posting do not, ' +
        'whatever the trip is called internally.',
    );
    next.push({ label: 'Business visits and where the line actually falls', href: '/business/' });
  }

  // The visa-free verdict is settled HERE, and nothing below changes it.
  // A rolling allowance counts earlier visits, which this form does not ask
  // for — that is the one thing that can leave the scope question open.
  let verdict: Verdict = 'in-scope';
  if (stay.needsTravelHistory) {
    verdict = 'check-required';
    reasons.push(
      'This allowance also counts your earlier visits, which this form does not ask for. Check the total against the official rule.',
    );
  }

  const keta = assessKeta(rule.keta, input.arrivalDate);
  const arrivalCardNeeded = keta.needed === false ? true : null;

  next.push(
    { label: 'Which entry filing you actually need', href: '/cost-of-living/' },
    { label: 'Paying and getting connected on arrival', href: '/banking/' },
  );

  return {
    verdict,
    reasons,
    stayDays: stay.limitDays,
    keta,
    arrivalCardNeeded,
    next,
    basis,
    officialCheck: OFFICIAL_CHECK,
  };
}

/**
 * K-ETA, on its own. A separate function because it is a separate question
 * from whether the reader may enter without a visa, and folding the two into
 * one verdict got them wrong: a Malaysian on a ten-day holiday is inside the
 * three-month visa-free allowance — that part is settled — while K-ETA still
 * turns on their age. One combined verdict had to report "additional check
 * needed" for the whole trip, which told them the wrong thing about the part
 * that was decided.
 *
 * Four questions in the order that keeps them apart. The dated waiver goes
 * first, because it is the reason the form asks for an arrival date at all.
 */
export function assessKeta(position: KetaPosition, arrivalDate: string): KetaOutcome {
  const reasons: string[] = [];
  const basis: Verified[] = [];
  const exemptUntil = position.temporaryExemption?.until;
  let needed: boolean | null;
  let status: KetaStatus;

  if (exemptUntil && arrivalDate && arrivalDate > exemptUntil) {
    // Verified through a date, and the trip is past it. An expired reading is
    // not evidence of anything, so it does not carry forward as a "no".
    needed = null;
    status = 'unestablished';
    basis.push(fact('keta-temporary-exemption-through-2026'));
    reasons.push(
      `The temporary exemption we verified runs to ${exemptUntil}, and you arrive after that. ` +
        'Check K-ETA again nearer the date — an exemption with an end date is not a standing rule.',
    );
  } else if (exemptUntil) {
    needed = false;
    status = 'temporarily-exempt';
    // Two pages, because membership and the end date are stated in different
    // places: the 2023 announcement names the countries, the 2026 notice
    // extends them. Either alone leaves the reader a step short.
    basis.push(fact('keta-temporary-exemption-countries'));
    basis.push(fact('keta-temporary-exemption-through-2026'));
    reasons.push(
      `Your nationality is one of the 22 inside the temporary exemption, which runs to ${exemptUntil}, so K-ETA is not required for this trip.`,
    );
    // The part almost everyone misses: exempt does not mean there is nothing
    // to gain from applying.
    basis.push(fact('keta-voluntary-application-arrival-card'));
    reasons.push(
      'You may still apply and pay for one. An approved K-ETA exempts you from submitting the arrival card — approval, not the application, is what carries it.',
    );
  } else if (position.eligible === true) {
    // In scope is a fact about the passport. "You must apply" is a fact about
    // the traveller, and this form never sees the traveller.
    needed = null;
    status = 'personal-check';
    basis.push(fact('keta-temporary-exemption-countries'));
    basis.push(fact('keta-age-exemption'));
    reasons.push(
      'Your nationality is inside K-ETA’s scope and is not one of the 22 inside the temporary exemption, so K-ETA normally applies to this trip.',
    );
    reasons.push(
      'We stop short of telling you to apply, because the exemptions attach to the traveller rather than the passport and this form does not ask your age.',
    );
  } else if (position.eligible === false) {
    needed = false;
    status = 'not-applicable';
    reasons.push('K-ETA does not apply to your nationality.');
  } else {
    needed = null;
    status = 'unestablished';
    reasons.push(
      'Whether K-ETA applies to you has not been established here. Check it on the official page before you book.',
    );
  }

  if (needed !== false && position.personalExemptions.length > 0) {
    reasons.push(`Exemptions to check against yourself: ${position.personalExemptions.join('; ')}.`);
  }

  return { status, needed, reasons, basis, officialCheck: KETA_ELIGIBILITY_PAGE };
}
