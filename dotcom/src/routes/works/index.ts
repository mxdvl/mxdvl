import type { RequestHandler } from "./__types/";
import type { WorkUrls } from "@mxdvl/content/routes/works/index.json";
import { cache } from "$lib/cache";

const isDev = process.env.NODE_ENV === "development";

export const base = isDev ? "http://localhost:3002/" : "https://content.mxdvl.com/";

export const get: RequestHandler = async () => {
	const url = new URL("/works.json", base).toString();
	const works: WorkUrls[] = await fetch(url).then((r) => r.json());

	return {
		headers: { ...cache },
		body: { works },
	};
};
