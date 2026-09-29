import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './source/_posts' }),
  schema: z.object({
    title: z.string(),
    date: z.union([z.string(), z.date()]),
    updated: z.union([z.string(), z.date()]).optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.array(z.string())).default([]),
    abbrlink: z.union([z.string(), z.number()]).transform(String),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    keywords: z.union([z.string(), z.array(z.string())]).optional(),
    index_img: z.string().optional(),
    banner_img: z.string().optional(),
  }),
});

export const collections = { posts };
