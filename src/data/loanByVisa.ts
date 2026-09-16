/**
 * What a Korean lender is actually deciding, by residence status.
 *
 * The obvious build here is a yes/no eligibility checker: pick a visa, get an
 * answer. This site cannot ship that, because five of its own guides say —
 * with citations — that the visa is not the thing being decided:
 *
 *   "visa type alone neither approves nor blocks a lease"
 *   "there is no nationwide list of card-eligible residence statuses"
 *   "no legal rule bars any particular visa from car finance"
 *   "the tidy table — F-5 approved, E-7 conditional, E-9 and D-2 rejected —
 *    does not survive contact with published products"
 *
 * So the answer to "which visa qualifies" is that the question is wrong, and
 * that is the more useful thing to hand someone anyway. Picking a status here
 * returns the three screens a lender runs in order, the one or two things that
 * status genuinely changes, and the products that name it in their own
 * published terms.
 *
 * The rule for this file: every line traces to a guide that already published
 * and sourced it. No approval odds, no scoring, no "you are likely to be
 * approved" — none of that is knowable from a residence status, and inventing
 * it would make this the exact tidy table the guides spend their length
 * dismantling.
 */

export interface VisaNote {
  id: string;
  /** As it appears on the card. */
  label: string;
  /** Who this covers, for readers unsure which chip is theirs. */
  hint: string;
  /**
   * What this status genuinely changes in the lender's read — always about
   * the screens below, never about the outcome.
   */
  changes: string[];
  /** Products whose own published terms name this status. Empty is honest:
   *  it means no product we have cited names it, not that none exists. */
  products: string[];
}

/** The order a Korean lender works through, from the loan guide's own figure.
 *  Failing an early screen makes the later ones irrelevant. */
export const SCREENS = [
  {
    n: 1,
    title: 'Stay continuity',
    detail:
      'Status and remaining period: will you still be in Korea for the life of the loan? This is the only screen your visa touches directly — and it is a risk input, not a gate.',
  },
  {
    n: 2,
    title: 'Verifiable Korean income and a credit file',
    detail:
      'Documented domestic income beats higher but unverifiable overseas income, and a thin NICE or KCB file caps everything above it. This screen is where most files are actually decided.',
  },
  {
    n: 3,
    title: 'Regulatory caps',
    detail:
      'DSR, LTV and stress-rate maths, applied exactly as they are to Korean nationals. Nationality and residence status add nothing here at all.',
  },
] as const;

/** The three patterns foreigner files actually fail on, from the same guide.
 *  All three are addressable, which is the reason to name them. */
export const FAILURES = [
  {
    title: 'Stay visibility too short for the term',
    detail:
      'No universal cutoff exists, but an imminent expiry paired with an ending employment contract is an unambiguous negative. Renewing status or securing a longer contract before applying often changes the answer.',
  },
  {
    title: 'Income real, evidence weak',
    detail:
      'The fix is mechanical: make salary transfers and tax records agree, and accumulate tenure before applying.',
  },
  {
    title: 'Guarantee-institution criteria unmet',
    detail:
      'On guarantee-backed products no sympathetic banker can override this. The move is to treat a different guarantee product, a secured loan, and a pure credit loan as three separate paths.',
  },
] as const;

const OK_SAVINGS =
  'OK Savings Bank, Hi-OK loan — names this status in its published eligibility, NICE 300+, up to ₩60M at roughly 14.23–19.99%';
const WELCOME =
  'Welcome Savings Bank, foreigner loan — names this status, up to ₩30M at 7.61–19.90% for up to 36 months, eligible from one month of stay remaining';

export const VISAS: VisaNote[] = [
  {
    id: 'f5',
    label: 'F-5',
    hint: 'Permanent residence',
    changes: [
      'Clears the first screen more cleanly than any other status: the risk that a renewal or a job change abruptly ends your basis for living in Korea is comparatively small.',
      'Structurally better placed — not automatically equal to a Korean national. DSR, collateral value, income, tenure and credit score still apply exactly as they do to everyone else.',
    ],
    products: [],
  },
  {
    id: 'f4',
    label: 'F-4',
    hint: 'Overseas Koreans',
    changes: [
      'Reads well on stay duration, so the first screen is rarely the problem.',
      'Outcomes inside the F-4 pool diverge more sharply than in any other group. A lender has no reason to read years of salary at a large Korean employer the same as an arrival last month with no domestic income — the label matters far less than the thickness of the Korean track record.',
    ],
    products: [],
  },
  {
    id: 'f2',
    label: 'F-2',
    hint: 'Residence',
    changes: [
      'Reads as low stay-uncertainty, so the first screen is usually satisfied.',
      'Named directly in published savings-bank foreigner products, so the question of which doors are open is answerable rather than speculative.',
    ],
    products: [OK_SAVINGS],
  },
  {
    id: 'f6',
    label: 'F-6',
    hint: 'Marriage to a Korean national',
    changes: [
      'Stay continuity generally reads well, moving the decision onto the second screen.',
      'Named directly in a published savings-bank foreigner product.',
    ],
    products: [OK_SAVINGS],
  },
  {
    id: 'e7',
    label: 'E-7 · E-1–E-4',
    hint: 'Specific activity; professors, researchers, instructors',
    changes: [
      'One clean advantage on the second screen: domestic salary income that is straightforward to verify.',
      'The remaining period of your stay and your contract are read together. Tenure and a longer contract are what move this file, not the visa code.',
    ],
    products: [OK_SAVINGS, WELCOME],
  },
  {
    id: 'e9',
    label: 'E-9',
    hint: 'Non-professional employment',
    changes: [
      '"E-9 is shut out of the financial system" is contradicted by published product pages that name E-9 as eligible.',
      'The visa gates which products you can enter. Inside an eligible product, the financial file decides — as it does for everyone else.',
    ],
    products: [OK_SAVINGS, WELCOME],
  },
  {
    id: 'd2',
    label: 'D-2',
    hint: 'Degree study',
    changes: [
      '"Students are excluded" is contradicted by published product pages that list D-2 among eligible applicants.',
      'Documented Korean income is usually the binding constraint here, not the status itself — which puts the second screen, not the first, in your way.',
    ],
    products: [OK_SAVINGS, WELCOME],
  },
  {
    id: 'other',
    label: 'Something else',
    hint: 'D-8, D-10, E-2, or not sure',
    changes: [
      'The three screens below are the same whatever the code on your card. What changes between statuses is only how the first one reads.',
      'Where no product we have cited names your status, that means we have not found one to cite — not that none exists. Ask the lender what their published eligibility says, rather than accepting a general statement about foreigners.',
    ],
    products: [],
  },
];
