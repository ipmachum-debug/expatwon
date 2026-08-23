export interface CategoryMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'banking',
    title: 'Banking in Korea',
    shortTitle: 'Banking',
    description:
      'Opening a bank account, sending money abroad, and getting a card as a foreigner in Korea.',
  },
  {
    slug: 'loans',
    title: 'Loans & Credit',
    shortTitle: 'Loans',
    description:
      'How loans and credit scores work for foreigners in Korea: eligibility, rates, and required documents.',
  },
  {
    slug: 'cars',
    title: 'Cars in Korea',
    shortTitle: 'Cars',
    description:
      'Leasing, installment financing, and insuring a car in Korea as a foreign resident.',
  },
  {
    slug: 'business',
    title: 'Business & Tax',
    shortTitle: 'Business',
    description:
      'Registering a sole proprietorship or corporation in Korea, and the taxes that come with it.',
  },
  {
    slug: 'insurance',
    title: 'Insurance',
    shortTitle: 'Insurance',
    description:
      'Health insurance (NHIS), car insurance, and travel insurance for foreigners living in Korea.',
  },
  {
    slug: 'cost-of-living',
    title: 'Cost of Living',
    shortTitle: 'Cost of Living',
    description:
      'What life in Korea actually costs: rent, jeonse and wolse, phone plans, utilities, and food.',
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function getCategory(slug: string): CategoryMeta {
  const found = CATEGORIES.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown category: ${slug}`);
  return found;
}
