import type { RequestHandler } from '@sveltejs/kit';
import { findWork } from '../works/[slug].json';

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const work = await findWork(encodeURIComponent(slug));

	if (!work) return { status: 404, body: `Rien trouvé: ${slug}` };

	return {
		body: work
	};
};

export { findWork };
