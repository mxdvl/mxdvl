<script>
	let input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

	let expansion = 2;

	/** @typedef {`${number},${number}`} Coordinates */

	/**
	 * @param {Coordinates} coordinates
	 * @returns {{x: number, y: number }}
	 */
	const parse_coordinates = (coordinates) => {
		const [x = -1, y = -1] = coordinates.split(",").map(Number);
		return { x, y };
	};

	/**
	 * @param {Object} coordinates
	 * @param {number} coordinates.x
	 * @param {number} coordinates.y
	 * @returns {Coordinates}
	 */
	const format_coordinates = ({ x, y }) => `${x},${y}`;

	/** @type {(coord: string) => coord is Coordinates} */
	const is_coordinates = (coord) => !!coord.match(/^-?\d+,-?\d+$/);

	/** @typedef {`${Coordinates}:${Coordinates}`} Pair */

	/**
	 * @param {Pair} pair
	 * @returns {[Coordinates, Coordinates] | undefined}
	 */
	const parse_pair = (pair) => {
		const [a, b] = pair.split(":").filter(is_coordinates);
		if (!a || !b) return;
		return [a, b];
	};

	$: lines = input.split("\n").filter((line) => line.match(/^[.#]+$/));

	$: ({
		stars: raw_stars,
		xs,
		ys,
	} = lines.reduce(
		(accumulator, line, y) => {
			for (let x = 0; x < line.length; x++) {
				if (line[x] === ".") continue;
				accumulator.xs.delete(x);
				accumulator.ys.delete(y);
				accumulator.stars.add(`${x},${y}`);
			}

			return accumulator;
		},
		{
			stars: /** @type {Set<Coordinates>} */ (new Set()),
			xs: /** @type {Set<number>} */ (new Set(Array.from({ length: lines[0]?.length ?? 0 }, (_, i) => i))),
			ys: /** @type {Set<number>} */ (new Set(Array.from({ length: lines.length ?? 0 }, (_, i) => i))),
		},
	));

	$: stars = [...raw_stars]
		.map((star) => {
			const { x, y } = parse_coordinates(star);

			return format_coordinates({
				x: x + [...xs].filter((empty) => empty < x).length * (expansion - 1),
				y: y + [...ys].filter((empty) => empty < y).length * (expansion - 1),
			});
		})
		.reduce((set, star) => set.add(star), /** @type {Set<Coordinates>} */ (new Set()));

	/**
	 * @param {Coordinates} a
	 * @param {Coordinates} b
	 * @returns {Pair | undefined}
	 */
	const get_pair_hash = (a, b) => {
		const order = a.localeCompare(b);
		switch (order) {
			case -1: {
				return `${a}:${b}`;
			}
			case 1: {
				return `${b}:${a}`;
			}
			default:
				return undefined;
		}
	};

	/**
	 * @param {ReadonlySet<Coordinates>} stars
	 * @returns {ReadonlyMap<Pair, number>}
	 */
	const get_pairs = (stars) => {
		const copied_stars = new Set(stars);
		const pairs = /** @type {Map<Pair, number>} */ (new Map());
		for (const star of stars) {
			for (const pair of new Set(stars)) {
				const hash = get_pair_hash(star, pair);
				if (!hash) continue;
				if (pairs.has(hash)) continue;
				const { x: x0, y: y0 } = parse_coordinates(star);
				const { x: x1, y: y1 } = parse_coordinates(pair);
				const distance = Math.abs(x0 - x1) + Math.abs(y0 - y1);
				pairs.set(hash, distance);
			}
		}
		return pairs;
	};

	$: pairs = get_pairs(stars);

	$: cols = Math.max(...[...stars].map(parse_coordinates).map(({ x }) => x));
	$: rows = Math.max(...[...stars].map(parse_coordinates).map(({ y }) => y));

	/** @type {Coordinates} */
	let current_star = "0,2";
</script>

<textarea cols="24" rows="12" bind:value={input}></textarea>

<input type="number" bind:value={expansion} min={1} />

<hr />

<h2>Part 1</h2>

<p>Found {[...lines.join(".").matchAll(/#/g)].length} stars</p>

<p>{[...xs].join(",")} columns</p>
<p>{[...ys].join(",")} rows</p>

<p>
	A total of {pairs.size} pairs, with a combined distance of
	<strong>{[...pairs.values()].reduce((accumulator, distance) => accumulator + distance)}</strong>
</p>

<ul>
	{#each pairs as [hash, distance] (hash)}
		{@const [start, end] = parse_pair(hash) ?? []}
		{#if start && end}
			<li>
				<button class:current={start === current_star} on:click={() => (current_star = start)}>{start}</button>
				<span class:current={current_star === start || current_star === end}>&larr;{distance}&rarr;</span>
				<button class:current={end === current_star} on:click={() => (current_star = end)}>{end}</button>
			</li>
		{/if}
	{/each}
</ul>

<svg viewBox="-1 -1 {cols + 2} {rows + 2}" style="font-size:{rows / 200}dvw;">
	{#each [...pairs.entries()].filter(([hash]) => hash
			.split(":")
			.some((coord) => coord === current_star)) as [hash, distance]}
		{@const [start, end] = parse_pair(hash)?.map(parse_coordinates) ?? []}
		{#if start && end}
			<g>
				<line stroke-width={rows / 600} x1={start.x} y1={start.y} x2={end.x} y2={end.y} />
				<text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2}>{distance}</text>
			</g>
		{/if}
	{/each}
	{#each stars as coordinates}
		{@const { x, y } = parse_coordinates(coordinates)}

		<text {x} {y} class:current={current_star === coordinates} on:pointerover={() => (current_star = coordinates)}
			>✦</text
		>
	{/each}
</svg>

<style>
	.current {
		color: var(--blue);
	}

	svg {
		width: 100%;
		aspect-ratio: 1 / 1;
	}

	line {
		stroke: var(--blue);
	}

	text {
		text-anchor: middle;
		fill: currentColor;
		vertical-align: center;
	}
</style>
