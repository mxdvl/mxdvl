import type { Lang } from "$lib/lang";
import type { Work } from "$lib/works";
import type { RequestHandler } from "@sveltejs/kit";
import { getWorks } from "./index.json";

const findWork = async (slug: string): Promise<Work | false> => {
	const works = await getWorks();
	const langs: Lang[] = ["en", "fr"];

	return works.find((work) => langs.some((lang) => work.urls[lang]?.endsWith("/" + slug))) ?? false;
};

export const get: RequestHandler = async ({ params }) => {
	const { slug } = params;

	const work = slug && (await findWork(slug));

	if (!work) return { fallthrough: true };

	return {
		body: { work },
	};
};

export { findWork };
