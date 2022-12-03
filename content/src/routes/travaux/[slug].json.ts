import type { RequestHandler } from "./__types/[slug].json";
import { findWork } from "../works/[slug].json";

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const work = await findWork(slug, "fr");

	if (!work) return { status: 404, body: `Rien trouvé: ${slug}` };

	return {
		body: work,
	};
};

export { findWork };
