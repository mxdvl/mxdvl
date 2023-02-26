import { copy } from "std/fs/copy.ts";
import { cyan, green, red } from "std/fmt/colors.ts";
import { render } from "resvg";

console.log("Generating all favicons");

const cmps = new URL("../cmps", import.meta.url);

const cwd = await Deno.realPath(cmps);

const deps = ["vips", "convert"] as const;

for (const dep of deps) {
	const process = Deno.run({ cwd, cmd: ["which", dep] });
	const { code } = await process.status();
	if (code !== 0) Deno.exit(code);
}

const commands: Array<{
	name: string;
	cmd: [(typeof deps)[number], ...string[]];
}> = [
	{
		name: "Vips – for SVG to PNG",
		cmd: ["vips", "copy", "cmps.svg", "build/favicon.png"],
	},
	{
		name: "ImageMagick – Convert PNG to ICO",
		cmd: [
			"convert",
			"-background",
			"transparent",
			"build/favicon.png",
			"-define",
			`icon:auto-resize=${[64, 32, 16]}`,
			"build/favicon.ico",
		],
	},
];

await Deno.mkdir(`${cwd}/build`, { recursive: true });

for (const { name, cmd } of commands) {
	console.info(name);
	const process = Deno.run({ cwd, cmd });
	const { code } = await process.status();
	if (code !== 0) Deno.exit(code);
}

for await (const { name, isFile } of Deno.readDir(cwd)) {
	if (isFile && name.endsWith(`.svg`)) {
		Promise.allSettled([
			Deno.readTextFile(`${cwd}/${name}`)
				.then((svg) => render(svg))
				.then((png) => Deno.writeFile(`${cwd}/build/${name.replace(".svg", ".png")}`, png)),
			Deno.copyFile(`${cwd}/${name}`, `${cwd}/build/${name}`),
		]).then((steps) => {
			const status = steps.every(({ status }) => status === "fulfilled") ? green("○") : red("×");
			console.info(status, "–", cyan(name));
		});
	}
}

await copy(`${cwd}/build`, new URL("assets/favicons/", import.meta.url), {
	overwrite: true,
});
