<script>
	let input = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

	$: lines = input
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l.match(/^\d+$/));

	let steps = 1;

	const directions = /** @type {const} @satisfies {Record<string, {x: -1 | 0 | 1, y: -1 | 0 | 1}>} */ ({
		N: { x: 0, y: -1 },
		E: { x: 1, y: 0 },
		S: { x: 0, y: 1 },
		W: { x: -1, y: 0 },
	});

	/** @typedef {`${number},${number}`} Coordinates */
	/** @typedef {keyof typeof directions} Direction */

	/** @typedef {`${number},${number},${Direction}`} Crucible */

	/**
	 * @param {Object} coordinates
	 * @param {number} coordinates.x
	 * @param {number} coordinates.y
	 * @returns {Coordinates}
	 */
	const format = ({ x, y }) => `${x},${y}`;

	/**
	 * @param {Coordinates} coordinates
	 * @returns {{x: number, y: number }}
	 */
	const parse = (coordinates) => {
		const [x = -1, y = -1] = coordinates.split(",").map(Number);
		return { x, y };
	};

	/**
	 * @param {Crucible} crucible
	 */
	const parse_crucible = (crucible) => {
		const [x = -1, y = -1] = crucible.split(",").map(Number);
		const direction = crucible.split(",").at(-1) ?? "E";
		return { x, y, direction };
	};

	$: rows = lines.length;
	$: cols = lines[0]?.length ?? 0;

	$: heatmap = lines
		.flatMap((line, y) =>
			line
				.split("")
				.map(Number)
				.map((digit, x) => ({ digit, y, x })),
		)
		.reduce((heatmap, { digit, x, y }) => {
			heatmap.set(format({ x, y }), digit);
			return heatmap;
		}, /** @type {Map<Coordinates, number>} */ (new Map()));

	/**
	 *
	 * @param {Crucible} crucible
	 */
	const get_potential_positions = (crucible) => {
		const { x, y, direction } = parse_crucible(crucible);

		const potentials = {
			E: ["N", "S", "EN", "ES", "EEN", "EES"],
			S: ["W", "E", "SW", "SE", "SSW", "SSE"],
		};
		//   1 2 3
		//   │ │ │
		//  ─┼─┼─┤
		//   │ │ │
		//   4 5 6

		//         1 2 3
		//         │ │ │ │ │ │ │ │ │ │
		//  ───────┼─┼─┼─┼─┼─┼─┼─┼─┼─┤
		//         │ │ │ │ │ │ │ │ │ │
		//         4 5 6
	};

	/**
	 * @param {Coordinates} start
	 * @param {Map<Coordinates, number>} heatmap
	 * @param {number} steps
	 */
	function* bfs(start, heatmap, steps = Infinity) {
		/** @type {Crucible[]} */
		const queue = [`${start},E`, `${start},S`];
		let heat_loss = 0;
		for (const crucible of queue) {
			if (heat_loss++ >= steps) return;
			const { x, y, direction } = parse_crucible(crucible);

			// if (heat_loss <= 3) queue.push(`9,${heat_loss}`);
			// yield heatmap.get(item);
			heat_loss++;
		}
		yield { heat_loss };
		return;
	}

	$: {
		let g = bfs(`0,0`, heatmap, 1);
		console.log([...g], g.next(), g.next(-1));
	}
</script>

<textarea cols="20" rows="13" bind:value={input}></textarea>

<input type="range" bind:value={steps} min="1" max="1000" /> First {steps} steps

<hr />

<h2>Part 1</h2>

<p>
	Total heat loss: <strong>{lines.length}</strong>
</p>

<ul class="grid" style="--rows:{rows};--cols:{cols}">
	{#each heatmap as [coord, heat_loss]}
		{@const { x, y } = parse(coord)}
		<li class="loss" style="grid-area:{y + 1} / {x + 1};opacity:0.{heat_loss}"></li>
	{/each}
	<li style="grid-area: 1 / 1;">S</li>
</ul>

<style>
	.grid {
		display: grid;
		list-style-type: none;
		padding: 0;
		grid-template-rows: repeat(var(--cols), 1rem);
		grid-template-columns: repeat(var(--rows), 1rem);

		width: min-content;

		border: 0.5ch solid var(--blue);
	}

	.grid .loss {
		background-color: var(--blue);
	}
</style>
