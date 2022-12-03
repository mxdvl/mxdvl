import preprocess from "svelte-preprocess";
import vercel from "@sveltejs/adapter-vercel";
import { mdsvex } from "mdsvex";

const extensions = [".svelte", ".md"];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions,
	preprocess: [preprocess(), mdsvex({ extensions })],

	kit: {
		adapter: vercel(),
		prerender: {
			entries: ["/hi", "/allô", "/error", "/erreur"],
		},
	},
};

export default config;
