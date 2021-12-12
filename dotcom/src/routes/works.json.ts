import type { Work } from "$lib/works";
import type { RequestHandler } from "@sveltejs/kit";

const works = import.meta.globEager("../../../content/works/**/*.md");

const isString = (value): value is string => typeof value === "string" && value !== "";

const getSlug = (path: string, slug?: unknown) =>
	isString(slug) ? slug : path.split("/").filter(Boolean).slice(-2)[0];

export const getWork = (path: string): Work => {
	const en = works[path.replace(".fr.", ".en.")];
	const fr = works[path.replace(".en.", ".fr.")];

	const parsed: Record<string, unknown> = en.metadata;
	const metadata: Work["metadata"] = {
		titles: {
			en: isString(parsed.title) ? parsed.title : "⚠️ MISSING TITLE",
			fr: fr?.metadata?.title,
		},
		date: isString(parsed.date) ? new Date(parsed.date).toISOString() : "** MISSING DATE **",
	};

	const content: Work["content"] = {
		en: en.default.render().html,
		fr: fr?.default.render().html,
	};

	const urls: Work["urls"] = {
		en: `https://www.mxdvl.com/works/${getSlug(path)}`,
		fr: fr ? `https://www.mxdvl.com/travaux/${getSlug(path, fr.metadata.slug)}` : undefined,
	};

	return {
		urls,
		metadata,
		content,
	};
};

export const getWorks = (): Work[] =>
	Object.keys(works)
		.filter((path) => path.includes(`.en.`))
		.map((path) => getWork(path));

export const get: RequestHandler = async ({ params }) => {
	const works = getWorks();

	if (!works) return;
	return {
		body: {
			works,
		},
	};
};
