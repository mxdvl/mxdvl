import type { RequestHandler } from "../works/$types";
import { json } from "@sveltejs/kit";
import { getUrls } from "$lib/works";

export const GET: RequestHandler = async () => {
	const works = getUrls();

	return json(works.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
};

export const prerender = "auto";
