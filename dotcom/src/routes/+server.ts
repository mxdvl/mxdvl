import type { Lang } from "$lib/lang";

export const GET = ({ request }) => {
	const maybeLang = request.headers
		.get("accept-language")
		?.split(",")
		.find((str) => str.startsWith("fr") || str.startsWith("en"));

	const lang: Lang = maybeLang?.startsWith("fr") ? "fr" : "en";

	return new Response(undefined, {
		status: 301,
		headers: { Location: lang === "fr" ? `/${encodeURIComponent("allô")}` : "/hi" },
	});
};
