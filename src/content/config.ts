import { z, defineCollection } from 'astro:content';

const yamaCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
    }),
});

export const collections = {
    'yama': yamaCollection,
};