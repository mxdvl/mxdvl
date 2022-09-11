import init, {
	transform,
} from "https://unpkg.com/lightningcss-wasm@1.14.0/index.js";

const { startTime } = performance.mark("start");

await init();

const breakpoints = [360, 620, 740, 960, 1200, 1400];

const HORIZONTAL_GRID = 18;
const BASE = 6;

const base = await Deno.readTextFile(
	new URL("./static/base.css", import.meta.url)
);

const colours = {
	orange: "lch(66% 120 54)",
	teal: "lch(60% 72 204)",
	lightestGreen: "lch(98% 6 216)",
	lightGreen: "lch(90% 12 216)",
	darkGreen: "lch(18% 24 216)",
	darkestGreen: "lch(9% 24 216)",
};

const themes = `:root {
	--ocean: ${colours.teal};
	--glint: ${colours.orange};
}

.light {
	--earth: ${colours.darkGreen};
	--clouds: ${colours.lightestGreen};
	--skies: ${colours.lightGreen};
}

.dark {
	--earth: ${colours.lightestGreen};
	--clouds: ${colours.darkGreen};
	--skies: ${colours.darkestGreen};
}
`;

const grid = Array.from({ length: 10 }, (_, i) => (i + 3) * BASE)
	.map((size) => {
		const screen = Math.ceil((HORIZONTAL_GRID * size) / 20) * 20;
		return `@media screen and (min-width: ${screen}px) {
	#grid {
		width: calc(${size} * var(--grid));
	}

	picture {
		--width: ${size};
	}
}`;
	})
	.join("\n");

const version = (major: number, minor = 0, patch = 0) =>
	(major << 16) | (minor << 8) | (patch << 4);

const { code } = transform({
	filename: "styles.css",
	code: new TextEncoder().encode([themes, base, grid].join("\n")),
	minify: false,
	targets: {
		chrome: version(91),
	},
});

const css = new TextDecoder().decode(code);

Deno.writeTextFile(new URL("./static/styles.css", import.meta.url), css);

console.log(
	`Generated styles.css in ${Math.ceil(performance.now() - startTime)}ms`
);
