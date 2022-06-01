import type { RequestHandler } from "./__types/";
import type { WorkUrls } from "@mxdvl/content/routes/works/index.json";
import { cache } from "$lib/cache";

export const base = "https://content.mxdvl.com/";

export const get: RequestHandler = async () => {
	const url = new URL("/works.json", base).toString();
	const works: WorkUrls[] = await fetch(url).then((r) => r.json());

	return {
		headers: { ...cache },
		body: { works },
	};
};
