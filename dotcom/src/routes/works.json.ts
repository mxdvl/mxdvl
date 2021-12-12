import type { Lang } from "$lib/lang";
import type { RequestHandler } from "@sveltejs/kit";

const works = import.meta.globEager("../../../content/works/**/*.md");

export type Work = {
	urls: {
		en: `https://www.mxdvl.com/works/${string}`;
		fr?: `https://www.mxdvl.com/travaux/${string}`;
	};
	metadata: {
		titles: {
			en: string;
			fr?: string;
		};
		date: string;
	};
	content: {
		en: string;
		fr?: string;
	};
};

const isString = (value): value is string => typeof value === "string" && value !== "";

const getUrls = (path: string): Work["urls"] => {
	const paths = {
		en: path.replace(".fr.", ".en."),
		fr: path.replace(".en.", ".fr."),
	};

	const slugs = {
		en: getSlug(paths.en, works[paths.en]?.metadata.slug),
		fr: getSlug(paths.fr, works[paths.fr]?.metadata.slug),
	};

	return {
		en: `https://www.mxdvl.com/works/${slugs.en}`,
		fr: works[paths.fr] ? `https://www.mxdvl.com/travaux/${slugs.fr}` : undefined,
	};
};

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
