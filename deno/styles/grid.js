const HORIZONTAL_GRID = 18;
const BASE = 6;

/** CSS for generating grid widths */
export const grid = Array.from({ length: 10 }, (_, i) => (i + 3) * BASE)
	.map((size) => {
		const px = Math.ceil(HORIZONTAL_GRID * (size + 1));
		return `
@media screen and (min-width: ${Math.ceil(px / 16)}em) {
	#grid {
		--columns: ${size};
	}
}`;
	})
	.join("\n");
