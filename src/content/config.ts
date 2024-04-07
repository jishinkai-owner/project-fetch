import { z, defineCollection } from 'astro:content';

const yamaCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
    }),
});

const tabiCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
    }),
});

const tsuriCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
    }),
});

const otherCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string().optional(),
        type: z.string().optional(),
        typeImg: image().optional(),
    }),
});

export const collections = {
    'yama': yamaCollection,
    'tabi': tabiCollection,
    'tsuri': tsuriCollection,
    'other': otherCollection,
};