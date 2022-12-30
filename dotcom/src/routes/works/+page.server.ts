import type { PageServerLoad } from "./$types";
import type { WorkUrls } from "@mxdvl/content/routes/works/+server";
import { base } from "$lib/base";

export const load: PageServerLoad = async () => {
	const url = new URL("/works.json", base).toString();
	const works: WorkUrls[] = await fetch(url).then((r) => r.json());

	return { works };
};
