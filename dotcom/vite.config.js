import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "vite-imagetools";
import { defaultDirectives } from "./src/lib/picture";

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), imagetools({ defaultDirectives })],
};

export default config;
