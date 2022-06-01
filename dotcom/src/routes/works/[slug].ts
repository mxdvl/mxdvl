import type { RequestHandler } from "@sveltejs/kit";
import type { Work } from "@mxdvl/content/lib/works";
import { base } from "./index";

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params;
	const url = new URL(`/works/${slug}.json`, base).toString();
	const req = await fetch(url);

	if (!req.ok) return { status: 404, body: "Not Found" };

	const work: Work = await req.json();

	return {
		body: {
			work,
		},
	};
};
