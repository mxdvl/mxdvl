import { join } from "jsr:@std/path";
import { qr } from "npm:headless-qr@1";

const content = "P012";

const module = qr(content);

console.log("\n\n");
for (const row of module) {
	console.log("     ", row.map((column) => column ? "◾" : "  ").join(""));
}
console.log("\n\n");

const BASIS = 2;

if (import.meta.main && import.meta.dirname) {
	const dir = join(import.meta.dirname, "qr");

	const positions = module.flatMap((row, x) => row.flatMap((col, y) => col ? [{ x, y }] : []));

	await Deno.mkdir(dir, { recursive: true });
	await Deno.writeTextFile(
		join(dir, content + ".svg"),
		`<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
	width="700" height="700"
	viewBox="-${BASIS * 5} -${BASIS * 5} ${35 * BASIS} ${35 * BASIS}"
	fill="none"
	stroke="black"
	stroke-width="0.2"
	stroke-linecap="round"
>
	${
			positions.map(({ x, y }) =>
				`<path d="${
					[
						// "M0,1H2",
						// "M1,0V2",

						"M0,0L2,2",
						"M0,2L2,0",

						"M0,0",
						"A1,1 0,0,0 2,0",
						"A1,1 0,0,0 2,2",
						"A1,1 0,0,0 0,2",
						"A1,1 0,0,0 0,0",
					].join(" ")
				}" transform="translate(${x * BASIS} ${y * BASIS})" />`
			)
				.join("\n")
		}
</svg>`,
	);
}
