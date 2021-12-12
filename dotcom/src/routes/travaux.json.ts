import type { RequestHandler } from "@sveltejs/kit";
import { getWorks } from "./works.json";

export const get: RequestHandler = async ({ params }) => {
	const works = getWorks();
	if (!works) return;
	return {
		body: {
			works,
		},
	};
};
