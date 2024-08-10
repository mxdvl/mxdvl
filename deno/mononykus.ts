import { serveFile } from "jsr:@std/http/file-server";
import { dirname, fromFileUrl, normalize as normalise } from "jsr:@std/path";
import { exists } from "jsr:@std/fs";

const options = {
	site_dir: fromFileUrl(dirname(import.meta.url) + "/"),
	base: "/",
	out_dir: "build/",
	minify: false,
} as const;

export async function handler(request: Request) {
	const url = new URL(request.url);
	const lang = getPreferredLanguage(request.headers, ["fr", "en"]);

	if (url.pathname === "/") {
		return Response.redirect(
			new URL(lang === "en" ? "/hi" : "/allô", url.origin),
		);
	}

	if (url.pathname.startsWith("/media/")) {
		const filepath = fromFileUrl(import.meta.resolve("." + url.pathname));
		return serveFile(request, filepath);
	}

	const filePath = normalise(options.out_dir + decodeURI(url.pathname));

	if (await exists(filePath, { isFile: true })) {
		return serveFile(request, filePath);
	}

	if (await exists(filePath + ".html", { isFile: true })) {
		return serveFile(request, filePath + ".html");
	}

	const error = lang === "en" ? "error.html" : "erreur.html";

	return serveFile(request, options.out_dir + error);
}

if (import.meta.main) {
	const { build, rebuild } = await import("jsr:@mxdvl/mononykus@0.7.5");

	const environment = Deno.args.some((arg) => arg === "--watch") ? "dev" : "prod";
	if (environment === "dev") {
		await rebuild(options);

		Deno.serve(handler);

		const watcher = Deno.watchFs(options.site_dir);
		let timeout;
		for await (
			const {
				kind,
				paths: [path],
			} of watcher
		) {
			if (path && (kind === "modify" || kind === "create")) {
				if (path.includes(options.out_dir)) continue;
				clearTimeout(timeout);
				timeout = setTimeout(() => rebuild(options), 12);
			}
		}
	} else {
		await build(options);
	}
}

/** For a given array of languages, get the user’s preferred one */
function getPreferredLanguage<
	const Langs extends readonly [string, ...string[]],
>(headers: Headers, langs: Langs): Langs[number] {
	const matchingLanguages = headers
		.get("Accept-Language")
		?.split(",")
		.flatMap((language) => {
			const match = langs.find((lang) => language.startsWith(lang));
			return match ? [match] : [];
		}) ?? [];
	return matchingLanguages[0] ?? langs[0];
}
