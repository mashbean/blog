import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  lead: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  coverPreset: z.string().optional(),
  coverPrompt: z.string().optional(),
  coverNegativePrompt: z.string().optional(),
  lang: z.string().optional(),
  canonicalURL: z.string().url().optional(),
  author: z.string().optional(),
  series: z.string().optional(),
  seriesOrder: z.number().int().positive().optional(),
  slug: z.string().optional(),
  legacyPaths: z.array(z.string()).optional(),
  contentHash: z.string().optional(),
  signature: z.string().optional(),
  signer: z.string().optional(),
  signatureVersion: z.string().optional(),
  source: z.string().optional(),
  sourceId: z.string().optional(),
  qualityTier: z.string().optional(),
  contentType: z.string().optional(),
  era: z.string().optional()
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: postSchema
});

const facebook = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/facebook" }),
  schema: postSchema
});

export const collections = { blog, facebook };
