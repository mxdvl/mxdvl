import { build } from "./styles.css.ts";

export const isDynamic = (
	pathname: string
): pathname is keyof typeof manifest => pathname in manifest;

export const manifest = {
	"/styles.css": build,
} as const;
