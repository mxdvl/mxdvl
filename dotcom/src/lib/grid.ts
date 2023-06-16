export const GRID_SIZE = 18;

export const grids = Array.from({ length: 10 }, (_, i) => (i + 3) * 6)
	.map(
		(cols) => `
@media screen and (min-width: ${(cols + 1) * GRID_SIZE}px) {
	#grid {
		--columns: ${cols};
	}
}`,
	)
	.join("\n");

console.log(grids);
