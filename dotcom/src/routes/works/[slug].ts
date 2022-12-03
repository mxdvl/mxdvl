import type { RequestHandler } from "./__types/[slug]";
import type { Work } from "@mxdvl/content/lib/works";
import { base } from "./index";
import { cache } from "$lib/cache";

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;
	const url = new URL(`/works/${slug}.json`, base).toString();
	const req = await fetch(url);

	if (!req.ok) return { status: 404, body: "Not Found" };

	const work: Work = await req.json();

	return {
		headers: { ...cache },
		body: {
			work,
		},
	};
};
