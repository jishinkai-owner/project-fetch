import { z, defineCollection } from 'astro:content';

const yamaCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
    }),
});

const otherCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        type: z.string().optional(),
        typeImg: z.string().optional(),
    }),
});

export const collections = {
    'yama': yamaCollection,
    'other': otherCollection,
};