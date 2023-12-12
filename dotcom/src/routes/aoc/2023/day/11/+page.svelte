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
	const parse = (coordinates) => {
		const [x = -1, y = -1] = coordinates.split(",").map(Number);
		return { x, y };
	};

	/**
	 * @param {Object} coordinates
	 * @param {number} coordinates.x
	 * @param {number} coordinates.y
	 * @returns {Coordinates}
	 */
	const format = ({ x, y }) => `${x},${y}`;

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
			const { x, y } = parse(star);

			return format({
				x: x + [...xs].filter((empty) => empty < x).length * (expansion - 1),
				y: y + [...ys].filter((empty) => empty < y).length * (expansion - 1),
			});
		})
		.reduce((set, star) => set.add(star), /** @type {Set<Coordinates>} */ (new Set()));

	/**
	 * @param {Coordinates} a
	 * @param {Coordinates} b
	 * @returns {`${Coordinates}:${Coordinates}` | undefined}
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
	 * @returns {ReadonlyMap<`${Coordinates}:${Coordinates}`, number>}
	 */
	const get_pairs = (stars) => {
		const copied_stars = new Set(stars);
		const pairs = /** @type {Map<`${Coordinates}:${Coordinates}`, number>} */ (new Map());
		for (const star of stars) {
			for (const pair of new Set(stars)) {
				const hash = get_pair_hash(star, pair);
				if (!hash) continue;
				if (pairs.has(hash)) continue;
				const { x: x0, y: y0 } = parse(star);
				const { x: x1, y: y1 } = parse(pair);
				const distance = Math.abs(x0 - x1) + Math.abs(y0 - y1);
				pairs.set(hash, distance);
			}
		}
		return pairs;
	};

	$: pairs = get_pairs(stars);
</script>

<textarea cols="24" rows="12" bind:value={input}></textarea>

<input type="number" bind:value={expansion} />

<hr />

<h2>Part 1</h2>

<p>Found {[...lines.join(".").matchAll(/#/g)].length} stars</p>

<p>{[...xs]} columns</p>
<p>{[...ys]} rows</p>

<p>
	A total of {pairs.size} pairs, with a combined distance of
	<strong>{[...pairs.values()].reduce((accumulator, distance) => accumulator + distance)}</strong>
</p>

<ul>
	{#each pairs as [hash, distance]}
		<li>
			{hash} &rarr; {distance}
		</li>
	{/each}
</ul>
