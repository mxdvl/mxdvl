import type { Lang } from "./lang";

export type Work = {
	alt?: string;
	metadata: {
		lang: Lang;
		title: string;
		date: string;
		at?: string;
	};
	content: string;
};
