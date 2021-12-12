import type { RequestHandler } from "@sveltejs/kit";
import { getWorks } from "../works.json";

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params;
	const work = getWorks("en").find((work) => work.metadata.slug === slug);

	if (!work) return;

	return {
		body: { work },
	};
};
