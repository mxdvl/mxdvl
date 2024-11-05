import { copy } from "https://deno.land/std@0.193.0/fs/copy.ts";
import { cyan, green, red } from "https://deno.land/std@0.193.0/fmt/colors.ts";
import { walk } from "jsr:@std/fs";
import { render } from "resvg";
import { generate_favicon } from "./ico.ts";

console.log("Generating all favicons");

const cmps = new URL("../../cmps", import.meta.url);

const cwd = await Deno.realPath(cmps);

await Deno.mkdir(`${cwd}/build`, { recursive: true });

for await (const { name } of walk(cwd, { includeDirs: false, match: [/\.svg$/], maxDepth: 1 })) {
	const start = performance.now();
	const errors: string[] = [];

	const svg = await Deno.readTextFile(`${cwd}/${name}`);
	const png = await render(svg);

	await Deno.writeFile(`${cwd}/build/${name.replace(".svg", ".png")}`, png)
		.catch((error) => errors.push(error instanceof Error ? error.message : String(error)));

	if (name === "cmps.svg") {
		await generate_favicon(`${cwd}/build/favicon.ico`, png)
			.catch((error) => errors.push(error instanceof Error ? error.message : String(error)));
	}

	const status = errors.length === 0 ? green("○") : red("×");

	console.info(status, cyan(name), "\t in", Math.ceil(performance.now() - start), "ms", "\t", errors.join(","));
}

await copy(`${cwd}/build`, new URL("../static", import.meta.url), {
	overwrite: true,
});
