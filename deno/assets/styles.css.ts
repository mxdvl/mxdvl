import init, {
	transform,
} from "https://unpkg.com/lightningcss-wasm@1.14.0/index.js";
import { grid } from "./grid.ts";
import { themes } from "./themes.ts";

await init();

const version = (major: number, minor = 0, patch = 0) =>
	(major << 16) | (minor << 8) | (patch << 4);

export const build = async () => {
	const start = performance.now();

	const base = await Deno.readTextFile(
		new URL("./base.css", import.meta.url)
	);

	const { code } = transform({
		filename: "styles.css",
		code: new TextEncoder().encode([themes, base, grid].join("\n")),
		minify: false,
		targets: {
			chrome: version(91),
		},
	});

	const css = new TextDecoder().decode(code);

	const duration = Math.ceil(performance.now() - start);

	return `/** Generated in ${duration}ms @ ${new Date().toISOString()} */\n\n${css}`;
};
