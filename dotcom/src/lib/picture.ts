/**
 * Keep in sync with app.css
 * @link dotcom/src/app.css
 */
const GRID_SIZE = 18;

const COLUMNS = [18, 24, 30, 36] as const;

export const defaultDirectives = new URLSearchParams({
	width: COLUMNS.map((column) => column * GRID_SIZE)
		.flatMap((width) => [width, width * 2])
		.join(";"),
	picture: "",
});
