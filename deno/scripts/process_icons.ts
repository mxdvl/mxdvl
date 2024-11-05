import { cyan, green, red } from "https://deno.land/std@0.193.0/fmt/colors.ts";
import { walk } from "jsr:@std/fs";
import { render } from "resvg";
import { generate_favicon } from "./ico.ts";
import { fromFileUrl } from "jsr:@std/path";

console.log("Generating all favicons");

const cmps = fromFileUrl(new URL("../../cmps", import.meta.url));
const build = fromFileUrl(new URL("../../build", import.meta.url));

await Deno.mkdir(build, { recursive: true });

for await (const { name } of walk(cmps, { includeDirs: false, match: [/\.svg$/], maxDepth: 1 })) {
	const start = performance.now();
	const errors: string[] = [];

	const svg = await Deno.readTextFile(`${cmps}/${name}`);
	const png = await render(svg);

	await Deno.writeFile(`${build}/${name.replace(".svg", ".png")}`, png)
		.catch((error) => errors.push(error instanceof Error ? error.message : String(error)));

	if (name === "cmps.svg") {
		await generate_favicon(`${build}/favicon.ico`, png)
			.catch((error) => errors.push(error instanceof Error ? error.message : String(error)));
	}

	const status = errors.length === 0 ? green("○") : red("×");

	console.info(status, cyan(name), "\t in", Math.ceil(performance.now() - start), "ms", "\t", errors.join(","));
}
