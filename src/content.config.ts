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
    /** Official sources backing every figure in the post. Required. */
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
    /** Optional FAQ block, rendered on-page and as FAQPage JSON-LD. */
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
