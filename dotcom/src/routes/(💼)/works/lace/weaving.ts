const { cos, sin, PI} = Math;
export const tau = PI * 2;

export const on_circle = (turns = 1) => (radius: number) => (count: number) =>
	Array.from({ length: count }, (_, index) => {
		const position = tau * ((turns * index / count) - 1 / 4);
		return [cos(position) * radius, sin(position) * radius] as const;
	});

export const back_and_forth = ([left, right]: [string, string]) => (n: number) =>
	Array.from({ length: n * 2 }, (_, i) => i < n ? left : right);

export const mirror = (...deltas: readonly [number, number][]) =>
	[`M18,-${deltas.reduce((accumulator, [, y]) => accumulator + y, 0)}`].concat(
		[...deltas, ...deltas.slice().reverse().map(([x, y]) => [-x, y] as const)].map(([x, y]) => `l${x},${y}`),
	);

