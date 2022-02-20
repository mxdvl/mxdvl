import type { Work } from '$lib/works';
import type { RequestHandler } from '@sveltejs/kit';
import { getWork } from '$lib/works';
import { getWorks, getUrls } from './index.json';

const findWork = async (slug): Promise<Work | undefined> => {
	const works = await getUrls();
	const langs: Lang[] = ['en', 'fr'];

	const work = works.find((work) => langs.some((lang) => work[lang]?.endsWith(`/${slug}.json`)));

	if (!work) return;

	const url: string = work.fr?.endsWith(`/${slug}.json`) ? work.fr : work.en;
	const lang: Lang = url === work.fr ? 'fr' : 'en';
	const path: string =
		lang === 'fr'
			? `static/works/${work.date}/${decodeURIComponent(slug)}.fr.md`
			: `static/works/${work.date}/${slug}.en.md`;

	const alt = lang === 'fr' ? work.en : work.fr;

	return getWork({ lang, path, alt });
};

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const work = await findWork(slug);

	if (!work) return { status: 404, body: `Not Found: ${slug}` };

	return {
		body: work
	};
};

export { findWork };
