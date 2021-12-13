import { getWork } from "$lib/works";
import type { RequestHandler } from "@sveltejs/kit";
import fs from "fs";

const dirs = fs.readdirSync("../content/works");

export const get: RequestHandler = async ({ params }) => {
	const works = dirs.map((dir) => {
		const files = fs.readdirSync(`../content/works/${dir}`);
		const en = files.find((file) => file.endsWith(".en.md"));
		const fr = files.find((file) => file.endsWith(".fr.md"));

		return getWork(
			en,
			fs.readFileSync(`../content/works/${dir}/${en}`, "utf8"),
			fr ? fs.readFileSync(`../content/works/${dir}/${fr}`, "utf8") : undefined,
		);
	});

	if (!works) return;

	return {
		body: {
			works,
		},
	};
};
