module.exports = {
    extends: ["plugin:astro/jsx-a11y-recommended", "plugin:astro/recommended"],
    overrides: [
        {
            files: ["*.astro"],
            processor: "astro/client-side-ts",
            parser: "astro-eslint-parser",
            parserOptions: {
                parser: "@typescript-eslint/parser",
                extraFileExtensions: [".astro"],
            },
        },
        {
            files: ["*.js", "*.ts", "*.mjs"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                sourceType: "module",
                ecmaVersion: 2020,
            },
        }
    ],
};
