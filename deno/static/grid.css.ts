const breakpoints = [360, 620, 740, 960, 1200, 1400];

const HORIZONTAL_GRID = 18;
const BASE = 6;

const css = breakpoints
	.map((size) => {
		const grid = Math.floor(size / (HORIZONTAL_GRID * BASE)) * BASE;
		return `@media screen and (min-width: ${size}px) {
	#grid {
		width: calc(${grid} * var(--grid));
	}

	picture {
		--width: ${grid};
	}
}`;
	})
	.join("\n");

Deno.writeTextFile(new URL("grid.css", import.meta.url), css);
