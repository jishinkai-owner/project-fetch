import type { AstroIntegration } from "astro";
import { writeFileSync, readdirSync, statSync } from "fs";
import { normalize, resolve, relative } from "path";
import { fileURLToPath } from "url";

const fs2sitemap = (
    options:
        | {
              enabled?: boolean;
              filename?: string;
              ignoreFolders?: string[];
          }
        | undefined
): AstroIntegration => {
    let site: URL;
    let enabled = options?.enabled ?? true;
    return {
        name: "jishinkaihp/fs2sitemap",
        hooks: {
            "astro:config:done": async ({ config, logger }) => {
                const cfg_site = config.site;
                if (!cfg_site) {
                    logger.warn(
                        "`site` in astro.config requied to generate sitemap. Skipping."
                    );
                    enabled = false;
                    return;
                }
                site = new URL(config.base, cfg_site);
            },
            "astro:build:done": async ({ dir, logger }) => {
                if (!enabled) return;
                const destinationDir = fileURLToPath(dir);
                const outputFileName = resolve(
                    destinationDir,
                    options?.filename ?? "sitemap.xml"
                );
                const ignoreFolders = options?.ignoreFolders ?? [];

                const _getDirectories = (srcpath: string): string[] => {
                    srcpath = srcpath.endsWith("\\") ? srcpath : srcpath + "\\";
                    return readdirSync(srcpath)
                        .filter((path) => !ignoreFolders.includes(path))
                        .map((file) => normalize(srcpath + file))
                        .map((path) => {
                            return statSync(path).isDirectory()
                                ? _getDirectories(path)
                                : [path];
                        })
                        .reduce((a, b) => a.concat(b), []);
                };

                const files = _getDirectories(destinationDir);

                const formatted = files
                    .map((f) => {
                        let url = new URL(relative(destinationDir, f), site)
                            .pathname;
                        url = new URL(site.pathname + url, site).href;
                        url = normalize(url);
                        url = url
                            .replace(/\/index\.html$/, "/")
                            .replace(/\.html$/, "");
                        return `<url><loc>${url}</loc></url>`;
                    })
                    .join("");

                const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${formatted}</urlset>`;

                try {
                    writeFileSync(outputFileName, xml);
                    logger.info(`XML file generated at ${outputFileName}`);
                } catch {
                    logger.error("Failed to generate sitemap.");
                }
            },
        },
    };
};

export default fs2sitemap;

/*
const generateSitemap = (
    sourceFolder,
    ignoreFolders,
    domain,
    outputFileName
) => {
    const _flatten = (lists = []) => lists.reduce((a, b) => a.concat(b), []);

    const _getDirectories = (srcpath = []) => {
        return fs
            .readdirSync(srcpath)
            .filter((path) => !ignoreFolders.includes(path))
            .map((file) => path.join(srcpath, file))
            .filter((path) => fs.statSync(path).isDirectory());
    };

    const _getDirectoriesRecursive = (srcpath) => [
        srcpath,
        ..._flatten(_getDirectories(srcpath).map(_getDirectoriesRecursive)),
    ];

    const _grabFolders = (sourceFolder) =>
        _getDirectoriesRecursive(sourceFolder).map((f) =>
            f.replace(`${sourceFolder}`, "").replace(`${sourceFolder}/`, "")
        );

    const folders = _grabFolders(sourceFolder);
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const formattedFolders = folders
        .map(
            (f) => `
    <url>
        <loc>${domain}${f}</loc>
        <lastmod>${formattedDate}</lastmod>
    </url>`
        )
        .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${formattedFolders}
</urlset>`;

    fs.writeFile(outputFileName, xml, (err) => {
        if (err) {
            console.error(err);
        }
        console.log(`XML file generated at ${outputFileName}`);
    });
};

module.exports = generateSitemap;
*/
