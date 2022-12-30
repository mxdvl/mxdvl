import type { RequestHandler } from "./$types";
import { error, json } from "@sveltejs/kit";
import { findWork } from "$lib/works";

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const work = await findWork(slug, "fr");

	if (!work) throw error(404, `Rien trouvé: ${slug}`);

	return json(work);
};

export const prerender = "auto";
