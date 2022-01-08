import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";
import { mdsvex } from "mdsvex";

const extensions = [".svelte", ".md"];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions,
	preprocess: [preprocess(), mdsvex({ extensions })],

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter(),
		target: "#svelte",
		headers: {
			host: 'X-Forwarded-Host',
			protocol: 'X-Forwarded-Proto'
		},
		prerender: {
			entries: ["/hi", "/allo", "/error", "/erreur"],
		},
	},
};

export default config;
