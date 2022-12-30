import type { PageServerLoad } from "./$types";
import { getUrls } from "$lib/works";

export const load: PageServerLoad = async () => {
	const urls = getUrls();

	return {
		urls,
	};
};

// NO JAVASCRIPT!
export const prerender = true;
export const csr = false;
