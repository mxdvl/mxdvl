import { pathLang } from "$lib/lang";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url }) => {
	const lang = pathLang(url.pathname);
	return {
		lang,
	};
};
