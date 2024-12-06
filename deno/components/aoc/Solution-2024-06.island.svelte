<script>
	import {
		create_map,
		parse_coordinates,
		format_coordinates,
	} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`);

	let part = $state("two");

	let { map, width, height, starting_position } = $derived.by(() => {
		const map = create_map(input);
		let width = 0;
		let height = 0;
		let starting_position = { x: -1, y: -1 };
		for (const [coordinates, element] of map) {
			const { x, y } = parse_coordinates(coordinates);
			width = Math.max(width, x + 1);
			height = Math.max(height, y + 1);
			if (element === ".") {
				map.delete(coordinates);
			}
			if (element === "#") {
				map.set(coordinates, "█");
			}
			if (element === "^") {
				map.delete(coordinates);
				starting_position = { x, y };
			}
		}
		return { map, width, height, starting_position };
	});

	/** @typedef {"↑" | "↓" | "→" | "←"} Direction */

	let part_one = $derived.by(() => {
		let position = { ...starting_position };
		/** @type {Direction} */
		let direction = "↑";
		/** @type {Map<Coordinates, Set<Direction>>} */
		const visited = new Map();
		while (
			0 <= position.x &&
			position.x <= width &&
			0 <= position.y &&
			position.y < height
		) {
			const coordinates = format_coordinates(position);
			const directions = visited.get(coordinates) ?? new Set();
			if (directions.has(direction)) {
				// we’re going in a loop!
				break;
			}
			directions.add(direction);
			visited.set(coordinates, directions);
			const [dx, dy] = {
				"↑": [0, -1],
				"→": [1, -0],
				"↓": [-0, 1],
				"←": [-1, 0],
			}[direction];
			const next = map.get(
				format_coordinates({ x: position.x + dx, y: position.y + dy }),
			);
			if (next === "█") {
				direction = {
					"↑": "→",
					"→": "↓",
					"↓": "←",
					"←": "↑",
				}[direction];
				continue;
			}
			position.x += dx;
			position.y += dy;
		}
		return { visited };
	});

	let part_two = $derived.by(() => {
		const { visited } = part_one;
		for (const [coordinates, directions] of visited) {
			const { x, y } = parse_coordinates(coordinates);
			if (x === starting_position.x && y === starting_position.y) {
				continue;
			}
			for (const direction of directions) {
				const [dx, dy] = {
					"↑": [0, -1],
					"→": [1, -0],
					"↓": [-0, 1],
					"←": [-1, 0],
				}[direction];
				const prev = visited.get(
					format_coordinates({ x: x - dx, y: y - dy }),
				);
				if (!prev?.has(direction)) {
					// we only check when adding a new obstactle in
					// the direction we’re currently going
					continue;
				}
				const adjusted_map = new Map(map);
				adjusted_map.set(coordinates, "█");
				// let’s see if turning now joins us back to a visited path
				// …
			}
		}
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – {part_one.visited.size}</summary>

	<ul class="grid" style="--width:{width};--height={height}">
		{#each map as [coordinates, cell]}
			{@const { x, y } = parse_coordinates(coordinates)}
			<li style="grid-area:{y + 1}/{x + 1}">
				{cell}
			</li>
		{/each}
		{#each part_one.visited as [coordinates, directions]}
			{@const { x, y } = parse_coordinates(coordinates)}
			{@const green =
				x === starting_position.x && y === starting_position.y}
			{@const [direction] = directions}
			<li class:green style="grid-area:{y + 1}/{x + 1}">
				{direction}
			</li>
		{/each}
	</ul>
</details>

<details open={part === "two"}>
	<summary>Part 2 – {part_two}</summary>

	<ul class="grid" style="--width:{width};--height={height}">
		{#each map as [coordinates, cell]}
			{@const { x, y } = parse_coordinates(coordinates)}
			<li style="grid-area:{y + 1}/{x + 1}">
				{cell}
			</li>
		{/each}
		{#each part_one.visited as [coordinates, directions]}
			{@const { x, y } = parse_coordinates(coordinates)}
			{@const green =
				x === starting_position.x && y === starting_position.y}
			<li class:green style="grid-area:{y + 1}/{x + 1}">
				{directions.size === 2
					? "┼"
					: directions.has("↑") || directions.has("↓")
						? "│"
						: "─"}
			</li>
		{/each}
	</ul>
</details>

<style>
	.grid {
		display: grid;
		padding: 0;
		list-style-type: none;
		grid-template-columns: repeat(var(--width), 1rem);
		grid-template-rows: repeat(var(--height), 1rem);
	}

	.green {
		color: var(--green);
	}

	.red {
		color: var(--red);
	}
</style>
