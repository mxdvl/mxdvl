import { sveltekit } from "@sveltejs/kit/vite";
import type { ConfigEnv, UserConfigFn } from "vite";
import { readFile } from "node:fs/promises";

const get_certificate = async (command: ConfigEnv["command"]) => {
	try {
		return command === "serve"
			? {
					https: {
						key: await readFile(".cert/key.pem"),
						cert: await readFile(".cert/cert.pem"),
					},
			  }
			: undefined;
	} catch (error) {
		console.warn("Failed to load SSL certificates. Did you run 'pnpm cert'?");
		return undefined;
	}
};

const config: UserConfigFn = async ({ command }) => ({
	plugins: [sveltekit()],
	server: await get_certificate(command),
});

export default config;
