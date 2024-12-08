<script>
	import {
		create_map,
		parse_coordinates,
		format_coordinates,
	} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`);
	function remap(letter) {
		return letter === "." ? undefined : letter;
	}

	let part = $state("two");

	const { width, height } = $derived.by(() => {
		const width = input.indexOf("\n");
		const height = input.split("\n").length;

		return { width, height };
	});

	const { map, antennas } = $derived.by(() => {
		const map = new Map(create_map(input, remap));
		/** @type {Map<string, Set<Coordinates>>} */
		const antennas = new Map();
		for (const [coordinates, frequency] of map) {
			const locations = antennas.get(frequency) ?? new Set();
			locations.add(coordinates);
			antennas.set(frequency, locations);
		}

		return { map, antennas };
	});

	let part_one = $derived.by(() => {
		/** @type {Set<Coordinates>} */
		const antinodes = new Set();
		for (const [frequency, locations] of antennas) {
			for (const coordinates of locations) {
				const { x, y } = parse_coordinates(coordinates);
				const others = locations.difference(new Set([coordinates]));
				for (const other of others) {
					const { x: x1, y: y1 } = parse_coordinates(other);
					const dx = x - x1;
					const dy = y - y1;

					const antinode = { x: x + dx, y: y + dy };
					if (
						0 <= antinode.x &&
						antinode.x < width &&
						0 <= antinode.y &&
						antinode.y < height
					) {
						antinodes.add(format_coordinates(antinode));
					}
				}
			}
		}

		return { antinodes };
	});

	let part_two = $derived.by(() => {
		/** @type {Set<Coordinates>} */
		const antinodes = new Set();
		for (const [frequency, locations] of antennas) {
			for (const coordinates of locations) {
				const { x, y } = parse_coordinates(coordinates);
				const others = locations.difference(new Set([coordinates]));
				for (const other of others) {
					const { x: x1, y: y1 } = parse_coordinates(other);
					const dx = x - x1;
					const dy = y - y1;

					let count = 0;
					while (true) {
						const antinode = {
							x: x + dx * count,
							y: y + dy * count,
						};
						count++;
						if (
							0 <= antinode.x &&
							antinode.x < width &&
							0 <= antinode.y &&
							antinode.y < height
						) {
							antinodes.add(format_coordinates(antinode));
							continue;
						}
						break;
					}
				}
			}
		}

		return { antinodes };
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – {part_one.antinodes.size}</summary>

	<div class="grid" style="--width:{width};--height:{height};--col:1rem">
		{#each map as [coordinates, cell]}
			{@const { x, y } = parse_coordinates(coordinates)}
			<span style="grid-area:{y + 1}/{x + 1}">
				{cell}
			</span>
		{/each}
		{#each part_one.antinodes as coordinates}
			{@const { x, y } = parse_coordinates(coordinates)}
			<span class="red" style="grid-area:{y + 1}/{x + 1}">_</span>
		{/each}
	</div>
</details>

<details open={part === "two"}>
	<summary>Part 2 – {part_two.antinodes.size}</summary>

	<div class="grid" style="--width:{width};--height:{height};--col:1rem">
		{#each map as [coordinates, cell]}
			{@const { x, y } = parse_coordinates(coordinates)}
			<span style="grid-area:{y + 1}/{x + 1}">
				{cell}
			</span>
		{/each}
		{#each part_two.antinodes as coordinates}
			{@const { x, y } = parse_coordinates(coordinates)}
			<span class="blue" style="grid-area:{y + 1}/{x + 1};z-index:-1"
				>█</span
			>
		{/each}
	</div>
</details>

<style>
	.grid {
		display: grid;
		padding: 0;
		list-style-type: none;
		grid-template-columns: repeat(var(--width), var(--col, 1ch));
		grid-template-rows: repeat(var(--height), 1.25rem);
	}

	.blue {
		color: var(--blue);
	}

	.green {
		color: var(--green);
	}

	.red {
		color: var(--red);
	}
</style>

    ...................
    ...................
    ...................
    .......YyYyY.......
    ...................
    .......R...S.......
    ......r.....s......
    ......R.....S......
    .....ra.....ts.....
    .......a...t.......
    ...................
    ...................
    ...................
    ...................
    ...................
    ...................
    ...................
    ...................
    ...................
