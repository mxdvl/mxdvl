import type { Work, Picture } from '$lib/works';
import { getWork } from '$lib/works';
import type { RequestHandler } from '@sveltejs/kit';
import { readdirSync, readFileSync } from 'fs';
import sharp from 'sharp';

const dirs = readdirSync('static/works').filter((dir) => !dir.includes('.'));

const getPicture = async (path: string): Promise<Picture> => {
	const image = readFileSync(path);
	const metadata = await sharp(image).metadata();
	const { width, height, format } = metadata;

	const basis = 6;
	const ratio = Math.round((height / width) * basis) / basis;

	return {
		path,
		width,
		height,
		ratio,
		format
	};
};

const getWorks = async (): Promise<Work[]> =>
	await Promise.all(
		dirs.map(async (dir) => {
			const path = `static/works/${dir}`;

			const files = readdirSync(path);
			const en = files?.find((file) => file.endsWith('.en.md'));
			const fr = files?.find((file) => file.endsWith('.fr.md'));

			const pictures = await Promise.all(
				files
					?.filter((file) =>
						['png', 'jpg', 'svg'].some((ext) => file.toLowerCase().endsWith(`.${ext}`))
					)
					.map((filename) => {
						return getPicture(`${path}/${filename}`);
					})
			);

			const slug: string = en.split('.')[0];

			return getWork({
				slug,
				path: `${path}/${en}`,
				pictures,
				lang: 'en'
			});
		})
	);

const PROD = process.env.NODE_ENV === 'production';
const base = PROD ? 'https://content.mxdvl.com' : 'http:/localhost:3000/';

const getUrls = (): Array<Work['urls']> =>
	dirs.map((dir) => {
		const path = `static/works/${dir}`;
		const files = readdirSync(path).filter((file) => file.endsWith('.md'));

		const en = files.find((file) => file.endsWith('.en.md'))?.slice(0, -6);
		const fr = files.find((file) => file.endsWith('.fr.md'))?.slice(0, -6);

		const urls = {
			en: new URL(`/works/${en}.json`, base).toString(),
			fr: fr ? new URL(`/travaux/${fr}.json`, base).toString() : undefined,
			date: dir
		};

		return urls;
	});

export const get: RequestHandler = async () => {
	const works = getUrls();

	if (!works) return;

	return {
		body: works
	};
};

export { getWorks };
