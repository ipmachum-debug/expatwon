export interface CategoryMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  /** Tailwind classes for the category chip (badge). Full literals so JIT picks them up. */
  chip: string;
  /** Tailwind classes for the icon tile background/foreground. */
  tile: string;
  /** Inner SVG (paths) for a 24x24 stroke icon, rendered with set:html. */
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'banking',
    title: 'Banking in Korea',
    shortTitle: 'Banking',
    description:
      'Opening a bank account, sending money abroad, and getting a card as a foreigner in Korea.',
    chip: 'bg-sky-50 text-sky-700',
    tile: 'bg-sky-50 text-sky-600',
    icon: '<path d="M3 10h18M5 10V20m4-10v10m6-10v10m4-10v10M3 20h18M12 3l9 6H3l9-6Z"/>',
  },
  {
    slug: 'loans',
    title: 'Loans & Credit',
    shortTitle: 'Loans',
    description:
      'How loans and credit scores work for foreigners in Korea: eligibility, rates, and required documents.',
    chip: 'bg-emerald-50 text-emerald-700',
    tile: 'bg-emerald-50 text-emerald-600',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 1 1 0 3.5H9.5h4a1.75 1.75 0 1 1 0 3.5H9"/>',
  },
  {
    slug: 'cars',
    title: 'Cars in Korea',
    shortTitle: 'Cars',
    description:
      'Leasing, installment financing, and insuring a car in Korea as a foreign resident.',
    chip: 'bg-amber-50 text-amber-700',
    tile: 'bg-amber-50 text-amber-600',
    icon: '<path d="M5 13 6.5 8a2 2 0 0 1 1.9-1.4h7.2A2 2 0 0 1 17.5 8L19 13m-14 0h14m-14 0a2 2 0 0 0-2 2v3h2m14-5a2 2 0 0 1 2 2v3h-2m-14 0v2h3v-2m11 0v2h3v-2m-14 0h11M7.5 15.5h.01M16.5 15.5h.01"/>',
  },
  {
    slug: 'business',
    title: 'Business & Tax',
    shortTitle: 'Business',
    description:
      'Registering a sole proprietorship or corporation in Korea, and the taxes that come with it.',
    chip: 'bg-violet-50 text-violet-700',
    tile: 'bg-violet-50 text-violet-600',
    icon: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M12 11v2"/>',
  },
  {
    slug: 'insurance',
    title: 'Insurance',
    shortTitle: 'Insurance',
    description:
      'Health insurance (NHIS), car insurance, and travel insurance for foreigners living in Korea.',
    chip: 'bg-rose-50 text-rose-700',
    tile: 'bg-rose-50 text-rose-600',
    icon: '<path d="M12 3c3 2 6 3 8 3 0 8-3 12.5-8 15-5-2.5-8-7-8-15 2 0 5-1 8-3Z"/><path d="m9 12 2 2 4-4.5"/>',
  },
  {
    slug: 'cost-of-living',
    title: 'Cost of Living',
    shortTitle: 'Cost of Living',
    description:
      'What life in Korea actually costs: rent, jeonse and wolse, phone plans, utilities, and food.',
    chip: 'bg-teal-50 text-teal-700',
    tile: 'bg-teal-50 text-teal-600',
    icon: '<path d="M3 11 12 4l9 7M5.5 9.5V20h13V9.5M9.5 20v-6h5v6"/>',
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function getCategory(slug: string): CategoryMeta {
  const found = CATEGORIES.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown category: ${slug}`);
  return found;
}
