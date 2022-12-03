import type { Lang } from "$lib/lang";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ request }) => {
	const maybeLang = request.headers
		.get("accept-language")
		?.split(",")
		.find((str) => str.startsWith("fr") || str.startsWith("en"));

	const lang: Lang = maybeLang?.startsWith("fr") ? "fr" : "en";

	return {
		status: 301,
		headers: { Location: lang === "fr" ? `/${encodeURIComponent("allô")}` : "/hi" },
	};
};
