import { copy } from "https://deno.land/std@0.193.0/fs/copy.ts";
import { cyan, green, red } from "https://deno.land/std@0.193.0/fmt/colors.ts";
import { render } from "resvg";
import { generate_favicon } from "./ico.ts";

console.log("Generating all favicons");

const cmps = new URL("../../cmps", import.meta.url);

const cwd = await Deno.realPath(cmps);

await Deno.mkdir(`${cwd}/build`, { recursive: true });

for await (const { name, isFile } of Deno.readDir(cwd)) {
	if (isFile && name.endsWith(`.svg`)) {
		const start = performance.now();
		await Promise.allSettled([
			Deno.readTextFile(`${cwd}/${name}`)
				.then((svg) => render(svg))
				.then((png) =>
					Promise.all([
						Deno.writeFile(`${cwd}/build/${name.replace(".svg", ".png")}`, png),
						name === "cmps.svg" ? generate_favicon(`${cwd}/build/favicon.ico`, png) : undefined,
					])
				),
			Deno.copyFile(`${cwd}/${name}`, `${cwd}/build/${name}`),
		]).then((steps) => {
			const status = steps.every(({ status }) => status === "fulfilled") ? green("○") : red("×");
			console.info(status, cyan(name), "\t in", performance.now() - start, "ms");
		});
	}
}

await copy(`${cwd}/build`, new URL("../static", import.meta.url), {
	overwrite: true,
});
