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

	/** @typedef {"↑" | "↓" | "→" | "←" | "↻"} Direction */

	/**
	 * @param {Object} options
	 * @param {Map<Coordinates, string>} options.map
	 * @param {number} options.width
	 * @param {number} options.height
	 * @param {{x :number, y :number}} options.starting_position
	 * @param {Direction} [options.starting_direction]
	 * @returns {{ visited: Map<Coordinates, Set<Direction>>, loop: boolean }}
	 */
	function visit_map({
		map,
		width,
		height,
		starting_position,
		starting_direction = "↑",
	}) {
		let position = { ...starting_position };
		/** @type {Direction} */
		let direction = starting_direction;
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
				return { visited, loop: true };
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
				directions.add("↻");
				continue;
			}
			position.x += dx;
			position.y += dy;
		}
		return { visited, loop: false };
	}

	let part_one = $derived(
		visit_map({ map, width, height, starting_position }),
	);

	let part_two = $derived.by(() => {
		const { visited } = visit_map({
			map,
			width,
			height,
			starting_position,
		});

		/** @type {Map<Coordinates, Set<Coordinates>>} */
		const loop_positions = new Map();

		for (const [coordinates, directions] of visited) {
			const { x, y } = parse_coordinates(coordinates);
			for (const direction of directions) {
				if (direction === "↻") continue;
				const [dx, dy] = {
					"↑": [0, -1],
					"→": [1, -0],
					"↓": [-0, 1],
					"←": [-1, 0],
				}[direction];
				const next = format_coordinates({ x: x + dx, y: y + dy });
				if (!visited.has(next)) continue;
				if (
					x + dx === starting_position.x &&
					y + dy === starting_position.y
				) {
					// we cannot place a block where the guard is currently
					continue;
				}
				const adjusted_map = new Map(map);
				adjusted_map.set(next, "█");
				const { visited: loopy, loop } = visit_map({
					map: adjusted_map,
					width,
					height,
					starting_position,
				});

				if (loop) loop_positions.set(next, new Set(loopy.keys()));
				// if (loop) console.log({ loopy });
			}
		}

		return { visited, loop_positions };
	});

	/**
	 * @param {Set<Direction>} directions
	 * @returns {"╭" | "╮" | "╯" | "╰" | "│" | "─" | "┼"}
	 */
	function display_directions(directions) {
		return (
			{
				"↑↻→": "╭", //┏
				"→↻↓": "╮", // ┓
				"↓↻←": "╯", // ┛
				"←↻↑": "╰", // ┗
				"↑": "│", // ┃
				"↓": "│", // ┃
				"→": "─", // ━
				"←": "─", // ━
			}[[...directions].join("")] ?? "┼" // ╋
		);
	}

	/** @type {Coordinates | undefined} */
	let hovered = $state();

	let loop = $derived(part_two.loop_positions.get(hovered) ?? new Set());
</script>

<textarea rows="10" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – {part_one.visited.size}</summary>

	<div class="grid" style="--width:{width};--height:{height};--col:1rem">
		{#each map as [coordinates, cell]}
			{@const { x, y } = parse_coordinates(coordinates)}
			<span style="grid-area:{y + 1}/{x + 1}">
				{cell}
			</span>
		{/each}
		{#each part_one.visited as [coordinates, directions]}
			{@const { x, y } = parse_coordinates(coordinates)}
			{@const green =
				x === starting_position.x && y === starting_position.y}
			{@const [direction] = directions}
			<span class:green style="grid-area:{y + 1}/{x + 1}">
				{direction}
			</span>
		{/each}
	</div>
</details>

<details open={part === "two"}>
	<summary>Part 2 – {part_two.loop_positions.size}</summary>

	<div class="grid" style="--width:{width};--height:{height}">
		{#each map as [coordinates, cell]}
			{@const { x, y } = parse_coordinates(coordinates)}
			<li style="grid-area:{y + 1}/{x + 1}">
				{cell}
			</li>
		{/each}
		{#if part_two.loop_positions.has(hovered)}
			{@const { x, y } = parse_coordinates(hovered)}
			<span class="blue" style="grid-area:{y + 1}/{x + 1}">█</span>
		{/if}
		{#each part_two.visited as [coordinates, directions]}
			{@const { x, y } = parse_coordinates(coordinates)}
			{@const green =
				x === starting_position.x && y === starting_position.y}
			{@const red = part_two.loop_positions.has(coordinates)}
			{#if directions.size === 1}
				{@const [direction] = directions}
				{@const display = {
					"↑": "▲",
					"→": "▶",
					"↓": "▼",
					"←": "◀",
				}[direction]}
				<span class:red style="grid-area:{y + 1}/{x + 1};"
					>{display}</span
				>
			{/if}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -- it’s focusable! -->
			<span
				class:green
				class:red
				class:pointer={red}
				style="grid-area:{y + 1}/{x + 1};"
				data-directions={[...directions].join(" ")}
				tabindex={red ? 0 : undefined}
				onfocus={() => {
					hovered = coordinates;
				}}
				onblur={() => {
					hovered = undefined;
				}}
			>
				{display_directions(directions)}
			</span>
		{/each}
		{#each loop as coordinates, index}
			{@const { x, y } = parse_coordinates(coordinates)}
			{@const delay = (index - loop.size) * 60}
			<span
				class="blue pulse"
				style="grid-area:{y + 1}/{x + 1};animation-delay:{delay}ms;"
				>╬</span
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

	.grid {
		.red {
			background-color: Canvas;

			&:focus {
				background-color: var(--blue);
				color: Canvas;
			}

			&:hover {
				cursor: pointer;
			}
		}

		:not(.red) {
			pointer-events: none;
		}
	}

	.green {
		color: var(--green);
	}

	.blue {
		color: var(--blue);
	}

	.red {
		color: var(--red);
	}

	.pulse {
		animation: 1800ms pulse ease infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
		}
		72% {
			opacity: 1;
		}
		84% {
			opacity: 0.2;
		}
		96% {
			opacity: 1;
		}
	}
</style>
