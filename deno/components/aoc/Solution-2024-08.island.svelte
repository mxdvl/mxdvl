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

	let part = $state("one");

	const { width, height } = $derived.by(() => {
		const width = input.indexOf("\n");
		const height = input.split("\n").length;

		return { width, height };
	});

	let part_one = $derived.by(() => {
		const map = new Map(create_map(input, remap));
		/** @type {Map<string, Set<Coordinates>>} */
		const antennas = new Map();
		for (const [coordinates, frequency] of map) {
			const locations = antennas.get(frequency) ?? new Set();
			locations.add(coordinates);
			antennas.set(frequency, locations);
		}
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
					console.log(frequency, antinode);
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

		return { map, antennas, antinodes };
	});

	let part_two = $derived.by(() => {
		return "???";
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – {part_one.antinodes.size}</summary>

	<div class="grid" style="--width:{width};--height:{height};--col:1rem">
		{#each part_one.map as [coordinates, cell]}
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
	<summary>Part 2 – {part_two}</summary>
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
