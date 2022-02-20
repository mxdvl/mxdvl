import type { Work, Picture } from '$lib/works';
import { getWork } from '$lib/works';
import type { RequestHandler } from '@sveltejs/kit';
import { readdirSync, readFileSync } from 'fs';

const dirs = readdirSync('static/works').filter((dir) => !dir.includes('.'));

const PROD = process.env.NODE_ENV === 'production';
const base = PROD ? 'https://content.mxdvl.com' : 'http:/localhost:3000/';

type Urls = {
	en: string;
	fr?: string;
	date: string;
};
const getUrls = (): Array<Urls> =>
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

export { getWorks, getUrls };
export type { Urls };
