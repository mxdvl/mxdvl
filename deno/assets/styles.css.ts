import init, {
	transform,
} from "https://unpkg.com/lightningcss-wasm@1.14.0/index.js";

await init();

const HORIZONTAL_GRID = 18;
const BASE = 6;

const colours = {
	orange: "lch(66% 120 54)",
	teal: "lch(60% 72 204)",
	lightestGreen: "lch(98% 6 216)",
	lightGreen: "lch(90% 12 216)",
	darkGreen: "lch(18% 24 216)",
	darkestGreen: "lch(9% 24 216)",
} as const;

const theme_names = ["light", "dark"] as const;
const colour_themes = {
	light: {
		"--earth": colours.darkGreen,
		"--clouds": colours.lightestGreen,
		"--skies": colours.lightGreen,
	},
	dark: {
		"--earth": colours.lightestGreen,
		"--clouds": colours.darkGreen,
		"--skies": colours.darkestGreen,
	},
};

const getVariables = (theme: keyof typeof colour_themes) =>
	Object.entries(colour_themes[theme])
		.map(([key, value]) => `${key}: ${value};`)
		.join("\n");

const themes = `:root {
	--ocean: ${colours.teal};
	--glint: ${colours.orange};
}

${theme_names
	.map((theme) => {
		return `@media (prefers-color-scheme: ${theme}) {
			:root {
				${getVariables(theme)}
			}
		}
	`;
	})
	.join("\n")}

${theme_names
	.map((theme) => {
		return `.${theme} {
			${getVariables(theme)}
		}
	`;
	})
	.join("\n")}
`;

const grid = Array.from({ length: 10 }, (_, i) => (i + 3) * BASE)
	.map((size) => {
		const px = Math.ceil(HORIZONTAL_GRID * (size + 1));
		return `
@media screen and (min-width: ${Math.ceil(px / 16)}em) {
	#grid {
		--width: ${size};
	}
}`;
	})
	.join("\n");

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

	return `/** Generated in ${Math.ceil(
		performance.now() - start
	)}ms @ ${new Date().toISOString()} */\n\n${css}`;
};

if (Deno.args[0] === "dev") {
	const build_and_write = async () => {
		const css = await build();
		Deno.writeTextFile(
			new URL("./static/styles.css", import.meta.url),
			css
		);
	};
	let timeout = setTimeout(build_and_write, 1);
	for await (const event of Deno.watchFs("./deno/assets")) {
		if (event.paths.some((path) => path.endsWith("/base.css"))) {
			clearTimeout(timeout);
			timeout = setTimeout(build_and_write, 24);
		}
	}
} else if (import.meta.main) {
	const css = await build();
	Deno.writeTextFile(new URL("./static/styles.css", import.meta.url), css);
}
