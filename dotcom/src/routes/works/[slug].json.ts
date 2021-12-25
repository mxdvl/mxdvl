import { Lang, pathLang } from "$lib/lang";
import type { RequestHandler } from "@sveltejs/kit";
import { works } from "../works.json";

export const get: RequestHandler = async ({ params, path }) => {
	const { slug } = params;
	const lang: Lang = pathLang(path);
	const work =
		(await works).find((work) => work.urls[lang]?.endsWith(slug)) ?? works.find((work) => work.urls.en.endsWith(slug));

	if (!work) return;

	return {
		body: { work },
	};
};
