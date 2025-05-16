import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { gray, underline } from "jsr:@std/fmt/colors";

const [url] = Deno.args;

if (!url) throw new Error("Missing URL, please provide it as an argument");

const html = await fetch(url).then((r) => r.text());

const document = new DOMParser().parseFromString(html, "text/html");

if (!document) throw new Error(`Couldn’t parse a DOM from: ${url}`);

const links = document.getElementsByTagName("a").map((
	element,
) => [element.textContent.trim() || "(empty)", element.getAttribute("href") ?? "/"] as const);

for (const [text, href] of links) {
	const fully_qualified_url = href?.startsWith("http") ? href : new URL(href, url).href;
	console.log(text, gray("→"), underline(fully_qualified_url));
}

console.info("\nFound", links.length, "anchors");
