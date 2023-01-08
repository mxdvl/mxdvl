import type { resolveConfigs, Picture } from "vite-imagetools";

/**
 * Keep in sync with app.css
 * @link dotcom/src/app.css
 */
const sizes = [
	[360, 18],
	[620, 30],
	[740, 36],
	[960, 48],
	[1200, 66],
	[1400, 72],
] as const;

export const resolveConfigsMxdvl: typeof resolveConfigs = () =>
	sizes.map(([width]) => ({
		width: String(width),
		format: "webp",
		picture: "",
	}));

export const defaultDirectives = new URLSearchParams({
	width: sizes.map(([width]) => width).join(";"),
	format: ["webp", "jpeg", "avif"].join(";"),
	picture: "",
});
