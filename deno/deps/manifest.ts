import render from "https://esm.sh/preact-render-to-string@5.2.6";
import { Royal_Opera_House } from "../pages/royal-opera-house.tsx";
import { build } from "../styles/styles.css.ts";

export const isDynamic = (
	pathname: string,
): pathname is keyof typeof manifest => pathname in manifest;

export const manifest = {
	"/styles.css": () => build(),
	"/royal-opera-house.svg": () => render(Royal_Opera_House),
} as const satisfies Record<string, () => string | Promise<string>>;
