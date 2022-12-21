import { lang as langStore, pathLang } from "$lib/lang";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url }) => {
	const lang = pathLang(url.pathname);
	langStore.set(lang);
	return {
		lang,
	};
};
