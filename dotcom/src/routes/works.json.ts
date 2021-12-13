import { getWork } from "$lib/works";
import type { RequestHandler } from "@sveltejs/kit";
import fs from "fs";

const dirs = fs.readdirSync("../content/works");

export const get: RequestHandler = async ({ params }) => {
	const works = dirs.map((dir) => {
		const path = `../content/works/${dir}`;

		const files = fs.readdirSync(path);
		const en = files.find((file) => file.endsWith(".en.md"));
		const fr = files.find((file) => file.endsWith(".fr.md"));

		return getWork(
			path,
			fs.readFileSync(`${path}/${en}`, "utf8"),
			fr ? fs.readFileSync(`${path}/${fr}`, "utf8") : undefined,
		);
	});

	if (!works) return;

	return {
		body: {
			works,
		},
	};
};
