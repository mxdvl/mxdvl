import type { Lang } from "$lib/lang";
import { pathLang } from "$lib/lang";
import type { RequestHandler } from "@sveltejs/kit";
import { getWorks } from "../works.json";

const findWork = async (slug: string, lang: Lang): Promise<Work | void> => {
	const works = await getWorks();
	return works.find((work) => work.urls[lang]?.endsWith("/" + slug) ?? work.urls.en.endsWith("/" + slug));
};

export const get: RequestHandler = async ({ params, path }) => {
	const { slug } = params;
	const lang: Lang = pathLang(path);
	const work = await findWork(slug, lang);

	if (!work) return;

	return {
		body: { work },
	};
};

export { findWork };
