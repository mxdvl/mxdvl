<script>
	import { create_map, parse_coordinates } from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

	let debug = false;

	let part = "two";

	$: map = create_map(input);

	const directions = /** @type {const} */ ([
		{ direction: "→", dx: 1, dy: 0 },
		{ direction: "←", dx: -1, dy: 0 },
		{ direction: "↑", dx: 0, dy: -1 },
		{ direction: "↓", dx: 0, dy: 1 },
		{ direction: "↖", dx: -1, dy: -1 },
		{ direction: "↗", dx: 1, dy: -1 },
		{ direction: "↘", dx: 1, dy: 1 },
		{ direction: "↙", dx: -1, dy: 1 },
	]);

	$: matches = [...map].reduce(
		(accumulator, [coordinates, letter]) => {
			if (letter !== "X") {
				return accumulator;
			}
			const { x, y } = parse_coordinates(coordinates);

			for (const { direction, dx, dy } of directions) {
				const first = `${x},${y}`;
				const second = `${x + dx * 1},${y + dy * 1}`;
				const third = `${x + dx * 2},${y + dy * 2}`;
				const fourth = `${x + dx * 3},${y + dy * 3}`;
				if (
					map.get(second) === "M" &&
					map.get(third) === "A" &&
					map.get(fourth) === "S"
				) {
					accumulator.set(first, {
						directions:
							accumulator.get(first)?.directions.add(direction) ??
							new Set(direction),
						letter: "X",
					});
					accumulator.set(second, {
						directions:
							accumulator
								.get(second)
								?.directions.add(direction) ??
							new Set(direction),
						letter: "MAS",
					});
					accumulator.set(third, {
						directions:
							accumulator.get(third)?.directions.add(direction) ??
							new Set(direction),
						letter: "MAS",
					});
					accumulator.set(fourth, {
						directions:
							accumulator
								.get(fourth)
								?.directions.add(direction) ??
							new Set(direction),
						letter: "MAS",
					});
				}
			}

			return accumulator;
		},
		/** @type {Map<Coordinates, { letter: 'X' | 'MAS', directions: Set<typeof directions[number]['direction']>}>} */ (
			new Map()
		),
	);

	$: crosses = [...map].reduce((accumulator, [coordinates, letter]) => {
		if (letter !== "A") {
			return accumulator;
		}
		const { x, y } = parse_coordinates(coordinates);

		const up_right = [
			map.get(`${x - 1},${y + 1}`),
			map.get(`${x + 1},${y - 1}`),
		]
			.sort()
			.join("A");

		const down_right = [
			map.get(`${x - 1},${y - 1}`),
			map.get(`${x + 1},${y + 1}`),
		]
			.sort()
			.join("A");

		if (up_right === "MAS" && down_right === "MAS") {
			accumulator.set(`${x},${y}`, "A");
			accumulator.set(`${x - 1},${y - 1}`, "MS");
			accumulator.set(`${x + 1},${y - 1}`, "MS");
			accumulator.set(`${x + 1},${y + 1}`, "MS");
			accumulator.set(`${x - 1},${y + 1}`, "MS");
		}

		return accumulator;
	}, /** @type {Map<Coordinates, 'A' | 'MS'>} */ (new Map()));
</script>

<textarea rows="7" bind:value={input}></textarea>

<label>
	<input type="checkbox" bind:checked={debug} /> debug
</label>

<details open={part === "one"}>
	<summary
		>Part 1 – {[...matches.values()].reduce(
			(accumulator, { letter, directions }) =>
				letter === "X" ? accumulator + directions.size : accumulator,
			0,
		)}</summary
	>

	<div
		class="grid"
		style="grid-template-columns: repeat({input.indexOf('\n')},1ch);"
	>
		{#each map as [coordinates, letter]}
			{@const match = matches.get(coordinates)}
			<span
				class:red={match?.letter === "MAS"}
				class:green={match?.letter === "X"}>{match ? letter : '·'}</span
			>
		{/each}
	</div>

	{#if debug}
		<ol>
			{#each matches as [coordinates, { directions, letter }]}
				{#if letter === "X"}
					<li>
						{coordinates}
						<span class="green">
							{letter}
						</span>
						{[...directions].join("")}
					</li>
				{/if}
			{/each}
		</ol>
	{/if}
</details>

<details open={part === "two"}>
	<summary
		>Part 2 – {[...crosses.values()].filter((letter) => letter === "A")
			.length}</summary
	>

	<div
		class="grid"
		style="grid-template-columns: repeat({input.indexOf('\n')},1ch);"
	>
		{#each map as [coordinates, letter]}
			{@const match = crosses.get(coordinates)}
			<span class:green={match === "MS"} class:red={match === "A"}
				>{match ? letter : '·'}</span
			>
		{/each}
	</div>
</details>

<style>
	.grid {
		display: grid;
	}

	.green {
		color: var(--green);
	}

	.red {
		color: var(--red);
	}

	span:not(.green, .red) {
		font-weight: 100;
	}

	.green,
	.red {
		font-weight: bold;
	}

	ol {
		padding-left: 6ch;
	}
</style>
