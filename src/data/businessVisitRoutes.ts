/**
 * Business visits to Korea — which activities a visa-free short visit covers,
 * and which one need a visa.
 *
 * SEPARATE FILE ON PURPOSE. Nationality decides whether you may enter without a
 * visa; activity decides whether what you came to do is allowed once you are
 * in. Those are independent, and folding activity into `COUNTRY_RULES` would
 * have meant every nationality row carrying a copy of the same nine answers.
 * The two engines meet in one place only — `routeFor()` takes the visa-free
 * verdict as an argument and never computes it.
 *
 * WHAT THIS FILE ASSERTS, AND WHAT IT DOES NOT.
 *
 * The verdicts rest on one verified sentence: the purposes visa-free entry
 * covers are travel, visiting relatives, attending events or conferences, and
 * business purposes with NO COMMERCIAL ACTIVITIES ALLOWED. That clause is the
 * whole boundary, and it is enough to sort meetings from paid work.
 *
 * Visa names are a different kind of claim. They are signposts — "this is the
 * visa that matches what you described" — not determinations, and the file says
 * so in the copy. An immigration officer decides admission and a consulate
 * decides a visa; a table decides neither. So `suggestedVisa` is never dressed
 * up as an answer, and where the route is genuinely unsettled the activity
 * says 'check' rather than guessing between two of them.
 */

import { fact, HIKOREA_VISA_FREE, KETA_ELIGIBILITY_PAGE, type Source, type Verified } from './visaFreeEntry.ts';

/* ---------------------------------------------------------------------------
 * Activities, in the words a reader would use about their own trip.
 * ------------------------------------------------------------------------- */

export type BusinessActivityId =
  | 'meeting'
  | 'conference'
  | 'trade-fair'
  | 'buyer-supplier-visit'
  | 'market-research'
  | 'liaison'
  | 'consultation'
  | 'contract-negotiation'
  | 'factory-visit'
  | 'technical-work'
  | 'installation-repair'
  | 'paid-work'
  | 'intra-company-assignment'
  | 'investment';

/** The visa that matches an activity. A signpost, never a determination. */
export type SuggestedVisa =
  /** C-3-4 Short-Term Business. */
  | 'c-3-4'
  /** C-4 Short-Term Employment. */
  | 'c-4'
  /** A long-stay route — not a short-visit visa at all. */
  | 'long-stay'
  /** Not settled here. The official page decides. */
  | 'check';

export interface BusinessActivity {
  id: BusinessActivityId;
  label: string;
  /**
   * Does this cross the "no commercial activities allowed" line?
   *
   * false → a visa-free short visit can cover it, if your nationality is in
   *         scope and the trip fits the allowed stay.
   * true  → it is outside visa-free entry however short the trip is, and
   *         whatever the trip is called internally.
   * null  → not established here.
   */
  commercial: boolean | null;
  suggestedVisa: SuggestedVisa;
  /** Said to the reader, in their terms. */
  note: string;
}

/**
 * ABTC: HiKorea states that a holder is granted C-3-4 for 90 days. Recorded
 * because it is the one place an ABTC does something here — and it is also the
 * card's limit: it reaches K-ETA and C-3-4, and not the e-Arrival declaration.
 */
export const ABTC_ROUTE: { visa: SuggestedVisa; days: number; verified: Verified } = {
  visa: 'c-3-4',
  days: 90,
  verified: {
    verifiedOn: '2026-09-29',
    verifiedBy: 'author',
    source: HIKOREA_VISA_FREE,
  },
};

export const BUSINESS_ACTIVITIES: BusinessActivity[] = [
  {
    id: 'meeting',
    label: 'A meeting with a company or partner',
    commercial: false,
    suggestedVisa: 'c-3-4',
    note: 'Sitting in a meeting is not a commercial activity. It is inside the visa-free purposes.',
  },
  {
    id: 'conference',
    label: 'Attending a conference or event',
    commercial: false,
    suggestedVisa: 'c-3-4',
    note: 'Named in the visa-free purposes outright — attending events or conferences.',
  },
  {
    id: 'trade-fair',
    label: 'Attending a trade fair or exhibition',
    commercial: false,
    suggestedVisa: 'c-3-4',
    note: 'Attending is inside the purposes. Selling from a stand is not attending — if you are taking orders, ask before you travel.',
  },
  {
    id: 'buyer-supplier-visit',
    label: 'Visiting a buyer or supplier',
    commercial: false,
    suggestedVisa: 'c-3-4',
    note: 'A visit is a visit. What you do on it is what decides, not the fact that it is work-related.',
  },
  {
    id: 'market-research',
    label: 'Market research',
    commercial: false,
    suggestedVisa: 'c-3-4',
    note: 'Looking, asking and reporting back. Nothing here is a commercial activity performed in Korea.',
  },
  {
    id: 'liaison',
    label: 'Liaison work for your employer abroad',
    commercial: false,
    suggestedVisa: 'c-3-4',
    note: 'You are paid abroad for work about Korea, not paid in Korea for work in Korea.',
  },
  {
    id: 'consultation',
    label: 'Consultation or an advisory discussion',
    commercial: false,
    suggestedVisa: 'c-3-4',
    note: 'A discussion stays inside the purposes. Delivering the consultancy as a paid engagement does not.',
  },
  {
    id: 'contract-negotiation',
    label: 'Negotiating or signing a contract',
    commercial: false,
    suggestedVisa: 'c-3-4',
    note: 'Negotiating and signing sit inside the purposes. Performing the contract in Korea is the next row down.',
  },
  {
    id: 'factory-visit',
    label: 'A factory or site visit — looking, not working',
    commercial: false,
    suggestedVisa: 'c-3-4',
    note: 'Walking a line and asking questions is a visit. Putting your hands on the machine is technical work.',
  },
  {
    id: 'technical-work',
    label: 'Technical or engineering work under a contract',
    commercial: true,
    suggestedVisa: 'c-4',
    note: 'Work performed in Korea under a contract or purchase order is a commercial activity, so it is outside visa-free entry however few days it takes.',
  },
  {
    id: 'installation-repair',
    label: 'Installation, commissioning or repair',
    commercial: true,
    suggestedVisa: 'c-4',
    note: 'The same line as technical work. A two-day install is still work done in Korea.',
  },
  {
    id: 'paid-work',
    label: 'Work you are paid for in Korea',
    commercial: true,
    suggestedVisa: 'c-4',
    note: 'The clearest case on the list, and the one most often called something else on the invitation letter.',
  },
  {
    id: 'intra-company-assignment',
    label: 'A posting or transfer to a Korean entity',
    commercial: true,
    suggestedVisa: 'long-stay',
    note: 'Taking up a position is not a visit. Which long-stay route applies is not settled here — check it officially.',
  },
  {
    id: 'investment',
    label: 'Setting up or investing in a business',
    commercial: null,
    suggestedVisa: 'check',
    note: 'Where scouting ends and establishing begins is not a line this checker will draw. Check it officially.',
  },
];

export function activity(id: BusinessActivityId): BusinessActivity {
  const found = BUSINESS_ACTIVITIES.find((a) => a.id === id);
  if (!found) throw new Error(`No business activity with id "${id}"`);
  return found;
}

/* ---------------------------------------------------------------------------
 * The route.
 * ------------------------------------------------------------------------- */

export type BusinessRoute =
  /** Nationality in scope and the activity stays inside the purposes. */
  | 'visa-free-visit'
  /** The activity is fine, but the nationality is not in visa-free scope. */
  | 'short-business-visa'
  /** The activity itself needs a visa, whoever you are. */
  | 'employment-visa'
  | 'long-stay-visa'
  | 'check-required';

export interface BusinessRouteResult {
  route: BusinessRoute;
  reasons: string[];
  /** A signpost to the matching visa, never a determination. */
  suggestedVisa?: SuggestedVisa;
  basis: Verified[];
  officialCheck: Source;
}

/**
 * Combine the two independent answers.
 *
 * `visaFreeInScope` comes from `assess()` — this function never works it out,
 * which is what keeps nationality and activity from leaking into each other. It
 * is a tri-state on purpose: 'check-required' from the entry checker must not
 * collapse into a no here.
 */
export function routeFor(
  id: BusinessActivityId,
  visaFreeInScope: boolean | null,
): BusinessRouteResult {
  const a = activity(id);
  const reasons: string[] = [a.note];
  const officialCheck = KETA_ELIGIBILITY_PAGE;

  // The activity decides first, because it decides regardless of passport.
  if (a.commercial === null) {
    return { route: 'check-required', reasons, suggestedVisa: a.suggestedVisa, basis: [], officialCheck };
  }

  if (a.commercial) {
    reasons.push(
      'No length of stay makes this a visit, so visa-free entry is not the route whatever your nationality.',
    );
    return {
      route: a.suggestedVisa === 'long-stay' ? 'long-stay-visa' : 'employment-visa',
      reasons,
      suggestedVisa: a.suggestedVisa,
      basis: [fact('visa-free-purposes')],
      officialCheck,
    };
  }

  // Non-commercial. Now the passport matters.
  const basis = [fact('visa-free-purposes')];

  if (visaFreeInScope === true) {
    reasons.push(
      'Your nationality is in scope for visa-free entry and this activity is inside the purposes it covers, so a visa-free business visit can work.',
    );
    reasons.push(
      'The stay limit and any K-ETA or e-Arrival filing still apply — being allowed to come for this does not remove the paperwork for coming.',
    );
    return { route: 'visa-free-visit', reasons, basis, officialCheck };
  }

  if (visaFreeInScope === false) {
    reasons.push(
      'The activity is fine; your nationality is not in visa-free scope, so it needs the short business visa rather than no visa.',
    );
    return { route: 'short-business-visa', reasons, suggestedVisa: 'c-3-4', basis, officialCheck };
  }

  reasons.push(
    'Whether you may enter without a visa is not settled yet, so the route depends on that answer first.',
  );
  return { route: 'check-required', reasons, suggestedVisa: 'c-3-4', basis, officialCheck };
}
