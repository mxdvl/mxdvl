import type { Work, Picture } from '$lib/works';
import { getWork } from '$lib/works';
import type { RequestHandler } from '@sveltejs/kit';
import { readdirSync, readFileSync } from 'fs';

const dirs = readdirSync('static/works').filter((dir) => !dir.includes('.'));

type WorkUrls = {
	en: string;
	fr?: string;
	date: string;
};
const getUrls = (): Array<WorkUrls> =>
	dirs.map((dir) => {
		const path = `static/works/${dir}`;
		const files = readdirSync(path).filter((file) => file.endsWith('.md'));

		const en = files.find((file) => file.endsWith('.en.md'))?.slice(0, -6);
		const fr = files.find((file) => file.endsWith('.fr.md'))?.slice(0, -6);

		const title = en ? readFileSync()

		const urls = {
			en: `/works/${en}.json`,
			fr: fr ? `/travaux/${fr}.json` : undefined,
			date: dir
		};

		return urls;
	});

export const get: RequestHandler = async () => {
	const works = getUrls();

	if (!works) return;

	return {
		body: works.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	};
};

export { getUrls };
export type { WorkUrls };
