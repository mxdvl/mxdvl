import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.34-alpha/deno-dom-wasm.ts";
import { Handler, serve } from "https://deno.land/std@0.154.0/http/server.ts";
import initLightningCss from "https://unpkg.com/lightningcss-wasm@1.14.0/lightningcss_node.js";

const port = 8080;

const getHtml = async (path: string) => {
	try {
		const html = await Deno.readTextFile(new URL(path, import.meta.url));
		performance.mark(`Got HTML from file: ${path}`);
		return html;
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			performance.mark("Got HTML from file");
			return await Deno.readTextFile(
				new URL(`pages/404.html`, import.meta.url)
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

const generateBody = async (pathname: string) => {
	const layout = getDocument(await getHtml("layout.html"));
	performance.mark("Parsed layout");
	const head = layout.querySelector("head");
	if (head) {
		const styles = layout.createElement("style");
		const { default: css } = await import(
			import.meta.resolve("./assets/styles.css.ts")
		);
		styles.innerHTML = css;
		head.appendChild(styles);
	}

	const main = layout.querySelector("main");
	if (main) {
		main.innerHTML = await getHtml(`pages${pathname}.html`);
	}

	performance.mark("Injected into DOM");

	const renderTime = layout.createElement("ul");
	layout.querySelector("footer ul")?.replaceWith(renderTime);

	performance.mark("DOM manipulation");

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
		10
	);

	return {
		body: `<!DOCTYPE html>
${layout.documentElement?.outerHTML}`,
		status,
	};
};

const getMimeType = (filename: string) => {
	if (filename.endsWith(".svg")) return "image/svg+xml";
	if (filename.endsWith(".png")) return "image/png";
	if (filename.endsWith(".jpg")) return "image/jpeg";
	if (filename.endsWith(".ico")) return "image/x-icon";

	if (filename.endsWith(".css")) return "text/css";

	if (filename.endsWith(".js")) return "application/javascript";

	return "text/plain";
};

const getStaticFile = async (pathname: string) => {
	try {
		const file = await Deno.readFile(
			new URL(`static/${pathname}`, import.meta.url)
		);

		return new Response(file, {
			headers: { "Content-Type": getMimeType(pathname) },
		});
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			return null;
		}
		throw error;
	}
};

const getDynamicFile = async (pathname: string) => {
	try {
		const { default: body } = await import(
			import.meta.resolve(`./assets/${pathname}.ts`)
		);

		return new Response(body, {
			headers: { "Content-Type": getMimeType(pathname) },
		});
	} catch (error) {
		if (error instanceof TypeError) {
			return null;
		}

		throw error;
	}
};

const handler: Handler = async (req) => {
	performance.clearMarks();
	const { startTime: reqStartTime } = performance.mark("start");

	const { pathname, origin } = new URL(req.url);

	if (pathname === "/") {
		const lang =
			req.headers
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

	const dynamicFile = await getDynamicFile(pathname);
	if (dynamicFile) return dynamicFile;

	const staticFile = await getStaticFile(pathname);
	if (staticFile) return staticFile;

	const { body, status } = await generateBody(pathname);

	return new Response(body, {
		status,
		headers: {
			"Content-Type": "text/html",
			"X-Render-Time": `${Math.ceil(performance.now() - reqStartTime)}ms`,
		},
	});
};

await initLightningCss();

await serve(handler, { port });
