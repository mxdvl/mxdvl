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

const handler: Handler = async () => {
	const { startTime: reqStartTime } = performance.mark("start");

	const html = await getHtml("./index.html");
	performance.mark("Got HTML from file");

	const document = getDocument(html);
	performance.mark("Parsed DOM");

	const renderTime = document.createElement("ul");
	document.querySelector("footer")?.appendChild(renderTime);

	performance.mark("DOM manipulation");

	for (const { startTime, name } of performance.getEntriesByType("mark")) {
		const li = document.createElement("li");
		li.innerText = [(startTime - reqStartTime).toFixed(1), name].join(": ");
		renderTime.appendChild(li);
	}

	performance.clearMarks();

	return new Response(document.documentElement?.innerHTML, {
		status: 200,
		headers: {
			"Content-Type": "text/html",
		},
	});
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
