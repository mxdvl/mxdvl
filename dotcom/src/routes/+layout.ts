import { lang as langStore, pathLang } from "$lib/lang";

export const load = async ({ url }) => {
	const lang = pathLang(url.pathname);
	langStore.set(lang);
	return {
		lang,
	};
};
