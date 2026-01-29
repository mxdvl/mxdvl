import { cyan, green, red } from "@std/fmt/colors";
import { walk } from "@std/fs";
import { Resvg } from "@resvg/resvg-js";
import { generate_favicon } from "./ico.ts";
import { dirname, fromFileUrl, resolve } from "@std/path";
import { pooledMap } from "@std/async";
import { ensureDir } from "@std/fs/ensure-dir";

console.log("Generating all favicons");
const start = performance.now();

const directory = dirname(fromFileUrl(import.meta.url));

const cmps = resolve(directory, "..", "..", "cmps");
const build = resolve(directory, "..", "..", "build");

await ensureDir(build);

const files = walk(cmps, { includeDirs: false, match: [/\.svg$/], maxDepth: 1 });
const processor = pooledMap(6, files, ({ name }) => process(name));
let count = 0;
for await (const { errors, name } of processor) {
	const status = errors.length === 0 ? green("○") : red("×");
	console.info(status, cyan(name), "\t", errors.join(","));
	count++;
}

console.log("took", Math.ceil(performance.now() - start), "ms for", count, "icons");

/** convert an SVG file to PNG and ICO as necessary */
async function process(name: string) {
	const errors: string[] = [];

	const svg = await Deno.readTextFile(`${cmps}/${name}`);
	const resvg = new Resvg(svg, { font: { loadSystemFonts: false } });

	const png = resvg.render().asPng();

	await Deno.writeFile(`${build}/${name.replace(".svg", ".png")}`, png)
		.catch((error) => errors.push(String(error)));

	if (name === "cmps.svg") {
		await generate_favicon(`${build}/favicon.ico`, png)
			.catch((error) => errors.push(String(error)));
	}

	return { name, errors };
}
