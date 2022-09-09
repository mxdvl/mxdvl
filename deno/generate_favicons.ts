const cmps = new URL("../cmps", import.meta.url);

const cwd = await Deno.realPath(cmps);

const commands = [
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
	{
		name: "Vips – convert apple-touch-icons to PNG (light)",
		cmd: [
			"vips",
			"copy",
			"cmps-icon-light.svg",
			"build/cmps-icon-light.png",
		],
	},
	{
		name: "Vips – convert apple-touch-icons to PNG (dark)",
		cmd: ["vips", "copy", "cmps-icon-dark.svg", "build/cmps-icon-dark.png"],
	},
] as const;

await Deno.mkdir(`${cwd}/build`, { recursive: true });

for (const { name, cmd } of commands) {
	console.info(`${name}`);
	const process = Deno.run({ cwd, cmd });
	const { code } = await process.status();
	if (code !== 0) Deno.exit(code);
}

for await (const { name, isFile } of Deno.readDir(cwd)) {
	if (isFile && ["svg", "png"].some((ext) => name.endsWith(`.${ext}`))) {
		console.info("Copying to build:", name);
		Deno.copyFile(`${cwd}/${name}`, `${cwd}/build/${name}`);
	}
}