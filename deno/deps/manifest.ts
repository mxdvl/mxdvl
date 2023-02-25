import render from "https://esm.sh/preact-render-to-string@5.2.6";
import { loom } from "../pages/loom.tsx";
import { Royal_Opera_House } from "../pages/royal-opera-house.tsx";

export const isDynamic = (
	pathname: string,
): pathname is keyof typeof manifest => pathname in manifest;

export const manifest = {
	"/royal-opera-house.svg": () => render(Royal_Opera_House),
	"/loom": () => Deno.readTextFile("deno/pages/loom.html").then((html) => html.replace("<!--SVG-->", render(loom))),
} as const satisfies Record<string, () => string | Promise<string>>;
