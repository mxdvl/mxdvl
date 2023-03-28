import { DOMParser, Element } from "linkedom";
import { Handler, serve } from "std/http/server.ts";
import { crypto } from "std/crypto/mod.ts";
import { typeByExtension } from "std/media_types/type_by_extension.ts";
import { isDynamic, manifest } from "./deps/manifest.ts";
import { parseTheme, Theme } from "./styles/themes.ts";
import { fr } from "./pages/lang.ts";
import { cache } from "./cache.ts";

const port = 8080;

const getHtml = async (path: string) => {
	try {
		const html = await Deno.readTextFile(new URL(path, import.meta.url));
		performance.mark(`Got HTML from file: ${decodeURI(path)}`);
		return html;
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			performance.mark("Got HTML from file");
			return await Deno.readTextFile(
				new URL(`pages/404.html`, import.meta.url),
			);
		}

		throw error;
	}
};

const parser = new DOMParser();

const getDocument = (html: string) => {
	const doc = parser.parseFromString(html, "text/html");
	if (!doc) throw new Error("Could not parse HTML");
	return doc;
};

const base_styles = await Deno.readTextFile(new URL("static/styles.css", import.meta.url));

const isElement = (node: Node): node is Element => node instanceof Element;

type Settings = {
	lang: "fr" | "en";
	theme: Theme | "default";
};
const generateBody = async (pathname: string, { lang, theme }: Settings) => {
	const layout = getDocument(await getHtml("components/layout.html"));
	performance.mark("Parsed layout");

	const head = layout.querySelector("head");
	if (!head) throw new Error("no <head>");

	const main = layout.querySelector("main");
	if (main) {
		main.innerHTML = await getHtml(`pages${pathname}.html`);
	}

	const styles = new Map<string, string>();

	for (const component of layout.querySelectorAll("[is]")) {
		if (!isElement(component)) continue;
		const name = component.getAttribute("is");
		if (!name) continue;
		component.innerHTML = await getHtml(`components/${name}.html`);
		const style = component.querySelector("style");
		if (style) styles.set(name, style.innerText);
	}

	if (layout.documentElement) {
		layout.documentElement.setAttribute("class", theme ?? "default");
		layout.documentElement.setAttribute("lang", lang);
	}

	performance.mark("Injected into DOM");

	const renderTime = layout.createElement("ul");
	layout.querySelector("footer ul")?.replaceWith(renderTime);

	performance.mark("DOM manipulation");

	const style = layout.createElement("style");
	style.innerHTML = [base_styles, ...styles.values()].join("\n");
	head.appendChild(style);

	performance.mark("Injected styles");

	const [start = { startTime: 0 }] = performance.getEntriesByName("start");
	for (const { startTime, name } of performance.getEntriesByType("mark")) {
		const li = layout.createElement("li");
		li.innerHTML = [
			"<pre style='display: inline-block; margin: 0;'>",
			(startTime - start.startTime).toFixed(0).padStart(3, " "),
			"</pre> – ",
			name,
		].join("");
		renderTime.appendChild(li);
	}
	const status = parseInt(
		main?.querySelector("#error")?.getAttribute("data-error") ?? "200",
		10,
	);

	return {
		body: `<!DOCTYPE html>
${layout.documentElement?.outerHTML}`,
		status,
	};
};

const getMimeType = (filename: string) => {
	const extension = filename.match(/\.(.+?)$/)?.[0] ?? ".html";
	return typeByExtension(extension) ?? "text/plain";
};

const digest = async (message: Uint8Array) => {
	const hash = await crypto.subtle.digest("SHA-1", message);
	const hex = [...new Uint8Array(hash)]
		.map((s) => s.toString(16).padStart(2, "0"))
		.join("");

	return hex;
};

const getStaticFile = async (pathname: string, match?: string) => {
	try {
		const file = await Deno.readFile(
			new URL(`static/${pathname}`, import.meta.url),
		);

		const etag = await digest(file);

		const expires = cache(60);

		if (match?.includes(etag)) {
			return new Response(undefined, {
				status: 304,
				headers: expires,
			});
		}

		return new Response(file, {
			headers: {
				"Content-Type": getMimeType(pathname),
				etag,
				...expires,
			},
		});
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			return undefined;
		}
		throw error;
	}
};

const getDynamicFile = async (pathname: string, match?: string) => {
	if (!isDynamic(pathname)) return undefined;

	const body = await manifest[pathname]();

	const etag = await digest(new TextEncoder().encode(body));

	if (match?.includes(etag)) {
		return new Response(undefined, {
			status: 304,
		});
	}

	return new Response(body, {
		headers: {
			"Content-Type": getMimeType(pathname),
			etag,
			...cache(0),
		},
	});
};

const handler: Handler = async ({ url, headers }) => {
	performance.clearMarks();
	const { startTime: reqStartTime } = performance.mark("start");

	const { pathname, origin, searchParams } = new URL(url);

	if (pathname === "/") {
		const lang = headers
			.get("Accept-Language")
			?.split(",")
			.find((s) => s.startsWith("en") || s.startsWith("fr"))
			?.slice(0, 2) ?? "en";

		switch (lang) {
			case "fr":
				return Response.redirect(new URL(`allô`, origin));
			case "en":
			default:
				return Response.redirect(new URL(`hi`, origin));
		}
	}

	const match = headers.get("If-None-Match") ?? undefined;

	const dynamicFile = await getDynamicFile(pathname, match);
	if (dynamicFile) return dynamicFile;

	const staticFile = await getStaticFile(pathname, match);
	if (staticFile) return staticFile;

	const { body, status } = await generateBody(pathname, {
		lang: fr.includes(decodeURI(pathname)) ? "fr" : "en",
		theme: parseTheme(searchParams.get("theme") ?? "default"),
	});

	return new Response(body, {
		status,
		headers: {
			"Content-Type": "text/html",
			"X-Render-Time": `${Math.ceil(performance.now() - reqStartTime)}ms`,
		},
	});
};

await serve(handler, { port });
