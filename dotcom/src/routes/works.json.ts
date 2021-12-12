import type { Lang } from "$lib/lang";
import type { RequestHandler } from "@sveltejs/kit";

const works: Record<Lang, Record<string, any>> = {
	en: import.meta.globEager("../../../content/works/**/*.en.md"),
	fr: import.meta.globEager("../../../content/works/**/*.fr.md"),
};

export type Work = {
	urls: {
		en: `https://www.mxdvl.com/works/${string}`;
		fr?: `https://www.mxdvl.com/travaux/${string}`;
	};
	metadata: {
		title: string;
		date: string;
		slug: string;
	};
	content: {
		html: string;
	};
};

const isString = (value): value is string => typeof value === "string" && value !== "";

const getUrls = (path: string): Work["urls"] => {
	const paths = {
		en: path.replace(".fr.", ".en."),
		fr: path.replace(".en.", ".fr."),
	};

	const slugs = {
		en: getSlug(paths.en, works.en[paths.en]?.metadata.slug),
		fr: getSlug(paths.fr, works.fr[paths.fr]?.metadata.slug),
	};

	console.log(works.fr[paths.fr]);

	return {
		en: `https://www.mxdvl.com/works/${slugs.en}`,
		fr: works.fr[paths.fr] ? `https://www.mxdvl.com/travaux/${slugs.fr}` : undefined,
	};
};

const getSlug = (path: string, slug: unknown) => (isString(slug) ? slug : path.split("/").filter(Boolean).slice(-2)[0]);

const getWork = (path: string, lang: Lang): Work => {
	const entry = works[lang][path];
	const parsed: Record<keyof Work["metadata"], unknown> = entry.metadata;
	const metadata: Work["metadata"] = {
		title: isString(parsed.title) ? parsed.title : "⚠️ MISSING TITLE",
		date: isString(parsed.date) ? new Date(parsed.date).toISOString() : "** MISSING DATE **",
		slug: getSlug(path, parsed.slug),
	};

	const content: Work["content"] = {
		html: entry.default.render().html,
	};

	const urls = getUrls(path);

	return {
		urls,
		metadata,
		content,
	};
};

export const getWorks = (lang: Lang): Work[] => Object.keys(works[lang]).map((path) => getWork(path, lang));

export const get: RequestHandler = async ({ params }) => {
	const works = getWorks("en");
	if (!works) return;
	return {
		body: {
			works,
		},
	};
};
