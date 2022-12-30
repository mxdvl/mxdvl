import type { RequestHandler } from "./$types";
import { findWork } from "$lib/works";
import { error, json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const work = await findWork(slug, "en");

	if (!work) throw error(404, `Not Found: ${slug}`);

	return json(work);
};

export const prerender = "auto";
