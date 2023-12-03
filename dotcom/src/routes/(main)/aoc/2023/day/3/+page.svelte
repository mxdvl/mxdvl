<script>
	let input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

	$: lines = input.split("\n");

	$: rows = lines.length;
	$: cols = lines[0]?.length ?? 1;

	/** @typedef {`${number},${number}`} Coordinates */

	/** @type {Set<Coordinates>} */
	$: symbols = new Set(
		lines.flatMap((line, y) =>
			Array.from(line.matchAll(/[^.\d]/g)).map(({ index: x }) => /** @type {const} */ (`${x ?? -1},${y}`)),
		),
	);

	$: numbers = lines.flatMap((line, y) =>
		Array.from(line.matchAll(/\d+/g)).map((match) => ({
			value: Number(match[0]),
			x: match.index ?? -2,
			y,
		})),
	);

	$: part_one = numbers.filter(({ value, x, y }) =>
		Array.from({ length: value.toString().length + 2 }, (_, index) => index - 1 + x).some(
			(x) => symbols.has(`${x},${y - 1}`) || symbols.has(`${x},${y}`) || symbols.has(`${x},${y + 1}`),
		),
	);

	/** @type {(a: number, b: number) => number}*/
	const sum = (a, b) => a + b;

	/** @type {(a: number, b: number) => number}*/
	const product = (a, b) => a * b;

	/** @type {Map<Coordinates, number[]>} */
	$: gears = new Map(
		lines.flatMap((line, y) =>
			Array.from(line.matchAll(/\*/g)).map(({ index: x }) => /** @type {const} */ ([`${x ?? -1},${y}`, []])),
		),
	);

	/** @type {number[]} */
	$: part_two = Array.from(gears).flatMap((gear) => {
		const [x = -1, y = -1] = gear[0].split(",").map(Number);

		const matches = numbers.filter((number) => {
			const width = String(number.value).length;
			const within_x = number.x - 1 <= x && x <= number.x + width;
			const within_y = number.y - 1 <= y && y <= number.y + 1;
			console.log(number.value, { within_x, within_y });
			return within_x && within_y;
		});

		if (matches.length !== 2) return [];

		return matches.map(({ value }) => value).reduce(product);
	});
</script>

<textarea cols="20" rows="10" bind:value={input}></textarea>

<pre>Part two: {part_two.reduce(sum)}</pre>

<p>
	Part one: {part_one.map(({ value }) => value).reduce(sum)}
</p>

<ul style="--rows:{rows};--cols:{cols}">
	{#each symbols as coordinates}
		{@const [x, y] = coordinates.split(",")}
		<li
			class="symbol"
			class:gear={gears.has(coordinates)}
			style="grid-column-start:{Number(x) + 1};grid-row-start:{Number(y) + 1}"
		></li>
	{/each}

	{#each part_one as { value, x, y }}
		<li
			class="number"
			style="
			grid-column-start:{Math.max(x - 1, 0) + 1};
			grid-column-end: {Math.min(x + value.toString().length + 1, cols) + 1};
			grid-row-start:{Math.max(y - 1, 0) + 1};
			grid-row-end: {Math.min(y + 1, rows) + 2};
			"
		>
			{value}
		</li>
	{/each}
</ul>

<ol>
	{#each part_one as { value, x, y }}
		<li>{`${value} : ${x},${y}`}</li>
	{/each}
</ol>

<style>
	textarea {
		font-family: monospace;
	}

	ul {
		display: grid;
		list-style-type: none;
		padding: 0;
		grid-template-rows: repeat(var(--cols), 1rem);
		grid-template-columns: repeat(var(--rows), 1rem);

		width: min-content;

		border: 1px solid var(--ocean);
	}

	li.symbol {
		background-color: var(--ocean);
	}

	li.gear {
		background-color: var(--glint);
	}

	li.number {
		background-color: rgba(204, 204, 204, 0.667);
		text-align: center;
		margin: 0.125em;
	}
</style>
