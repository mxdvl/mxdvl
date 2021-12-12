import type { Lang } from "$lib/lang";

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

export type { Work };
export { getUrl, getTitle, cleanDate };
