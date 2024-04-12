import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs["flat/recommended"],
	prettier,
	...svelte.configs["flat/prettier"],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		},
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
		rules: {
			"svelte/no-at-html-tags": "off",
		},
	},
	{
		files: ["src/routes/aoc/**"],
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"svelte/valid-compile": "warn",
		},
	},
	{
		ignores: ["build/", ".svelte-kit/", "package/"],
	},
];