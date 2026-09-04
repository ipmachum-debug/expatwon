import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { CATEGORY_SLUGS } from './lib/categories';

/**
 * SEO lint lives here: title ≤ 60 chars, description ≤ 155 chars.
 * A post that violates either limit fails `npm run build`.
 */
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(10).max(60),
    description: z.string().min(50).max(155),
    category: z.enum(CATEGORY_SLUGS as [string, ...string[]]),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    tags: z.array(z.string().min(1)).min(1),
    /**
     * Official sources backing every figure in the post. Required.
     *
     * Three tiers, and the tier decides the depth of the link:
     *
     *   statute or decree  → Korea Law Information Center, deep-linked to the
     *                        article or appendix, and named in the label
     *                        ("… art. 16-10(3)", "… Appendix 3")
     *   procedure or rate  → the agency's own page for that procedure,
     *                        deep-linked (NPS practice guide, NHIS EDI form)
     *   the body itself    → root URL, and only where no stable deep link
     *                        exists for what is being cited
     *
     * A guessed deep link is worse than a root URL: it looks precise and
     * rots. If the exact page cannot be confirmed, cite the body and say in
     * the label what it is being cited for.
     *
     * Never carry tracking parameters into a url. Strip `utm_*` and anything
     * else appended by whatever tool surfaced the page.
     */
    sources: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        }),
      )
      .min(1),
    /** True when the post contains affiliate links (adds a disclosure line). */
    affiliate: z.boolean().default(false),
    /** Optional "at a glance" stat tiles rendered under the post header (max 4). */
    keyFacts: z
      .array(z.object({ label: z.string().max(28), value: z.string().max(32) }))
      .max(4)
      .optional(),
    /**
     * Change log for the post. One entry per substantive revision — a figure
     * that moved, a rule that changed, a correction. Never for typos or
     * wording. Rendered newest-first under the sources block.
     *
     *   revisions:
     *     - date: 2027-02-14
     *       change: 'Capital-region stress-rate floor 3.0% → 2.5%'
     *       source: 'https://www.fsc.go.kr/...'   # optional
     *
     * Every post carries at least its publication entry.
     */
    revisions: z
      .array(
        z.object({
          date: z.coerce.date(),
          change: z.string().min(3),
          source: z.string().url().optional(),
        }),
      )
      .optional(),
    /**
     * Layer 2 — the moving figures this guide depends on, by observation key.
     * The history lives in `src/data/observations/<key>.json`, never here: a
     * monthly audit appends one line to one file instead of editing every
     * article that quotes the number.
     *
     *   tracked: [minimum-wage, national-pension-rate]
     *
     * An unknown key fails `npm run lint:data`.
     */
    tracked: z.array(z.string().min(2)).optional(),
    /**
     * Layer 3 — first-party evidence backing this guide, by record id from
     * `src/data/evidence/<id>.json`. A screenshot of the actual filing, the
     * actual document list a bank asked for, the actual bill.
     */
    evidence: z.array(z.string().min(2)).optional(),
    /**
     * When a human last checked this guide's figures against the source, as
     * opposed to when the file was last touched. `updatedDate` moves for a
     * typo; this does not.
     */
    lastVerified: z.coerce.date().optional(),
    /**
     * When it should next be checked. Derived from the tracked series where
     * it is absent — an annual figure that lands in January is worth checking
     * in January, not on a rolling twelve-month timer.
     */
    nextCheck: z.coerce.date().optional(),
    /** Optional FAQ block, rendered on-page and as FAQPage JSON-LD. */
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    /**
     * The other half of the day's pair, by slug. The morning pillar names the
     * afternoon supporting piece; the link renders only once the target is
     * actually published, so a pillar that goes out at 07:00 does not carry a
     * dead link to a guide that appears at 15:00.
     */
    pairedWith: z.string().min(3).optional(),
    /**
     * Which of the day's two runs releases this post. At two posts a day the
     * pillar goes out in the morning and the supporting piece in the
     * afternoon, so publishDate alone no longer identifies a post. Absent
     * means morning.
     */
    slot: z.enum(['am', 'pm']).default('am'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
