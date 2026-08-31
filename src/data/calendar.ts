/**
 * The Korean money year, as deadlines.
 *
 * Every date here is statutory and stable across years — they sit in the
 * Value-Added Tax Act, the Income Tax Act and the Local Tax Act, not in an
 * annual announcement. Rates move; these dates do not. That is what makes the
 * page worth returning to rather than reading once.
 *
 * When a deadline falls on a weekend or a public holiday it rolls to the next
 * business day (Framework Act on National Taxes, art. 5) — noted once on the
 * page rather than repeated on every row.
 *
 * `link` is a slug path, rendered only when the target is published: drafts
 * resolve to 404 until their publishDate, so the page guards on the collection.
 */

/** Last checked against the current year's rules. Rendered on the page. */
export const LAST_VERIFIED = '2026-08-31';

export type Audience = 'employee' | 'freelancer' | 'business' | 'car' | 'property';

export interface CalendarItem {
  /** Day or range within the month. */
  when: string;
  /**
   * The day the obligation actually bites, 1-31, for countdown purposes. The
   * last day of the window in almost every case -- a filing period that runs
   * 1-25 is only urgent on the 25th. Omitted where there is no fixed day
   * (payroll events), which suppresses the countdown for that row.
   */
  dueDay?: number;
  title: string;
  korean: string;
  who: Audience[];
  /** What actually happens. One sentence, concrete. */
  detail: string;
  /** The caveat that belongs beside the line: what missing it costs, or what the headline rule leaves out. */
  note?: string;
  link?: string;
}

export interface CalendarMonth {
  month: number;
  label: string;
  items: CalendarItem[];
}

export const AUDIENCES: { id: Audience; label: string; hint: string }[] = [
  { id: 'employee', label: 'Employee', hint: 'On a payroll, tax withheld monthly' },
  { id: 'freelancer', label: 'Freelancer / 3.3%', hint: 'Paid gross, 3.3% withheld' },
  { id: 'business', label: 'Business owner', hint: 'Sole proprietor or corporation' },
  { id: 'car', label: 'Car owner', hint: 'A vehicle registered to you' },
  { id: 'property', label: 'Property owner', hint: 'A home or land in your name' },
];

export const CALENDAR: CalendarMonth[] = [
  {
    month: 1,
    label: 'January',
    items: [
      {
        when: '1',
        title: 'New minimum wage takes effect',
        korean: '최저임금 적용',
        dueDay: 1,
        who: ['employee', 'business'],
        detail:
          'The rate announced the previous August applies from this date. It sets the hourly floor and, through it, the weekly holiday allowance.',
        link: '/employment/hiring-your-first-employee-in-korea/',
      },
      {
        when: '15',
        title: 'Year-end settlement service opens',
        korean: '연말정산 간소화 서비스',
        dueDay: 15,
        who: ['employee'],
        detail:
          'Hometax publishes the deduction data your employer needs. What the service does not hold — overseas tuition, some medical, donations — you collect yourself.',
      },
      {
        when: '1–25',
        title: 'VAT return, second period',
        korean: '부가가치세 확정신고 (2기)',
        dueDay: 25,
        who: ['business'],
        detail:
          'Covers July through December. Simplified taxpayers file once a year and this is that filing, even when no VAT is payable.',
        note: 'Filing late is penalised on its own, separately from the tax',
        link: '/business/korean-vat-for-small-business-owners/',
      },
      {
        when: '16–31',
        title: 'Vehicle tax annual prepayment',
        korean: '자동차세 연납 신청·납부',
        dueDay: 31,
        who: ['car'],
        detail:
          'Pay the full year up front instead of in two instalments and a discount applies. The statutory formula applies a 5% rate to the tax covering the rest of the year — which for a January payment works out at roughly 4.58% off the annual bill, not a flat 5%.',
        note:
          'January is the largest discount, not the only window: March, June and September also allow annual payment, each discounting less because less of the year is left',
        link: '/cars/car-ownership-taxes-and-costs-korea/',
      },
    ],
  },
  {
    month: 2,
    label: 'February',
    items: [
      {
        when: 'Payroll',
        title: 'Year-end settlement lands in your salary',
        korean: '연말정산 정산분 반영',
        who: ['employee'],
        detail:
          'Over-withheld tax is refunded, under-withheld tax is collected. February pay is the most volatile of the year, and it is not an error.',
      },
    ],
  },
  {
    month: 3,
    label: 'March',
    items: [
      {
        when: '31',
        title: 'Corporate tax return',
        korean: '법인세 신고',
        dueDay: 31,
        who: ['business'],
        detail:
          'Due within three months of the fiscal year end, which for most Korean companies means a December close and a March deadline.',
        link: '/business/sole-proprietor-vs-corporation-korea/',
      },
    ],
  },
  {
    month: 4,
    label: 'April',
    items: [
      {
        when: '1–25',
        title: 'VAT preliminary return, Q1',
        korean: '부가가치세 예정신고 (1분기)',
        dueDay: 25,
        who: ['business'],
        detail:
          'Corporations file quarterly. Individual businesses are usually issued a notice to pay instead of filing.',
        link: '/business/korean-vat-for-small-business-owners/',
      },
      {
        when: 'Payroll',
        title: 'Health insurance annual settlement',
        korean: '건강보험료 연말정산',
        who: ['employee'],
        detail:
          'Last year’s premiums are reconciled against your actual income and the difference appears in April pay. A raise last year means a bill this month.',
        link: '/insurance/nhis-korean-health-insurance-for-foreigners/',
      },
    ],
  },
  {
    month: 5,
    label: 'May',
    items: [
      {
        when: '1–31',
        title: 'Comprehensive income tax return',
        korean: '종합소득세 신고',
        dueDay: 31,
        who: ['freelancer', 'business'],
        detail:
          'The deadline foreign freelancers miss most. If you were paid with 3.3% withheld, this filing is how you reclaim the over-withholding — it is not automatic.',
        note: 'No filing means no refund, and penalties on top if tax was owed',
        link: '/business/freelancing-in-korea-legally/',
      },
      {
        when: '31',
        title: 'Local income tax return',
        korean: '지방소득세 신고',
        dueDay: 31,
        who: ['freelancer', 'business'],
        detail:
          'Ten percent of the income tax above, filed separately to the local authority. Same deadline, different system, easy to forget.',
      },
    ],
  },
  {
    month: 6,
    label: 'June',
    items: [
      {
        when: '1',
        title: 'Property tax assessment date',
        korean: '재산세 과세기준일',
        dueDay: 1,
        who: ['property'],
        detail:
          'Whoever owns the property on this one day owes the full year of property tax. Closing a sale on 31 May and on 2 June are different decisions.',
      },
      {
        when: '16–30',
        title: 'Vehicle tax, first instalment',
        korean: '자동차세 1기분',
        dueDay: 30,
        who: ['car'],
        detail: 'Covers January through June. Skipped if you prepaid in January.',
        link: '/cars/car-ownership-taxes-and-costs-korea/',
      },
    ],
  },
  {
    month: 7,
    label: 'July',
    items: [
      {
        when: '1–25',
        title: 'VAT return, first period',
        korean: '부가가치세 확정신고 (1기)',
        dueDay: 25,
        who: ['business'],
        detail: 'Covers January through June, for taxpayers on the standard regime.',
        note: 'Filing late is penalised on its own, separately from the tax',
        link: '/business/korean-vat-for-small-business-owners/',
      },
      {
        when: '16–31',
        title: 'Property tax on buildings and housing',
        korean: '재산세 (건축물·주택 1기분)',
        dueDay: 31,
        who: ['property'],
        detail:
          'Buildings are billed in full now. Housing splits across July and September when the bill is large enough, and is billed once in July when it is not.',
      },
    ],
  },
  {
    month: 8,
    label: 'August',
    items: [
      {
        when: 'By 5',
        title: 'Next year’s minimum wage announced',
        korean: '최저임금 고시',
        dueDay: 5,
        who: ['employee', 'business'],
        detail:
          'The figure that takes effect on 1 January is published now, which is when payroll budgeting for the following year actually starts.',
        link: '/employment/hiring-your-first-employee-in-korea/',
      },
    ],
  },
  {
    month: 9,
    label: 'September',
    items: [
      {
        when: '16–30',
        title: 'Property tax on land and housing',
        korean: '재산세 (토지·주택 2기분)',
        dueDay: 30,
        who: ['property'],
        detail: 'Land is billed in full now, alongside the second half of any split housing bill.',
      },
    ],
  },
  {
    month: 10,
    label: 'October',
    items: [
      {
        when: '1–25',
        title: 'VAT preliminary return, Q3',
        korean: '부가가치세 예정신고 (3분기)',
        dueDay: 25,
        who: ['business'],
        detail: 'The second of the two quarterly filings for corporations.',
        link: '/business/korean-vat-for-small-business-owners/',
      },
    ],
  },
  {
    month: 11,
    label: 'November',
    items: [
      {
        when: '30',
        title: 'Income tax interim prepayment due',
        korean: '종합소득세 중간예납 고지·납부',
        dueDay: 30,
        who: ['freelancer', 'business'],
        detail:
          'Roughly half of last year’s income tax, charged in advance against next May’s return and covering the January–June period. For most people the National Tax Service calculates it and issues a notice in early November, so there is nothing to file — only to pay by the 30th.',
        note:
          'If your first-half income came in well below last year’s, certain cases allow you to file an estimate instead of paying the notice',
      },
    ],
  },
  {
    month: 12,
    label: 'December',
    items: [
      {
        when: '1–15',
        title: 'Comprehensive real estate tax',
        korean: '종합부동산세',
        dueDay: 15,
        who: ['property'],
        detail:
          'A national tax on holdings above the threshold, charged on top of the local property tax already paid in July and September.',
      },
      {
        when: '16–31',
        title: 'Vehicle tax, second instalment',
        korean: '자동차세 2기분',
        dueDay: 31,
        who: ['car'],
        detail: 'Covers July through December, and closes the vehicle tax year.',
        link: '/cars/car-ownership-taxes-and-costs-korea/',
      },
    ],
  },
];
