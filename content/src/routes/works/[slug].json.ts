import type { Work } from '$lib/works';
import type { RequestHandler } from '@sveltejs/kit';
import { getWorks } from './index.json';

const findWork = async (slug?: string): Promise<Work | undefined> => {
	if (!slug) return;

	const works = await getUrls();
	const langs = ['en', 'fr'];

	return works.find((work) => langs.some((lang) => work.urls[lang]?.endsWith(`/${slug}.json`)));
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
