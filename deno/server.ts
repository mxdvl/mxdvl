import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.34-alpha/deno-dom-wasm.ts";
import { Handler, serve } from "https://deno.land/std@0.154.0/http/server.ts";

const port = 8080;

const getHtml = (path: string) =>
	Deno.readTextFile(new URL(path, import.meta.url));

const parser = new DOMParser();

const getDocument = (html: string) => {
	const doc = parser.parseFromString(html, "text/html");
	if (!doc) throw new Error("Could not parse HTML");
	return doc;
};

const layout = getDocument(await getHtml("./template.html"));

const handler: Handler = async () => {
	const { startTime: reqStartTime } = performance.mark("start");

	const html = await getHtml("./hi.html");
	performance.mark("Got HTML from file");

	const main = layout.querySelector("main");
	if (main) {
		main.innerHTML = html;
	}

	performance.mark("Parsed DOM");

	const renderTime = layout.createElement("ul");
	layout.querySelector("footer ul")?.replaceWith(renderTime);

	performance.mark("DOM manipulation");

	for (const { startTime, name } of performance.getEntriesByType("mark")) {
		const li = layout.createElement("li");
		li.innerText = [(startTime - reqStartTime).toFixed(1), name].join(": ");
		renderTime.appendChild(li);
	}

	performance.clearMarks();

	return new Response(layout.documentElement?.outerHTML, {
		status: 200,
		headers: {
			"Content-Type": "text/html",
			"X-Render-Time": `${Math.ceil(performance.now() - reqStartTime)}ms`,
		},
	});
};

await serve(handler, { port });
