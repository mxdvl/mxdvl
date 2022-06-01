import type { Work } from "$lib/works";
import type { RequestHandler } from "@sveltejs/kit";
import type { Lang } from "../../../../dotcom/src/lib/lang";
import { getWork } from "$lib/works";
import { getUrls } from "./index.json";

const findWork = async (slug: string, lang: Lang): Promise<Work | undefined> => {
	const works = getUrls();
	const langs: Lang[] = ["en", "fr"];

	const work = works.find((work) => langs.some((lang) => work[lang]?.endsWith(`/${slug}.json`)));

	if (!work) return;

	const url: string = work[lang]?.endsWith(`/${slug}.json`) ? work[lang] ?? "en" : work.en;
	const validLang = url === work[lang] ? lang : "en";
	const path = `static/works/${work.date}/${decodeURIComponent(slug)}.${validLang}.md`;

	const alt = validLang === "fr" ? work.en : work.fr;

	return getWork({ lang: validLang, path, alt });
};

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params;

	if (!slug) return { status: 404 };

	const work = await findWork(slug, "en");

	if (!work) return { status: 404, body: `Not Found: ${slug}` };

	return {
		body: work,
	};
};

export { findWork };
