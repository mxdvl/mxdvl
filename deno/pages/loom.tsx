import { JSX } from "https://esm.sh/preact@10.12.1/jsx-runtime";
const { cos, sin, PI } = Math;
const tau = PI * 2;

const styles = `
.background { fill: white; }
path {
	stroke: black;
	fill: rgba(0,0,0, 0.0625);
	stroke-width: 0.5;
	stroke-linejoin: miter;
	stroke-miterlimit: 12;
}

@media (prefers-color-scheme: dark) {
	.background {fill: #111}
	path { stroke: white;}
}`;

const spread = (n: number) => (element: JSX.Element) => (
	<g data-count={n}>
		{Array.from(
			{ length: n },
			(_, i) => <g transform={`rotate(${360 / n * i})`}>{element}</g>,
		)}
	</g>
);

const back_and_forth =
	([left, right]: [string, string]) => (n: number) => [...Array(n).fill(left), Array(n).fill(right)];

const loops = back_and_forth([
	"a24,24 0 0 1 18,0",
	"a24,24 0 0 1 -18,0",
]);

const mirror = (...deltas: readonly [number, number][]) =>
	[...deltas, ...deltas.slice().reverse().map(([x, y]) => [-x, y] as const)].map(([x, y]) => `${x},${y}`);

const xmlns = "http://www.w3.org/2000/svg";

// getPointAtLength

const on_circle = (turns = 1) => (radius: number) => (count: number) =>
	Array.from({ length: count }, (_, index) => {
		const position = tau * ((turns * index / count) - 1 / 4);
		return [cos(position) * radius, sin(position) * radius] as const;
	});

const polygon = (radius: number, n: number) => {
	const [first, ...rest] = on_circle()(radius)(n);
	if (!first) return <></>;
	return (
		<path
			d={[
				"M",
				first.join(","),
				"L",
				...rest.map(([x, y]) => `${x},${y} `),
				"Z",
			].join("")}
		/>
	);
};

const rosace = (count: number) => {
	const points = on_circle()(60)(count);
	const arc = 3;
	return (
		<>
			<path
				d={[
					`M${points.at(-1)}`,
					...points.map(([x, y]) => `A${arc},${arc} 0 0 0 ${x},${y}`),
				].join("\n")}
			/>
			{points.map(([x, y], index) => <text x={x} y={y}>{index}</text>)}
		</>
	);
};

export const loom = (
	<svg
		xmlns={xmlns}
		viewBox="-120 -120 240 240"
		width="100%"
		height="100%"
		strokeLinejoin={"miter"}
	>
		<style>{styles}</style>
		<rect class="background" x={-300} y={-300} width="1000%" height="1000%" />

		{polygon(19, 6)}

		{rosace(12)}
	</svg>
);
