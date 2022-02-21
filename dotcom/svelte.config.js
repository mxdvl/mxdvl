import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-auto";
import { mdsvex } from "mdsvex";

const extensions = [".svelte", ".md"];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions,
	preprocess: [preprocess(), mdsvex({ extensions })],

	kit: {
		adapter: adapter(),
		prerender: {
			entries: ["/hi", "/allô", "/error", "/erreur"],
		},
	},
};

export default config;
