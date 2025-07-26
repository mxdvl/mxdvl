import { renderToString } from "npm:preact-render-to-string";
import { Pattern, Square, Token } from "./tokens.tsx";
import { delay } from "jsr:@std/async";

if (!import.meta.main) throw Error("What are you doing?");

const now = Date.now();
Deno.serve(({ url }) => {
	const { pathname } = new URL(url);
	switch (pathname) {
		case "/":
			return new Response(
				`
<!doctype html>
<html>
	<head>
		<title>Parkrun Laser</title>
	</head>
	<body>
		<main><img src="/parkrun.svg"></main>
		<script>
			const img = document.querySelector('img');
			const sse = new EventSource("/sse");
			sse.addEventListener('update', ({ data }) => {
				img.src = '/parkrun.svg?' + data
			})
		</script>
	</body>
<html>`,
				{ headers: { "Content-Type": "text/html" } },
			);
		case "/parkrun.svg":
			return new Response(
				renderToString(
					<svg
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						width="1200"
						height="1600"
						viewBox="-10 -10 300 400"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="0.2"
					>
						<defs>
							<style>
								{`
								text { font-family: system-ui; fill: green; }
							`}
							</style>
						</defs>

						<Token position={176} x={0} y={0}>
							<Square />
						</Token>
						<Token position={324} x={30} y={0}>
							<Pattern />
						</Token>
						{[12, 34, 567, 890, 312, 555]
							.filter(() => false)
							.map((position, index) => (
								<Token
									key={position + index}
									position={position}
									x={(index * 30) % 300}
									y={300}
								>
									<Square />
								</Token>
							))}
					</svg>,
				),
				{
					headers: { "Content-Type": " image/svg+xml" },
				},
			);
		case "/sse": {
			const encoder = new TextEncoder();
			const controller = new AbortController();
			const { signal } = controller;
			const body = new ReadableStream({
				async start(controller) {
					while (!signal.aborted) {
						const message = encoder.encode([
							"event: update",
							`data: ${now}`,
							"retry: 120",
							"",
							"",
						].join("\n"));
						controller.enqueue(message);
						await delay(120);
					}
				},
				cancel() {
					controller.abort();
				},
			});
			return new Response(body, {
				headers: { "Content-Type": "text/event-stream" },
			});
		}

		default:
			return new Response(`Not found: ${pathname}`, { status: 404 });
	}
});
