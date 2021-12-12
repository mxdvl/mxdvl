import type { RequestHandler } from "@sveltejs/kit";
import { getWorks } from "../works.json";

export const get: RequestHandler = async ({ params, path }) => {
	const { slug } = params;
	const work = getWorks().find((work) => work.urls.en.endsWith(slug));

	if (!work) return;

	return {
		body: { work },
	};
};
