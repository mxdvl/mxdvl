import type { Lang } from "$lib/lang";
import { unified } from "unified";
import frontmatter from "remark-frontmatter";
import type { Root } from "mdast";
import parse from "remark-parse";
import stringify from "rehype-stringify";
import rehype from "remark-rehype";

type Work = {
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
		at?: string;
	};
	content: {
		en: string;
		fr?: string;
	};
};

const getUrl = (work: Work, lang: Lang) => {
	const url = work.urls[lang] ?? work.urls["en"];
	const path = "/" + url.split("/").slice(-2).join("/");
	return lang === "en" ? path : path.replace("/works/", "/travaux/");
};

const getTitle = (titles: Work["metadata"]["titles"], lang: Lang) => {
	const title = titles[lang] ?? titles["en"];
	return title;
};

const cleanDate = (date: string) => new Date(date).toISOString().slice(0, 7);

const isString = (value): value is string => typeof value === "string" && value !== "";

const getSlug = (path: string, slug?: unknown) =>
	isString(slug) ? slug : path.split("/").filter(Boolean).slice(-1)[0];

const getMeta = (root: Root): Meta => {
	// @ts-expect-error -- it’s actually there
	const matter: string | undefined = root.children.find((child) => child.type === "yaml")?.value;
	if (!matter) return {};

	return Object.fromEntries(
		matter.split("\n").map((line) => {
			const split = line.split(": ");
			const key = split[0];
			const value = split.slice(1).join(": ");
			return [key, value];
		}),
	);
};

type Meta = {
	title?: string;
	date?: string;
	slug?: string;
	at?: string;
};

export const getWork = (path: string, en: string, fr?: string): Work => {
	const parsed = unified().use(parse).use(frontmatter);
	const htmlProcessor = parsed().use(rehype).use(stringify);

	const content: Work["content"] = {
		en: htmlProcessor.processSync(en).toString(),
		fr: fr ? htmlProcessor.processSync(fr).toString() : undefined,
	};

	const meta: Record<Lang, Meta> = {
		en: getMeta(parsed.parse(en)),
		fr: getMeta(parsed.parse(fr)),
	};

	const metadata: Work["metadata"] = {
		titles: {
			en: isString(meta.en.title) ? meta.en.title : "⚠️ MISSING TITLE",
			fr: meta.fr?.title,
		},
		date: isString(meta.en.date) ? new Date(meta.en.date).toISOString() : "** MISSING DATE **",
		at: isString(meta.en.at) ? meta.en.at : undefined,
	};

	const urls: Work["urls"] = {
		en: `https://www.mxdvl.com/works/${getSlug(path)}`,
		fr: fr ? `https://www.mxdvl.com/travaux/${getSlug(path, meta.fr.slug)}` : undefined,
	};

	return {
		urls,
		metadata,
		content,
	};
};

export type { Work };
export { getUrl, getTitle, cleanDate };
