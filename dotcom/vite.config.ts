import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "vite-imagetools";
import { defaultDirectives } from "./src/lib/picture";
import type { UserConfig } from "vite";

const config = {
	plugins: [sveltekit(), imagetools({ defaultDirectives })],
} satisfies UserConfig;

export default config;
