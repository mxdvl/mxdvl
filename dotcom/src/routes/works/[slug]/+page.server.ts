import type { PageServerLoad } from "./$types";
import type { Work } from "@mxdvl/content/lib/works";
import { base } from "$lib/base";

import { error } from "@sveltejs/kit";

export const load: PageServerLoad<{ work: Work }> = async ({ fetch, params: { slug } }) => {
	const url = new URL(`/works/${slug}.json`, base).toString();
	const req = await fetch(url);

	if (!req.ok) throw error(404, "Not Found");

	return {
		work: await req.json(),
	};
};
