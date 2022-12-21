import type { PageServerLoad } from "./$types";
import type { Work } from "@mxdvl/content/lib/works";
import { base } from "$lib/base";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params: { slug } }) => {
	const url = new URL(`/travaux/${slug}.json`, base).toString();
	const req = await fetch(url);

	if (!req.ok) throw error(404, "Rien trouvé");

	const work: Work = await req.json();

	return {
		work,
	};
};
