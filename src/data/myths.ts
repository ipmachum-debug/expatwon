/**
 * Things that circulate about money in Korea and are not true.
 *
 * Nothing here is new. Every entry is a correction already published and
 * already sourced inside one of the guides, restated in one line and pointed
 * back at the guide that carries the statute. That constraint is the point: a
 * page that collects corrections is only worth reading if each one has been
 * checked once already, against the law rather than against another blog.
 *
 * `guide` is a slug path. The page renders an entry only when that guide is
 * live, so an entry whose guide is still scheduled simply waits — which keeps
 * the rule above honest and means this page grows on its own as guides publish.
 *
 * Adding one: find the correction in a guide first. If it is not in a guide, it
 * does not go here — write the guide.
 */

export interface Myth {
  /** The claim as people actually say it, in their words, not corrected. */
  claim: string;
  /** What is actually the case. One or two sentences. */
  reality: string;
  /** The authority the guide cites for the correction — statute, regulator, or
   *  a named published product. Short enough to read at a glance. */
  basis: string;
  /** Slug path of the guide carrying the sourced version. */
  guide: string;
}

export const MYTHS: Myth[] = [
  {
    claim: 'You can only send USD 50,000 a year out of Korea.',
    reality:
      'That ceiling applies to remittances whose source of funds you have not separately documented. A foreign resident who can document how the money was acquired — salary, declared income — may remit the documented amount. Organise the proof and the "limit" largely stops applying to you.',
    basis: 'Foreign Exchange Transaction Regulations',
    guide: '/cost-of-living/managing-money-in-korea-fx-remittance-cards/',
  },
  {
    claim: 'Someone in China can only receive USD 50,000 a year from abroad.',
    reality:
      'That figure is an annual facilitation quota for an individual in China settling foreign currency into renminbi or buying foreign currency — a quota on conversion, not a ceiling on what may arrive. SAFE\u2019s own position is that a genuine current-account transaction can be processed above it against documents, and that reading it as a personal annual maximum is wrong.',
    basis: 'SAFE annual facilitation quota',
    guide: '/banking/sending-money-from-korea-to-china/',
  },
  {
    claim:
      'Korea raised the undocumented remittance limit to USD 100,000, so that is your allowance now.',
    reality:
      'Not if you are a foreign resident. The higher annual figure applies to resident Korean nationals; foreign residents and non-residents sending through licensed small-amount remitters keep USD 5,000 per transaction and USD 50,000 per year. The route that actually lifts your ceiling is documenting how the money was acquired, not the headline change.',
    basis: 'Foreign Exchange Transaction Regulations',
    guide: '/banking/sending-money-from-korea-to-china/',
  },
  {
    claim: 'Money a US person receives from parents abroad is taxed as income.',
    reality:
      'A gift or bequest is generally not income to the recipient. Over USD 100,000 received from related non-resident alien donors in a tax year it becomes reportable on Form 3520 — an information return, not a tax bill. What is expensive is omitting it: 5% of the unreported amount per month, to a maximum of 25%.',
    basis: 'IRS Form 3520; IRC \u00a7 6039F',
    guide: '/banking/sending-money-from-korea-to-the-us/',
  },
  {
    claim:
      'Under ₩24M a year you can stay a freelancer; over ₩33M you have to register a business.',
    reality:
      'Neither figure exists in the law. The Income Tax Act requires a person who commences a business to register, and the test is continuity, repetition and business character — serving multiple clients on an ongoing, independent basis is a business at any amount.',
    basis: 'Income Tax Act',
    guide: '/business/freelancing-in-korea-legally/',
  },
  {
    claim: 'A foreigner needs a year of remaining stay to get a jeonse loan.',
    reality:
      'No industry-wide rule says so. KB’s published foreigner product draws the line at three months of visa validity from the loan date. A short remaining stay does make banks price the term and renewal risk conservatively, and individual lenders set stricter internal rules — but the universal one-year requirement is invented.',
    basis: 'KB published product terms',
    guide: '/loans/jeonse-loan-for-foreigners-explained/',
  },
  {
    claim: 'There is a list of visas that can get a Korean credit card.',
    reality:
      'There is no nationwide list of card-eligible residence statuses and no statutory minimum remaining stay. Two people on the same visa get different answers: the status is one input beside employment, income, length of domestic financial history, bureau data and existing debt.',
    basis: 'No statutory list exists',
    guide: '/banking/korean-check-card-vs-credit-card-for-foreigners/',
  },
  {
    claim: 'You need a NICE or KCB score of at least X for a credit card.',
    reality:
      'There is no published threshold, and any article quoting one is inventing it. Issuers use the bureau score alongside their own application scoring. Some screens do block below a number, but that is one issuer’s setting, not a national standard.',
    basis: 'No published threshold',
    guide: '/banking/korean-check-card-vs-credit-card-for-foreigners/',
  },
  {
    claim: 'Good credit at home counts for something in Korea.',
    reality:
      'It does not carry into NICE or KCB at all. To a Korean issuer you are not a bad risk but an unreadable one — a different problem with a different fix, which is why the realistic sequence starts with a check card rather than an appeal.',
    basis: 'NICE / KCB coverage',
    guide: '/banking/korean-check-card-vs-credit-card-for-foreigners/',
  },
  {
    claim: 'Checking your own credit score lowers it.',
    reality:
      'It does not. NICE states that inquiry records are not used in scoring, and KCB does not treat inquiries as a negative factor either. What does drag a score down is what sometimes follows a burst of applications: new credit actually drawn across several lenders in a short period.',
    basis: 'NICE and KCB published scoring factors',
    guide: '/loans/korean-credit-score-for-foreigners-nice-kcb/',
  },
  {
    claim: 'Keep your card utilisation between 30% and 50%.',
    reality:
      'There is no official utilisation band in the Korean models. The imported American rule of thumb is not what NICE and KCB publish as their factors, and following it precisely buys nothing.',
    basis: 'NICE / KCB published weights',
    guide: '/loans/korean-credit-score-for-foreigners-nice-kcb/',
  },
  {
    claim:
      'Lenders require six to twelve months in your job, or a year of visa left.',
    reality:
      'There is no industry-wide legal requirement of either. Published products differ enormously — one current savings-bank product accepts applicants with as little as one month of employment. The requirement you were quoted belongs to whoever quoted it.',
    basis: 'Published lender product terms',
    guide: '/loans/personal-credit-loan-requirements-korea/',
  },
  {
    claim: 'Once you borrow from a savings bank you can never go back to a bank.',
    reality:
      'Refinancing turns on your current file — score recovery, tenure, income growth, principal reduction, no delinquencies — not on where you borrowed before. Korea runs loan-switching infrastructure precisely so borrowers can move to better terms. The mistake is entering without a plan, not entering.',
    basis: 'Financial Consumer Protection Act; loan-switching system',
    guide: '/loans/savings-banks-and-capital-companies-korea/',
  },
  {
    claim: 'A company car lease is fully deductible.',
    reality:
      'The depreciation-equivalent portion of the lease payment is capped at ₩8,000,000 per vehicle per year, with the excess carried forward. Without a driving log, total vehicle costs above ₩15,000,000 are only partly recognised — and business-use insurance is a condition of the deduction at all.',
    basis: 'Corporate Tax Act art. 27-2 and Enforcement Decree art. 50-2',
    guide: '/cars/car-lease-in-korea-for-foreigners-real-cost/',
  },
  {
    claim: 'An apostille means my country is recognised for licence exchange.',
    reality:
      'Two unrelated layers. An apostille or embassy certification verifies that your licence is genuine. Recognition is a separate determination of whether your country exchanges with Korea without testing. You can hold a perfect apostille and still sit the written test.',
    basis: 'KOROAD exchange rules and recognised-country list',
    guide: '/cars/getting-a-korean-drivers-license-license-exchange/',
  },
  {
    claim: 'The D-8 capital has to sit in the account until the visa issues.',
    reality:
      'The capital exists to be spent on the business — office deposit, fit-out, equipment, inventory, payroll. What reviews want is explainability: contracts, tax invoices, transfers and payroll tying each outgoing to the stated business. Draining it to a personal account is what kills applications, not spending it.',
    basis: 'Foreign Investment Promotion Act; immigration review practice',
    guide: '/business/d-8-investor-visa-korea-requirements/',
  },
  {
    claim: 'Limited accounts have statutory "stage 1" and "stage 2" tiers.',
    reality:
      'That taxonomy is not a statutory tier system shared by all banks. It generalises some institutions’ internal product structures into an industry standard that does not exist — which is why the branch you walk into may not recognise the terms you arrived with.',
    basis: 'No statutory tier system',
    guide: '/banking/korean-limited-accounts-hando-gyejwa-explained/',
  },
  {
    claim: '90% 환율우대 means 90% off the exchange rate.',
    reality:
      'It discounts the bank’s margin, not the rate. The rate you are given is where almost all the cost sits, so a waived ₩5,000 fee beside a worse rate on a large transfer is a rounding error against the spread.',
    basis: 'Bank FX margin disclosure',
    guide: '/banking/how-to-send-money-from-korea-abroad/',
  },
  {
    claim: 'Probation does not count towards severance.',
    reality:
      'It counts. The employment relationship existed during it, so an employer excluding a three-month probation from the service calculation is applying a rule that is not there.',
    basis: 'Employee Retirement Benefit Security Act',
    guide: '/employment/severance-pay-and-retirement-pensions-korea/',
  },
  {
    claim: 'Home internet discounts peak at month 13, 18 or 24.',
    reality:
      'There is no national rule setting any of those months. What you can recover on early termination varies by discount, elapsed time, product, bundle and the terms in force when you signed — which is why the number has to come from your own contract.',
    basis: 'Carrier contract terms',
    guide: '/cost-of-living/korean-home-internet-the-36-month-total/',
  },
];
