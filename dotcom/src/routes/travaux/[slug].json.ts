import { Lang, pathLang } from "$lib/lang";
import type { RequestHandler } from "@sveltejs/kit";
import { getWorks } from "../works.json";
import { findWork } from "../works/[slug].json";

export const get: RequestHandler = async ({ params, path }) => {
	const { slug } = params;
	const lang: Lang = pathLang(path);

	const work = await findWork(slug, lang);

	if (!work) return;

	return {
		body: { work },
	};
};
