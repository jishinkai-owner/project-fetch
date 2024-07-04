import { z, defineCollection } from 'astro:content';

const common = {
    title: z.string().optional(),
    description: z.string().optional(),
    breadcrumbs: z.array(z.object({
        title: z.string(),
        href: z.string().regex(/^\/[A-Za-z0-9.-_/]+$/),
    })).default([]),
    datePublished: z.date().optional(),
    dateModified: z.date().optional(),
}

const yamaCollection = defineCollection({
    type: 'content',
    schema: z.object(common),
});

const tabiCollection = defineCollection({
    type: 'content',
    schema: z.object(common),
});

const tsuriCollection = defineCollection({
    type: 'content',
    schema: z.object(common),
});

const otherCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        ...common,
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