import { transform } from "../deps/css.ts";
import { grid } from "./grid.ts";
import { themes } from "./themes.ts";

const version = (major: number, minor = 0, patch = 0) =>
	(major << 16) | (minor << 8) | (patch << 4);

export const build = async (extra?: string[]) => {
	const start = performance.now();

	const base = await Deno.readTextFile(
		new URL("./base.css", import.meta.url)
	);

	const { code } = transform({
		filename: "styles.css",
		code: new TextEncoder().encode(
			[themes, base, grid].concat(extra ?? []).join("\n")
		),
		minify: false,
		targets: {
			chrome: version(91),
		},
	});

	const css = new TextDecoder().decode(code);

	const duration = Math.ceil(performance.now() - start);

	console.info(`Compiled CSS in ${duration}ms`);
	return css;
};
