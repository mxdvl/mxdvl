import type { RequestHandler } from "@sveltejs/kit";
import type { Work } from "@mxdvl/content/lib/works";
import { base } from "../works";

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const url = new URL(`/travaux/${slug}.json`, base).toString();
	const req = await fetch(url);

	if (!req.ok) return { status: 404, body: "Rien trouvé" };

	const work: Work = await req.json();

	return {
		body: {
			work,
		},
	};
};
