import type { RequestHandler } from "@sveltejs/kit";

import type { WorkUrls } from "$content/routes/works/index.json";

export const base = "https://content.mxdvl.com/";

export const get: RequestHandler = async () => {
	const url = new URL("/works.json", base).toString();
	const works: WorkUrls[] = await fetch(url).then((r) => r.json());

	return {
		body: { works },
	};
};
