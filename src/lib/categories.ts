export interface CategoryMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  /** Tailwind classes for the category chip (badge). Full literals so JIT picks them up. */
  chip: string;
  /** Tailwind classes for the icon tile background/foreground. */
  tile: string;
  /**
   * Category identity colours, emitted as CSS custom properties on the page
   * root so every component (rules, table headers, bar fills, callouts, step
   * markers) picks up the category without per-page Tailwind classes.
   *
   * Chosen for editorial distinctness, not as a chart legend: the six never
   * appear together in one visualisation, and every chip carries the category
   * name in text, so identity is never colour-alone. Validated on a white
   * surface — every `accent` and `ink` clears 3:1 contrast.
   */
  accent: string;
  ink: string;
  tint: string;
  line: string;
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
    chip: 'bg-blue-50 text-blue-700',
    tile: 'bg-blue-50 text-blue-600',
    accent: '#2563eb',
    ink: '#1d4ed8',
    tint: '#eff6ff',
    line: '#bfdbfe',
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
    accent: '#059669',
    ink: '#047857',
    tint: '#ecfdf5',
    line: '#a7f3d0',
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
    accent: '#d97706',
    ink: '#b45309',
    tint: '#fffbeb',
    line: '#fde68a',
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
    accent: '#7c3aed',
    ink: '#6d28d9',
    tint: '#f5f3ff',
    line: '#ddd6fe',
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
    accent: '#e11d48',
    ink: '#be123c',
    tint: '#fff1f2',
    line: '#fecdd3',
    icon: '<path d="M12 3c3 2 6 3 8 3 0 8-3 12.5-8 15-5-2.5-8-7-8-15 2 0 5-1 8-3Z"/><path d="m9 12 2 2 4-4.5"/>',
  },
  {
    slug: 'cost-of-living',
    title: 'Cost of Living',
    shortTitle: 'Cost of Living',
    description:
      'What life in Korea actually costs: rent, jeonse and wolse, phone plans, utilities, and food.',
    chip: 'bg-cyan-50 text-cyan-700',
    tile: 'bg-cyan-50 text-cyan-600',
    accent: '#0891b2',
    ink: '#0e7490',
    tint: '#ecfeff',
    line: '#a5f3fc',
    icon: '<path d="M3 11 12 4l9 7M5.5 9.5V20h13V9.5M9.5 20v-6h5v6"/>',
  },
  {
    slug: 'employment',
    title: 'Work & Employment',
    shortTitle: 'Employment',
    description:
      'Contracts, payroll, working hours, the four major insurances, and changing jobs as a foreign worker in Korea.',
    chip: 'bg-lime-50 text-lime-700',
    tile: 'bg-lime-50 text-lime-600',
    accent: '#4d7c0f',
    ink: '#3f6212',
    tint: '#f7fee7',
    line: '#d9f99d',
    icon: '<rect x="3" y="7.5" width="18" height="12.5" rx="2"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 13h18M10 13v2h4v-2"/>',
  },
  {
    slug: 'study',
    title: 'Studying in Korea',
    shortTitle: 'Study',
    description:
      'Coming to Korea to study Korean: the D-4 visa, choosing a school and city, and what a term actually costs.',
    chip: 'bg-fuchsia-50 text-fuchsia-700',
    tile: 'bg-fuchsia-50 text-fuchsia-600',
    accent: '#a21caf',
    ink: '#86198f',
    tint: '#fdf4ff',
    line: '#f5d0fe',
    icon: '<path d="M12 4 2 9l10 5 10-5-10-5Z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M22 9v5.5"/>',
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

/** CSS custom properties for a category, for `style={categoryVars(cat)}`. */
export function categoryVars(cat: CategoryMeta): string {
  return `--cat-accent:${cat.accent};--cat-ink:${cat.ink};--cat-tint:${cat.tint};--cat-line:${cat.line}`;
}

export function getCategory(slug: string): CategoryMeta {
  const found = CATEGORIES.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown category: ${slug}`);
  return found;
}

/**
 * Categories that have at least one published guide.
 *
 * A category is declared here before its first guide goes out — the guides are
 * written as drafts with a future publishDate, and the category has to exist
 * for the schema to accept them. Left alone, that puts an empty listing page
 * in the sitemap and an empty tab in the nav: a page promising a topic and
 * delivering nothing, which is exactly the "thin content" a reviewer counts
 * against the site.
 *
 * So the nav and the category route both filter through this. The page and the
 * tab appear on the morning the first guide publishes, and nothing has to be
 * remembered on the day.
 */
export function categoriesWithPosts(
  posts: { data: { category: string; draft?: boolean } }[],
): CategoryMeta[] {
  const live = new Set(posts.filter((p) => !p.data.draft).map((p) => p.data.category));
  return CATEGORIES.filter((c) => live.has(c.slug));
}
