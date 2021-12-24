import { getWork } from "$lib/works";
import type { RequestHandler } from "@sveltejs/kit";
import { readdirSync, readFileSync } from "fs";
import sharp from "sharp";

const dirs = readdirSync("../content/works");

const works = dirs.map((dir) => {
	const path = `../content/works/${dir}`;

	const files = readdirSync(path);
	const en = files?.find((file) => file.endsWith(".en.md"));
	const fr = files?.find((file) => file.endsWith(".fr.md"));

	return getWork(
		path.replace("../", "/"),
		readFileSync(`${path}/${en}`, "utf8"),
		fr ? readFileSync(`${path}/${fr}`, "utf8") : undefined,
	);
});

const getMedia = async (path: string) => {
	const image = readFileSync(path);
	const metadata = await sharp(image).metadata();
	const { width, height, format } = metadata;

	const ratio = Math.round((24 * width) / height);

	return {
		width,
		height,
		ratio,
		format,
	};
};

export const get: RequestHandler = async ({ params }) => {
	if (!works) return;

	return {
		body: {
			works,
		},
	};
};

export { works };
