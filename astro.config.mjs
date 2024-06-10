import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import fs2sitemap from "./integrations/sitemap.ts";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
    integrations: [
        mdx(),
        fs2sitemap({
            ignoreFolders: [
                "_astro",
                "robots.txt",
                "favicon.ico",
            ],
        }),
    ],
    markdown: {
        remarkPlugins: [
            [remarkToc, { heading: "目次|もくじ|Contents|TOC" }],
            remarkMath,
            remarkAlert,
            [remarkRehype, { footnoteLabel: "脚注" }],
        ],
        rehypePlugins: [rehypeKatex],
    },
    build: {
        format: "preserve",
    },
    site: "https://jishinkaihp.web.fc2.com",
});
