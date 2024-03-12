import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "vite-imagetools";
import { defaultDirectives } from "./src/lib/picture";
import type { ConfigEnv, UserConfigFn } from "vite";
import { readFile } from "node:fs/promises";

const get_certificate = async () => {
	try {
		return {
			https: {
				key: await readFile(".cert/key.pem"),
				cert: await readFile(".cert/cert.pem"),
			},
		};
	} catch (error) {
		console.warn("Failed to load SSL certificates. Did you run 'pnpm cert'?");
		return undefined;
	}
};

const config: UserConfigFn = async ({ command }) => ({
	plugins: [sveltekit(), imagetools({ defaultDirectives })],
	server: command === "build" ? undefined : await get_certificate(),
});

export default config;
