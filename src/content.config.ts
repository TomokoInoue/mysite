import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
	// Load Markdown and MDX files in the `src/content/posts/` directory.
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		titleKo: z.string(),
  titleJa: z.string(),
		year: z.string(),
		month: z.string(),
		day: z.string(),
		weekKo: z.string(),
		weekJa: z.string(),
		articleKo: z.string(),
		articleJa: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

export const collections = { posts };
