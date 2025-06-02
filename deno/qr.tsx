import { delay } from "jsr:@std/async";
import { qr } from "npm:headless-qr@1";
import { renderToString } from "npm:preact-render-to-string";

if (import.meta.main) {
	const now = Date.now();
	const server = Deno.serve(({ url }) => {
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
								<symbol id="square">
									<Square />
								</symbol>
								<style>
									{`
									text { font-family: system-ui; fill: green; }
								`}
								</style>
							</defs>

							<Token position={12} x={0} y={0} />
							<Token position={34} x={30} y={0} />
							<Token position={567} x={60} y={0} />
							<Token position={890} x={90} y={0} />
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

	await server.finished;
}

function Square() {
	return (
		<path
			fill="none"
			stroke="blue"
			transform="scale(0.5)"
			d={[
				"M0,0L2,2",
				"M0,2L2,0",

				"M0,0",
				"A1,1 0,0,0 2,0",
				"A1,1 0,0,0 2,2",
				"A1,1 0,0,0 0,2",
				"A1,1 0,0,0 0,0",
			].join(" ")}
		/>
	);
}

function Token({ position, x = 0, y = 0 }: { position: number; x: number; y: number }) {
	const input = `P${String(position).padStart(3, "0")}`;
	const [first, second, third, fourth] = input;
	return (
		<g transform={`translate(${x} ${y})`}>
			<path fill="none" stroke="red" d={["M0,0", "H28", "V53", "H0", "Z"].join(" ")} />
			<g transform="translate(3 15)">
				<Letter char={first ?? "P"} x={0} y={0} />
				<Letter char={second ?? "0"} x={6} y={0} />
				<Letter char={third ?? "0"} x={12} y={0} />
				<Letter char={fourth ?? "0"} x={18} y={0} />
			</g>
			<QR input={input} x={4} y={28} />
			{/* <text y={55} fontSize={6}>{input}</text> */}
		</g>
	);
}

function QR({ input, x = 0, y = 0 }: { input: string; x?: number; y?: number }) {
	const positions = qr(input, { correction: "H" })
		.flatMap((row, x) => row.flatMap((col, y) => col ? [{ x, y }] : []));

	return (
		<g transform={`translate(${x - 0.5} ${y - 0.5})`}>
			{positions.map(({ x, y }) => (
				<use
					key={[x, y].join(",")}
					x={x}
					y={y}
					href="#square"
				/>
			))}
		</g>
	);
}

function Letter({ char, x, y }: { char: string; x: number; y: number }) {
	switch (char) {
		case "P":
			return (
				<path
					stroke="blue"
					d={[
						`M ${x},${y + 8}`,
						"v -8",
						"h 2",
						corner(2, 2),
						"v 0.5",
						corner(-2, 2),
						"h -2",
					].join(" ")}
				/>
			);
		case "0":
			return (
				<path
					stroke="blue"
					d={[
						`M${x},${y + 2}`,
						corner(2, -2),
						corner(2, 2),
						"v 4",
						corner(-2, 2),
						corner(-2, -2),
						"Z",
					].join(" ")}
				/>
			);
		case "1":
			return (
				<path
					stroke="blue"
					d={[
						`M${x},${y + 1}`,
						"c 1,0 2,-1 2,-1",
						"v8",
						"m-2,0",
						"h4",
					].join(" ")}
				/>
			);
		case "2":
			return (
				<path
					stroke="blue"
					d={[
						`M${x},${y + 2}`,
						"c 0,-1 .5,-2 2,-2",
						"s 2,1 2,2",
						"c 0,4 -4,1 -4,6",
						"h4",
						// "a2,2 0 0 0 -2,2",
						// "v2",
					].join(" ")}
				/>
			);
		case "3":
			return (
				<path
					stroke="blue"
					d={[
						`M${x},${y + 2}`,
						"c 0,-1 .5,-2 2,-2",
						"s 2,1 2,2",
						"c 0,0 0,2 -2,2",
						// "h-1",
						// "m1,0",
						"c 2,0 2,1 2,2",
						"c 0,1 -.5,2 -2,2",
						"s -2,-1 -2,-2",
					].join(
						" ",
					)}
				/>
			);
		case "4":
			return (
				<path
					stroke="blue"
					d={[
						`M${x + 1},${y}`,
						"c 0,2 -1,4.5 -1,4.5",
						"h 4",
						"m 0,-4.5",
						"v 8",
					].join(
						" ",
					)}
				/>
			);
		case "5":
			return (
				<path
					stroke="blue"
					d={[
						`M${x + 4},${y}`,
						"h -4",
						"v 3",
						"h 1",
						corner(3, 2),
						"v 1",
						corner(-2, 2),
						corner(-2, -2),
					].join(
						" ",
					)}
				/>
			);
		case "6":
			return (
				<path
					stroke="blue"
					d={[
						`M${x},${y + 5.5}`,
						"c 0,-1 0,-2 2,-2",
						"c 2,0 2,1 2,2",
						"v .5",
						"c 0,1 -.5,2 -2,2",
						"s -2,-1 -2,-2",
						"v -4",
						"c 0,-1 0.5,-2 2,-2",
						"s 2,1 2,2",
					].join(
						" ",
					)}
				/>
			);
		case "7":
			return (
				<path
					stroke="blue"
					d={[
						`M${x},${y}`,
						"h4",
						"l-3,8",
					].join(
						" ",
					)}
				/>
			);
		case "8":
			return (
				<path
					stroke="blue"
					d={[
						`M${x + 2},${y + 3.7}`,
						corner(-2, -1.7),
						corner(2, -2),
						corner(2, 2),
						corner(-2, 1.7),

						corner(2, 2),
						"v .3",
						corner(-2, 2),
						corner(-2, -2),
						"v -.3",
						corner(2, -2),
					].join(
						" ",
					)}
				/>
			);
		case "9":
			return (
				<path
					stroke="blue"
					d={[
						`M${x + 4},${y + 2.5}`,
						corner(-2, 2),
						corner(-2, -2),
						"v -.5",
						corner(2, -2),
						corner(2, 2),
						"v 4",
						corner(-2, 2),
						corner(-2, -2),
					].join(
						" ",
					)}
				/>
			);
		default:
			return null;
	}
}

function corner(dx: number, dy: number, direction: "cw" | "ccw" = "cw") {
	const y = 3 / 4;
	const x = 2 / 3;
	switch (direction) {
		case "cw": {
			return Math.sign(dx) === Math.sign(dy)
				? `c ${dx * x},0 ${dx},${dy * (1 - y)} ${dx},${dy}`
				: `c 0,${dy * y} ${dx * (1 - x)},${dy} ${dx},${dy}`;
		}
		case "ccw": {
			return `l${dx},${dy}`;
		}
	}
}
