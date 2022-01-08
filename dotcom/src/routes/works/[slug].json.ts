import type { Lang } from "$lib/lang";
import type { RequestHandler } from "@sveltejs/kit";
import { getWorks } from "./index.json";

const findWork = async (slug: string): Promise<Work | void> => {
	const works = await getWorks();
	const langs: Lang[] = ["en", "fr"];
	return works.find((work) => langs.some((lang) => work.urls[lang]?.endsWith("/" + slug)));
};

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params;
	const work = await findWork(slug);

	if (!work) return;

	return {
		body: { work },
	};
};

export { findWork };
