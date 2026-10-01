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

/**
 * WHAT YOU ENTER ON, not what you own.
 *
 * This replaced a list of documents held, and the reason is the exception that
 * broke the old model: a traveller with both an approved K-ETA and a Korean
 * visa is excluded from the declaration by one and required to file by the
 * other. Possession cannot resolve that. The route can, and the official
 * wording is route-shaped too — "individuals holding a K-ETA but entering with
 * a visa must complete the e-Arrival card".
 *
 * It is also the join between the engines. Visa-free scope, the business
 * activity router and (later) the employment routes all end by naming a route;
 * the declaration reads that and nothing else about the traveller's country.
 */
export type EntryRoute =
  /** No visa — on a K-ETA, or on an exemption from one. */
  | 'visa-free'
  /** An individual Korean visa, of any letter. */
  | 'visa'
  /** A group (electronic) visa. Its own route: the lists exclude it where they include the individual visa. */
  | 'group-visa'
  /** A Residence Card, ARC, Permanent Resident Card or Overseas Korean card. */
  | 'residence'
  /** An APEC Business Travel Card. */
  | 'abtc'
  /** Active service member under the US-ROK SOFA. */
  | 'sofa'
  /** UN Laissez-Passer. */
  | 'un'
  | 'other';

/**
 * The route, plus the validity questions that route turns on.
 *
 * Every flag is validity AS AT THE ARRIVAL DATE, never possession — the
 * official definition of a visa holder here is "a valid visa as at the
 * scheduled date of entry", and a lapsed document in a drawer puts nobody on
 * any list. Each is optional and `undefined` means unconfirmed, which resolves
 * to "we cannot tell you" rather than to a yes or a no.
 */
export interface ArrivalContext {
  entryRoute: EntryRoute;
  /** An approved K-ETA in hand and valid on the day. Approval, not application. */
  validApprovedKeta?: boolean;
  /** Why the traveller is outside K-ETA, when that is established. */
  ketaExempt?: KetaExemptionReason | null;
  validVisaOnEntryDate?: boolean;
  validResidenceCard?: boolean;
  /** Meets the published conditions — details match, in date, passport number on it, shows KOR. */
  validAbtcForKorea?: boolean;
}

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
  /**
   * How the reader intends to enter. Left undefined until asked — undefined is
   * not "visa-free", it means the question has not been put, so the declaration
   * answer stays unresolved rather than defaulting to "you must file".
   */
  arrival?: ArrivalContext;
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

/**
 * The e-Arrival Card declaration, kept apart from K-ETA for the same reason
 * K-ETA was kept apart from the visa-free verdict — and here the reason is
 * sharper, because deriving one from the other gets it wrong.
 *
 * Being waived out of K-ETA does NOT waive the declaration. It is the opposite:
 * the declaration exemption rides on an APPROVED K-ETA, so a blanket waiver
 * removes the very thing that would have carried it. Two more that feel like
 * exemptions and are not: a valid Korean visa, and a valid ABTC — the ABTC
 * waives K-ETA and stops there.
 *
 * Only two things waive it: a Residence Card, or an approved K-ETA in hand.
 */
export interface ArrivalCardOutcome {
  /** null = the reader has not been asked what they hold. Not 'yes'. */
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
  /** Third question, third answer. See ArrivalCardOutcome. */
  arrivalCard?: ArrivalCardOutcome;
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
 * The Ministry of Justice manual, whose two annexes are the only place that
 * enumerates every nationality rather than the handful a web page happens to
 * show. Annex 1 is the visa-exemption AGREEMENT table, listing which passport
 * kinds each treaty covers; annex 2 is the unilateral DESIGNATION table.
 *
 * Read with one caveat that belongs in the citation rather than a comment: the
 * September 2026 edition reprints both annexes as at 22 September 2022. Treaty
 * rows age slowly — a 1970 agreement still says what it said — but designation
 * rows are administrative and the table itself records three changes inside a
 * decade (Kuwait 30 to 90 in 2015, Yemen cancelled in 2014, Egypt in 2018).
 * That is why every row sourced here carries an unestablished K-ETA position
 * and sends the reader to the official page rather than answering for it.
 */
export const MOJ_VISA_MANUAL: Source = {
  label:
    'Ministry of Justice, Korea Immigration Service — Visa Application Guide ' +
    'by Status of Stay (사증민원 자격별 안내 매뉴얼), September 2026; annexes ' +
    'as at 22 September 2022',
  url: 'https://www.immigration.go.kr/',
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

/** Where the e-Arrival Card's own inclusion list lives. */
export const E_ARRIVAL_OFFICIAL: Source = {
  label: 'Korea e-Arrival Card — who must submit a declaration',
  url: 'https://www.e-arrivalcard.go.kr/portal/guide/eacTargetGuide.do?locale=E',
};

/**
 * The official site's own selector, which takes Visa / K-ETA / Residence Card /
 * None as independent choices. Recorded because our three-block UI follows its
 * logic, and matching the official tool is a defence: if a reader compares the
 * two and they disagree, the bug is ours and we want it findable.
 */
export const E_ARRIVAL_NAVIGATOR: Source = {
  label: 'Korea e-Arrival Card — declaration navigator',
  url: 'https://www.e-arrivalcard.go.kr/portal/guide/navigator.do',
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
      'The e-Arrival Card page itemises who counts as "K-ETA exempt": ' +
      'citizens of countries temporarily exempt from K-ETA; citizens of ' +
      'K-ETA-eligible countries aged under 17 or over 65; and holders of ' +
      'diplomatic or service (special) passports from K-ETA-eligible countries ' +
      '(special passports recognised as service passports are issued by Oman, ' +
      'Qatar, Saudi Arabia, Panama and Egypt). Two of the three attach to the ' +
      'traveller rather than the passport’s country, which is why a nationality ' +
      'being inside K-ETA’s scope cannot be turned into "you personally must apply".',
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: MOJ_KETA,
  },
  {
    id: 'keta-exempt-means-arrival-card',
    statement:
      'Every route into K-ETA exemption lands on the e-Arrival Card must-file ' +
      'list, because "K-ETA exempt individuals" is a single entry there. Being ' +
      'under 17, over 65, inside the temporary country waiver, or carrying a ' +
      'diplomatic or service passport all get you out of K-ETA and all put you ' +
      'into the declaration. The exemptions do not compound — they hand you off.',
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: E_ARRIVAL_OFFICIAL,
  },
  {
    id: 'arrival-card-visa-validity',
    statement:
      'The must-file list defines a Korean VISA holder as someone holding a ' +
      'valid visa as at the scheduled date of entry — so a visa that has lapsed ' +
      'by the arrival date is not what puts you on that list.',
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: E_ARRIVAL_OFFICIAL,
  },
  {
    id: 'keta-temporary-exemption-countries',
    statement:
      'The temporary K-ETA exemption covers 22 named countries and regions: ' +
      'the United States, Canada, Australia, New Zealand, Japan, Taiwan, ' +
      'Hong Kong, Singapore, Macao, the United Kingdom, Germany, France, ' +
      'Italy, the Netherlands, Spain, Poland, Sweden, Finland, Norway, ' +
      'Belgium, Denmark and Austria. Malaysia is not among them. The 2026 ' +
      'extension notice does not repeat the list, which is why membership is ' +
      'cited from the 2023 announcement and the end date from the notice.',
    verifiedOn: '2026-10-01',
    verifiedBy: 'author',
    source: MOJ_TEMP_EXEMPTION_LIST,
  },
  {
    id: 'arrival-card-exemptions',
    statement:
      'Excluded from the declaration, as published: citizens of the Republic of ' +
      'Korea; holders of a Korean Residence Card (including a Permanent Resident ' +
      'Card or Overseas Korean Resident Card); K-ETA holders; GROUP (ELECTRONIC) ' +
      'VISA holders; visa-free group tourists arriving at Yangyang or Muan ' +
      'International Airport; foreign flight attendants of aircraft entering Korea.',
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: E_ARRIVAL_OFFICIAL,
  },
  {
    id: 'arrival-card-still-required',
    statement:
      'Subject to the declaration, as published: Korean VISA holders; K-ETA ' +
      'EXEMPT INDIVIDUALS; active service members under the US-ROK Status of ' +
      'Forces Agreement; UN passport holders; APEC Business Travel Card (ABTC) ' +
      'holders; domestic seafarers entering or returning. Note the second entry ' +
      'and the ABTC: being waived out of K-ETA puts you ON this list, not off ' +
      'it, because the waiver means no approved K-ETA exists to carry the ' +
      'exclusion — and the ABTC waives K-ETA and nothing further.',
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: E_ARRIVAL_OFFICIAL,
  },
  {
    id: 'arrival-card-not-asked',
    statement:
      'Categories on the official lists that this form does not ask about, so ' +
      'a reader in one of them must check for themselves: SOFA active service ' +
      'members, UN passport holders, seafarers, foreign flight attendants, and ' +
      'visa-free group tours arriving at Yangyang or Muan.',
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: E_ARRIVAL_OFFICIAL,
  },
  {
    id: 'arrival-card-visa-overrides-keta',
    statement:
      'K-ETA holders are excluded from the declaration — "however, individuals ' +
      'holding a K-ETA but entering with a visa must complete the e-Arrival ' +
      'card". The exception is printed on the exclusion itself, and it is the ' +
      'one case where two exemption-looking documents give opposite answers: ' +
      'what decides is the document you enter on, not the set you own.',
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: E_ARRIVAL_OFFICIAL,
  },
  {
    id: 'arrival-card-sofa',
    statement:
      'Active service members under Article 8 of the US-ROK Status of Forces ' +
      'Agreement, holding a valid US military ID and orders, are subject to the ' +
      'e-Arrival Card declaration.',
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: E_ARRIVAL_OFFICIAL,
  },
  {
    id: 'arrival-card-un-laissez-passer',
    statement:
      'Holders of a UN Laissez-Passer issued to UN staff and to personnel of ' +
      'the specialized agencies are subject to the e-Arrival Card declaration.',
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: E_ARRIVAL_OFFICIAL,
  },
  {
    id: 'abtc-validity-conditions',
    statement:
      'A "valid ABTC" is defined on the declaration page, and a card can fail ' +
      'it: personal details (name, date of birth, gender, nationality) must ' +
      'match exactly, the card must have remaining validity, the passport ' +
      'number must be written on it, and it must display the approval country ' +
      'code KOR. Mobile applications count as the card.',
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: E_ARRIVAL_OFFICIAL,
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
/**
 * WHY someone is out of K-ETA. Four routes, and they matter downstream rather
 * than here: the e-Arrival list has one entry, "K-ETA exempt individuals", that
 * catches all four. Naming the route lets the declaration answer say which one
 * is doing it instead of "you are exempt, and also you must file", which reads
 * like a contradiction when it is a handoff.
 *
 * Two are properties of the passport's country, two of the traveller — so this
 * form can only ever establish the first.
 */
export type KetaExemptionReason =
  | 'temporary-country-exemption'
  | 'age-under-17'
  | 'age-over-65'
  | 'diplomatic-service-passport';

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

/** Second pass, 2026-09-29: the nine expansion nationalities, same pages. */
const READ_0929: Verified[] = READ.map((v) => ({ ...v, verifiedOn: '2026-09-29' }));

/**
 * Exemptions that attach to the traveller rather than the passport. Listed for
 * the reader, never applied: the form does not ask anyone's age, and guessing
 * would turn "K-ETA is normally required for your nationality" into a personal
 * instruction that may be wrong in either direction.
 */
const PERSONAL_EXEMPTIONS = [
  'aged under 17 on the date of arrival',
  'aged over 65 on the date of arrival',
  'holding a diplomatic or service (special) passport from a K-ETA-eligible country',
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

/**
 * The manual's annexes, read on 2026-09-29. One reading, not three: the annex
 * states the scheme and the permitted stay in the same row, and says nothing
 * about K-ETA at all.
 */
const MANUAL_ANNEX: Verified[] = [
  { verifiedOn: '2026-09-29', verifiedBy: 'author', source: MOJ_VISA_MANUAL },
];

/**
 * What a row sourced from the manual can honestly say about K-ETA: nothing.
 *
 * The temptation is to infer it — K-ETA's scope is drawn from the visa-waiver
 * lists, so "visa-free, therefore K-ETA applies" looks safe. It is not. The
 * K-ETA eligibility page is its own list and does not match the waiver lists
 * row for row, and the temporary exemption is a third list again, named
 * country by country. Deriving any of the three from the others would produce
 * a confident answer with nothing behind it, which is worse than none — so
 * these rows resolve to 'unestablished' and hand the reader the official page.
 */
const KETA_UNREAD: KetaPosition = {
  eligible: null,
  personalExemptions: PERSONAL_EXEMPTIONS,
};

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
    code: 'DE',
    name: 'Germany',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ_0929,
  },
  {
    code: 'FR',
    name: 'France',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ_0929,
  },
  {
    code: 'IT',
    name: 'Italy',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ_0929,
  },
  {
    code: 'ES',
    name: 'Spain',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ_0929,
  },
  {
    // 03 Months on the official table, not 90 days. Kept as months.
    code: 'NL',
    name: 'Netherlands',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'months', value: 3 },
    keta: TEMP_EXEMPT,
    verified: READ_0929,
  },
  {
    // 03 Months, same as the Netherlands.
    code: 'NZ',
    name: 'New Zealand',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'months', value: 3 },
    keta: TEMP_EXEMPT,
    verified: READ_0929,
  },
  {
    // The one of the nine outside the temporary exemption, like Malaysia.
    code: 'TH',
    name: 'Thailand',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: { eligible: true, personalExemptions: PERSONAL_EXEMPTIONS },
    verified: READ_0929,
  },
  {
    code: 'TW',
    name: 'Taiwan',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ_0929,
  },
  {
    code: 'HK',
    name: 'Hong Kong',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: READ_0929,
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

  /* ---------------------------------------------------------------------
   * Below: the two annexes of the Ministry of Justice visa manual, which is
   * the only source here that enumerates every nationality instead of the
   * ones a web page happens to display.
   *
   * ORDINARY PASSPORTS ONLY. Most agreements cover diplomatic and service
   * passports and stop there — the Philippines, Ukraine, Belarus, Moldova,
   * Azerbaijan, Kyrgyzstan, Lebanon, Indonesia and Egypt are all in the annex
   * and none of them gives an ordinary passport visa-free entry, so none of
   * them is a row here. Where a country appears in both annexes with
   * different figures, the row takes the one that reaches an ordinary
   * passport and the comment says which.
   *
   * Two countries in the designation annex are recorded as cancelled and are
   * not rows: Yemen in 2014, Egypt in 2018. Guam and New Caledonia are in the
   * annex as destinations rather than nationalities — their travellers hold
   * United States and French passports — so they are not rows either.
   *
   * The sixteen nationalities above were read at source and are NOT repeated
   * here. Cross-checking them against the annex found no disagreement, which
   * is the reason to trust the annex for the rest of the list.
   * ------------------------------------------------------------------- */
  {
    code: 'SA',
    name: 'Saudi Arabia',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // Macau SAR passport, not mainland China — the mainland has no ordinary-passport exemption.
    code: 'MO',
    name: 'Macau',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'BH',
    name: 'Bahrain',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'BN',
    name: 'Brunei',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'OM',
    name: 'Oman',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // The agreement covers diplomatic, service and special passports only. An ordinary passport enters on the designation, which the annex raised from 30 to 90 in 2015.
    code: 'KW',
    name: 'Kuwait',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'GY',
    name: 'Guyana',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // Agreement for diplomatic and service passports; an ordinary passport takes the designation.
    code: 'AR',
    name: 'Argentina',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // Agreement for diplomatic and service passports; an ordinary passport takes the designation.
    code: 'EC',
    name: 'Ecuador',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'HN',
    name: 'Honduras',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // Agreement for diplomatic and service passports; an ordinary passport takes the designation.
    code: 'PY',
    name: 'Paraguay',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'MC',
    name: 'Monaco',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'ME',
    name: 'Montenegro',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'VA',
    name: 'Vatican City',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'BA',
    name: 'Bosnia and Herzegovina',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // The agreement reaches diplomatic and service passports only, so an ordinary passport takes the designation figure.
    code: 'CY',
    name: 'Cyprus',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'SM',
    name: 'San Marino',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'RS',
    name: 'Serbia',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'SI',
    name: 'Slovenia',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'AD',
    name: 'Andorra',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'AL',
    name: 'Albania',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // Both annexes give 90 — the agreement for diplomatic and service passports, the designation for ordinary.
    code: 'HR',
    name: 'Croatia',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'NR',
    name: 'Nauru',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'MH',
    name: 'Marshall Islands',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'FM',
    name: 'Micronesia',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'WS',
    name: 'Samoa',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'SB',
    name: 'Solomon Islands',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'KI',
    name: 'Kiribati',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'TO',
    name: 'Tonga',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'TV',
    name: 'Tuvalu',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'PW',
    name: 'Palau',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'FJ',
    name: 'Fiji',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'ZA',
    name: 'South Africa',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'MU',
    name: 'Mauritius',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'SC',
    name: 'Seychelles',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'SZ',
    name: 'Eswatini',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'BW',
    name: 'Botswana',
    category: 'default',
    basis: 'designation',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'IL',
    name: 'Israel',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'TR',
    name: 'Türkiye',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // 30 continuous, and no more than 60 within any 180 — the manual states both.
    code: 'KZ',
    name: 'Kazakhstan',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'rolling', continuousDays: 30, maxInWindow: 60, windowDays: 180 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // The designation annex still lists 30 days; the agreement that superseded it on 22 September 2022 covers ordinary passports at 90, and the annex says so in its own note.
    code: 'QA',
    name: 'Qatar',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'GT',
    name: 'Guatemala',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'GD',
    name: 'Grenada',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'NI',
    name: 'Nicaragua',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'DO',
    name: 'Dominican Republic',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'DM',
    name: 'Dominica',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'MX',
    name: 'Mexico',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'months', value: 3 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'BB',
    name: 'Barbados',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'BS',
    name: 'Bahamas',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'VE',
    name: 'Venezuela',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'BR',
    name: 'Brazil',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'LC',
    name: 'Saint Lucia',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'VC',
    name: 'Saint Vincent and the Grenadines',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'KN',
    name: 'Saint Kitts and Nevis',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'SR',
    name: 'Suriname',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'months', value: 3 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'HT',
    name: 'Haiti',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'AG',
    name: 'Antigua and Barbuda',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'SV',
    name: 'El Salvador',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'UY',
    name: 'Uruguay',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'JM',
    name: 'Jamaica',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'CL',
    name: 'Chile',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'CR',
    name: 'Costa Rica',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'CO',
    name: 'Colombia',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'TT',
    name: 'Trinidad and Tobago',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'PA',
    name: 'Panama',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'PE',
    name: 'Peru',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'GR',
    name: 'Greece',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'months', value: 3 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'NO',
    name: 'Norway',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'DK',
    name: 'Denmark',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'LV',
    name: 'Latvia',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // Sixty per entry, ninety within any 180. Two different numbers, both binding.
    code: 'RU',
    name: 'Russia',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'rolling', continuousDays: 60, maxInWindow: 90, windowDays: 180 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    // Ninety per entry and ninety within any 180 — the window is what bites on a second trip.
    code: 'RO',
    name: 'Romania',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'rolling', continuousDays: 90, maxInWindow: 90, windowDays: 180 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'LU',
    name: 'Luxembourg',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'months', value: 3 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'LT',
    name: 'Lithuania',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'LI',
    name: 'Liechtenstein',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'months', value: 3 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'MT',
    name: 'Malta',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'BE',
    name: 'Belgium',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'months', value: 3 },
    keta: TEMP_EXEMPT,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'SE',
    name: 'Sweden',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'CH',
    name: 'Switzerland',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'months', value: 3 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'SK',
    name: 'Slovakia',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'IS',
    name: 'Iceland',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'IE',
    name: 'Ireland',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'EE',
    name: 'Estonia',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'AT',
    name: 'Austria',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'CZ',
    name: 'Czechia',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'PT',
    name: 'Portugal',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'PL',
    name: 'Poland',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'FI',
    name: 'Finland',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: TEMP_EXEMPT,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'HU',
    name: 'Hungary',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'LS',
    name: 'Lesotho',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 60 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'MA',
    name: 'Morocco',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 90 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
  },
  {
    code: 'TN',
    name: 'Tunisia',
    category: 'default',
    basis: 'agreement',
    stay: { kind: 'days', value: 30 },
    keta: KETA_UNREAD,
    verified: MANUAL_ANNEX,
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

  // Answered up front and returned on EVERY path, because it does not depend on
  // nationality at all — the same route files or does not whoever holds it. A
  // reader whose visa-free answer is "out of scope" still has an arrival
  // declaration to file, and an early return that omitted this left the screen
  // showing the previous reader's answer as though it were theirs.
  const arrivalCard = assessArrivalCard(input.arrival);

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
      arrivalCard,
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
      arrivalCard,
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
        'One thing we can tell you: a diplomatic or service passport from a K-ETA-eligible country is exempt from K-ETA — and that exemption puts you on the e-Arrival Card must-file list rather than off it.',
      ],
      next: [],
      basis,
      arrivalCard,
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
      arrivalCard,
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
        arrivalCard,
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
      arrivalCard,
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
  // Re-run once the K-ETA answer exists, because the one thing this engine can
  // hand the declaration is WHY the traveller is outside K-ETA — which they
  // cannot be expected to know about their own nationality. Anything they told
  // us themselves still wins.
  const enrichedArrivalCard = assessArrivalCard(
    input.arrival && {
      ...input.arrival,
      ketaExempt:
        input.arrival.ketaExempt ??
        (keta.status === 'temporarily-exempt' ? 'temporary-country-exemption' : null),
    },
  );

  // No generic "which filing do you need" link here: the declaration and K-ETA
  // answers are computed above, so whoever renders them can offer the exact
  // guide for the answer the reader got. Two places emitting the same link is
  // how they drift apart.
  next.push({ label: 'Paying and getting connected on arrival', href: '/banking/' });

  return {
    verdict,
    reasons,
    stayDays: stay.limitDays,
    keta,
    arrivalCard: enrichedArrivalCard,
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

  // The part that surprises people: getting out of K-ETA does not get you out
  // of anything else. Every route into K-ETA exemption is a single entry on the
  // e-Arrival must-file list, so the exemptions hand you off rather than stack.
  if (needed === false || position.personalExemptions.length > 0) {
    basis.push(fact('keta-exempt-means-arrival-card'));
    reasons.push(
      'Being exempt from K-ETA does not shorten the list. "K-ETA exempt individuals" is itself an entry on the e-Arrival must-file list — see block 3.',
    );
  }

  return { status, needed, reasons, basis, officialCheck: KETA_ELIGIBILITY_PAGE };
}

/**
 * Categories the official lists name that the route question does not reach.
 *
 * SOFA and UN are not here any more — they became routes the reader can pick.
 * What is left is the residue: cases decided by the trip rather than by the
 * traveller's documents. Kept as data so the caveat the reader sees and the
 * list on the page come from one place.
 *
 * Not wired into any verdict. Nothing here decides anything.
 */
export const OTHER_DECLARATION_STATUSES: { label: string; files: boolean }[] = [
  { label: 'Domestic or returning seafarer', files: true },
  { label: 'Visa-free group tourist arriving at Yangyang or Muan International Airport', files: false },
  { label: 'Foreign flight attendant on an aircraft entering Korea', files: false },
  { label: 'Citizen of the Republic of Korea', files: false },
];

/**
 * The e-Arrival Card, on its own — and deliberately NOT derived from the K-ETA
 * answer, which was the earlier design and was wrong in the dangerous
 * direction. Deriving "exempt from K-ETA, therefore exempt from the
 * declaration" inverts the actual rule: the exclusion rides on an approved
 * K-ETA, so being waived out of K-ETA leaves nothing to carry it. "K-ETA exempt
 * individuals" is itself an entry on the must-file list.
 *
 * It reads a route and the validity of the document that route runs on. It
 * reads nothing about nationality, which is why it takes no CountryRule — the
 * same American files or does not depending only on what they enter on.
 */
export function assessArrivalCard(ctx?: ArrivalContext): ArrivalCardOutcome {
  const base = { officialCheck: E_ARRIVAL_OFFICIAL };

  // Not asked yet. Undefined is not "visa-free" — answering a question nobody
  // put would be inventing the reader's circumstances.
  if (!ctx) {
    return {
      needed: null,
      reasons: ['Tell us how you intend to enter and we will answer this one. It turns on that, and on nothing else.'],
      basis: [],
      ...base,
    };
  }

  // Said on every answer, because the form asks about one route and the
  // official lists name eleven categories.
  const notAsked =
    'The lists also name cases this form does not cover — seafarers, flight attendants, and visa-free group ' +
    'tours arriving at Yangyang or Muan. If one is you, check the page.';

  const unresolved = (why: string, extra: Verified[] = []): ArrivalCardOutcome => ({
    needed: null,
    reasons: [why, notAsked],
    basis: extra,
    ...base,
  });

  switch (ctx.entryRoute) {
    case 'visa': {
      if (ctx.validVisaOnEntryDate === false) {
        return unresolved(
          'A visa that has lapsed by your arrival date is not what puts you on the must-file list — and it is ' +
            'also not something you can enter on. Sort the visa first, then come back.',
          [fact('arrival-card-visa-validity')],
        );
      }
      if (ctx.validVisaOnEntryDate === undefined) {
        return unresolved(
          'Confirm the visa will still be valid on the day you land. The list is defined by validity as at the ' +
            'scheduled date of entry, not by holding one now.',
          [fact('arrival-card-visa-validity')],
        );
      }
      const reasons = ['You file the e-Arrival Card declaration.'];
      if (ctx.validApprovedKeta) {
        reasons.push(
          'An approved K-ETA does not get you out of it here, because you are entering on the visa. This is the ' +
            'one case where two documents that both look like exclusions give opposite answers, and the official ' +
            'page prints the exception on the exclusion itself.',
        );
      } else {
        reasons.push('Korean visa holders are the first entry on the must-file list.');
      }
      reasons.push(notAsked);
      return {
        needed: true,
        reasons,
        basis: ctx.validApprovedKeta
          ? [fact('arrival-card-visa-overrides-keta'), fact('arrival-card-visa-validity'), fact('arrival-card-still-required')]
          : [fact('arrival-card-visa-validity'), fact('arrival-card-still-required')],
        ...base,
      };
    }

    case 'group-visa':
      // The one visa that excludes rather than includes.
      return {
        needed: false,
        reasons: [
          'You do not file. Group (electronic) visa holders are excluded from the declaration — the one visa that excludes rather than includes.',
          notAsked,
        ],
        basis: [fact('arrival-card-exemptions')],
        ...base,
      };

    case 'residence':
      if (ctx.validResidenceCard === undefined) {
        return unresolved('Confirm the card will be valid on the day you land, and we will answer this.');
      }
      if (!ctx.validResidenceCard) {
        return unresolved(
          'A card that is not valid on your arrival date is not the route you are entering on. What you do enter ' +
            'on is what decides this.',
        );
      }
      return {
        needed: false,
        reasons: [
          'You do not file. A Korean Residence Card excludes you — including a Permanent Resident Card or an Overseas Korean Resident Card.',
          notAsked,
        ],
        basis: [fact('arrival-card-exemptions')],
        ...base,
      };

    case 'visa-free': {
      if (ctx.validApprovedKeta) {
        return {
          needed: false,
          reasons: [
            'You do not file. An approved K-ETA excludes you, and you are entering on it.',
            'The approval carries it, not the application — and only while you enter on the K-ETA. Enter on a visa instead and you file, whatever else you hold.',
            notAsked,
          ],
          basis: [fact('arrival-card-exemptions'), fact('keta-voluntary-application-arrival-card')],
          ...base,
        };
      }
      if (ctx.ketaExempt) {
        return {
          needed: true,
          reasons: ['You file the e-Arrival Card declaration.', exemptionLine(ctx.ketaExempt), notAsked],
          basis: [fact('keta-exempt-means-arrival-card'), fact('arrival-card-still-required')],
          ...base,
        };
      }
      if (ctx.validApprovedKeta === false) {
        return {
          needed: true,
          reasons: [
            'You file the e-Arrival Card declaration.',
            'Nothing you have named excludes you from it.',
            'If you get an approved K-ETA for this trip and enter on that, this flips to excluded — come back then.',
            notAsked,
          ],
          basis: [fact('arrival-card-still-required')],
          ...base,
        };
      }
      return unresolved('Tell us whether you will have an approved K-ETA in hand, and we will answer this one.');
    }

    case 'abtc':
      if (ctx.validAbtcForKorea === true) {
        return {
          needed: true,
          reasons: [
            'You file the e-Arrival Card declaration. ABTC holders are their own entry on the must-file list.',
            'The card waives K-ETA and stops there. The two are separate filings, and this is the point the card is most often assumed to cover.',
            notAsked,
          ],
          basis: [fact('abtc-validity-conditions'), fact('arrival-card-still-required')],
          ...base,
        };
      }
      // An unverified card cannot decide either way. Saying "you file" would be
      // deciding on a condition we were told is unknown.
      return unresolved(
        'An ABTC only counts if it meets the published conditions: the personal details must match exactly, it ' +
          'must have remaining validity, the passport number must be written on it, and it must display the ' +
          'approval country code KOR. Mobile cards count. Check those, then come back.',
        [fact('abtc-validity-conditions')],
      );

    case 'sofa':
      return {
        needed: true,
        reasons: [
          'You file the e-Arrival Card declaration.',
          'Active service members under Article 8 of the US-ROK Status of Forces Agreement, with a valid military ID and orders, are named on the must-file list.',
          notAsked,
        ],
        basis: [fact('arrival-card-sofa')],
        ...base,
      };

    case 'un':
      return {
        needed: true,
        reasons: [
          'You file the e-Arrival Card declaration.',
          'Holders of a UN Laissez-Passer, issued to UN staff and to personnel of the specialized agencies, are named on the must-file list.',
          notAsked,
        ],
        basis: [fact('arrival-card-un-laissez-passer')],
        ...base,
      };

    default:
      return unresolved('We do not resolve that route here. The official page lists every category by name.');
  }
}

/** Why someone is out of K-ETA, in the reader's own terms. */
function exemptionLine(reason: KetaExemptionReason): string {
  const why: Record<KetaExemptionReason, string> = {
    'temporary-country-exemption': 'your nationality sits inside the temporary country waiver',
    'age-under-17': 'you are under 17 on the date of arrival',
    'age-over-65': 'you are over 65 on the date of arrival',
    'diplomatic-service-passport': 'you hold a diplomatic or service passport from a K-ETA-eligible country',
  };
  return (
    `You are exempt from K-ETA because ${why[reason]} — and that is exactly what puts you here. ` +
    '"K-ETA exempt individuals" is a single entry on the must-file list, so every route out of K-ETA leads into the declaration.'
  );
}
