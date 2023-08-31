import { Handler, serve } from "std/http/server.ts";
import { serveDir, serveFile } from "std/http/file_server.ts";
import { dirname, fromFileUrl } from "std/path/mod.ts";

const options = {
	site_dir: fromFileUrl(dirname(import.meta.url) + "/"),
	base: "/",
	out_dir: "build/",
	minify: false,
};

export const handler: Handler = (request) => {
	const url = new URL(request.url);

	if (url.pathname === "/") {
		const languages = request.headers.get("Accept-Language");
		const lang = languages?.match(/\b(en|fr)\b/)?.[0] ?? "en";

		return Response.redirect(new URL(lang === "en" ? "/hi" : "/allô", url.origin));
	}

	if (!url.pathname.includes(".")) {
		return serveFile(request, options.out_dir + decodeURIComponent(url.pathname) + ".html");
	}

	return serveDir(request, {
		fsRoot: options.out_dir,
	});
};

if (import.meta.main) {
	const { build, rebuild } = await import(
		"https://deno.land/x/mononykus@0.7.1/src/build.ts".slice()
	);

	const environment = Deno.args.some((arg) => arg === "--watch") ? "dev" : "prod";
	if (environment === "dev") {
		await rebuild(options);

		serve(handler);

		const watcher = Deno.watchFs(options.site_dir);
		let timeout;
		for await (const { kind, paths: [path] } of watcher) {
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
