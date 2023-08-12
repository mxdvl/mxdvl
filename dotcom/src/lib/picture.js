import { GRID_SIZE } from "./grid.js";

const COLUMNS = /** @type {const} */ ([18, 24, 30, 36]);

export const defaultDirectives = new URLSearchParams({
	w: COLUMNS.map((column) => column * GRID_SIZE)
		.flatMap((width) => [width, width * 2])
		.join(";"),
	format: ["avif", "jpeg"].join(";"),
	progressive: "",
	as: "picture",
});
