import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "vite-imagetools";
import { defaultDirectives } from "./src/lib/picture";
import type { ServerOptions, UserConfigFn } from "vite";
import { readFile } from "node:fs/promises";

const get_certificate = async () => {
	try {
		return {
			https: {
				key: await readFile(".cert/key.pem"),
				cert: await readFile(".cert/cert.pem"),
			},
			proxy: {},
		} satisfies ServerOptions;
	} catch (error) {
		console.warn("Failed to load SSL certificates. Did you run 'pnpm cert'?");
		return undefined;
	}
};

const config: UserConfigFn = async ({ command }) => ({
	plugins: [sveltekit(), imagetools({ defaultDirectives })],
	server: command === "serve" ? await get_certificate() : undefined,
});

export default config;
