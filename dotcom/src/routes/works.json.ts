import type { Work } from "$lib/works";
import { getWork } from "$lib/works";
import type { RequestHandler } from "@sveltejs/kit";
import { readdirSync, readFileSync } from "fs";
import sharp from "sharp";

const dirs = readdirSync("../content/works");

const getMedia = async (path: string) => {
	const image = readFileSync(path);
	const metadata = await sharp(image).metadata();
	const { width, height, format } = metadata;

	const ratio = Math.round((24 * width) / height);

	return {
		path,
		width,
		height,
		ratio,
		format,
	};
};

const getWorks = async (): Promise<Work[]> =>
	await Promise.all(
		dirs.map(async (dir) => {
			const path = `../content/works/${dir}`;

			const files = readdirSync(path);
			const en = files?.find((file) => file.endsWith(".en.md"));
			const fr = files?.find((file) => file.endsWith(".fr.md"));

			const media = await Promise.all(
				files
					?.filter((file) => ["png", "jpg", "svg"].some((ext) => file.toLowerCase().endsWith(`.${ext}`)))
					.map((filename) => {
						return getMedia(`${path}/${filename}`);
					}),
			);

			console.log(media);

			return getWork(
				path.replace("../", "/"),
				readFileSync(`${path}/${en}`, "utf8"),
				fr ? readFileSync(`${path}/${fr}`, "utf8") : undefined,
			);
		}),
	);

export const get: RequestHandler = async ({ params }) => {
	const works = await getWorks();

	if (!works) return;

	return {
		body: {
			works,
		},
	};
};

export { getWorks };
