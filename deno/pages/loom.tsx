import type { JSX } from "preact/jsx-runtime";
const { cos, sin, PI } = Math;
const tau = PI * 2;

const styles = `
.background { fill: skyblue; }
path {
	stroke: darkorange;
	fill: rgba(210, 210, 0, 1.063);
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

const back_and_forth = ([left, right]: [string, string]) => (n: number) =>
	Array.from({ length: n * 2 }, (_, i) => i < n ? left : right);

const loops = back_and_forth([
	"a24,24 0 0 1 18,0",
	"a24,24 0 0 1 -18,0",
]);

const mirror = (...deltas: readonly [number, number][]) =>
	[`M18,-${deltas.reduce((accumulator, [, y]) => accumulator + y, 0)}`].concat(
		[...deltas, ...deltas.slice().reverse().map(([x, y]) => [-x, y] as const)].map(([x, y]) => `l${x},${y}`),
	);

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
	const points = on_circle()(48)(count);
	const arc = 3;
	return (
		<>
			<path
				d={[
					`M${points.at(-1)}`,
					...points.map(([x, y]) => `A${arc},${arc} 0 0 0 ${x},${y}`),
				].join("\n")}
			/>
			{/* {points.map(([x, y], index) => <text x={x} y={y}>{index}</text>)} */}
		</>
	);
};

export const loom = (
	<svg
		xmlns={xmlns}
		viewBox="-120 -120 240 240"
		width="900px"
		height="900px"
		strokeLinejoin={"miter"}
	>
		<style>{styles}</style>
		<rect class="background" x={-300} y={-300} width="1000%" height="1000%" />

		{/* {polygon(19, 6)} */}

		{/* {rosace(3)} */}
		{/* {rosace(5)} */}
		{rosace(12)}

		{spread(36)(
			<path
				d={[
					"M48,0",
					...loops(2),
					// "Z",
				].join(" ")}
			/>,
		)}

		{spread(18)(
			<path
				transform="rotate(0)"
				d={[
					// base
					...mirror(
						[6, 3],
						[3, 2],
						[-2, 1],
					),
				].join(" ")}
			/>,
		)}

		{polygon(12, 3)}
		{polygon(6, 6)}
		{spread(2)(polygon(3, 3))}
	</svg>
);
