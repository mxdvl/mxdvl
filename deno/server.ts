import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.34-alpha/deno-dom-wasm.ts";
import { Handler, serve } from "https://deno.land/std@0.154.0/http/server.ts";

const port = 8080;

Deno.run({
	cmd: ["cmps/generate-favicon.sh"],
});

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
		li.innerText = [(startTime - start.startTime).toFixed(1), name].join(
			": "
		);
		renderTime.appendChild(li);
	}
	const status = parseInt(
		main?.querySelector("#error")?.getAttribute("data-error") ?? "200",
		10
	);

	return {
		body: layout.documentElement?.outerHTML,
		status,
	};
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

	const { body, status } = await generateBody(pathname);

	return new Response(body, {
		status,
		headers: {
			"Content-Type": "text/html",
			"X-Render-Time": `${Math.ceil(performance.now() - reqStartTime)}ms`,
		},
	});
};

await serve(handler, { port });
