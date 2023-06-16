import { lang as langStore, pathLang } from "$lib/lang.js";

export const load = async ({ url }) => {
	const lang = pathLang(url.pathname);
	langStore.set(lang);
	return {
		lang,
	};
};
