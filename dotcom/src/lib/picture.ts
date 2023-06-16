import { GRID_SIZE } from "./grid";

const COLUMNS = [18, 24, 30, 36] as const;

export const defaultDirectives = new URLSearchParams({
	w: COLUMNS.map((column) => column * GRID_SIZE)
		.flatMap((width) => [width, width * 2])
		.join(";"),
	format: ["webp", "jpeg"].join(";"),
	progressive: "",
	as: "picture",
});
