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
	 * @param {ReadonlyMap<Coordinates, string>} options.map
	 * @param {number} options.width
	 * @param {number} options.height
	 * @param {{x: readonly number, y: readonly number}} options.starting_position
	 * @param {Direction} [options.starting_direction]
	 * @param {ReadonlArray<[Coordinates, Direction]>} [options.already_visited]
	 * @returns {{ visited: Array<[Coordinates, Direction]>, loop: boolean }}
	 */
	function visit_map({
		map,
		width,
		height,
		starting_position,
		starting_direction = "↑",
		already_visited = [],
	}) {
		let position = { ...starting_position };
		/** @type {Direction} */
		let direction = starting_direction;
		/** @type {Array<[Coordinates, Direction]>} */
		const visited = [...already_visited];
		const been = new Set(
			visited.map(
				([coordinates, direction]) => `${coordinates}:${direction}`,
			),
		);

		while (
			0 <= position.x &&
			position.x <= width &&
			0 <= position.y &&
			position.y < height
		) {
			const coordinates = format_coordinates(position);
			const key = `${coordinates}:${direction}`;
			if (been.has(key)) {
				// we’re going in a loop!
				return { visited, loop: true };
			}
			visited.push([coordinates, direction]);
			been.add(key);
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
				visited.push([coordinates, "↻"]);
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
		const { visited } = part_one;
		/** @type {Map<Coordinates, Array<[Coordinates, Direction]>>} */
		const loop_positions = new Map();

		/** @type {Set<Coordinates>} */
		const been = new Set();
		for (const [index, [coordinates, direction]] of visited.entries()) {
			been.add(coordinates);
			const { x, y } = parse_coordinates(coordinates);
			if (index === 0) continue;
			if (direction === "↻") continue;

			const [dx, dy] = {
				"↑": [0, -1],
				"→": [1, -0],
				"↓": [-0, 1],
				"←": [-1, 0],
			}[direction];
			const next = format_coordinates({ x: x + dx, y: y + dy });
			if (map.has(next)) continue;
			if (been.has(next)) continue;
			const adjusted_map = new Map(map);
			adjusted_map.set(next, "█");
			const { visited: loopy, loop } = visit_map({
				map: adjusted_map,
				width,
				height,
				starting_position: { x, y },
				starting_direction: direction,
				already_visited: visited.slice(0, index),
			});

			if (loop) loop_positions.set(next, loopy.slice(index));
		}

		return { visited, loop_positions };
	});

	/**
	 * @param {Direction[]} directions
	 * @returns {"╭" | "╮" | "╯" | "╰" | "│" | "─" | "┼" | undefined}
	 */
	function display_directions(directions) {
		return {
			"": "┼", // ╋
			"↑↻→": "╭", //┏
			"→↻↓": "╮", // ┓
			"↓↻←": "╯", // ┛
			"←↻↑": "╰", // ┗
			"↑↑↑": "│", // ┃
			"↓↓↓": "│", // ┃
			"↓↓": "│", // ┃
			"→→→": "─", // ━
			"←←←": "─", // ━
		}[directions.join("")];
	}

	/** @type {number} */
	let hovered_index = $state(Infinity);

	/** @type {Coordinates | undefined} */
	let hovered = $derived(part_two.visited[hovered_index]?.[0]);

	let loop = $derived(part_two.loop_positions.get(hovered) ?? []);
</script>

<textarea rows="10" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary
		>Part 1 – {new Set(part_one.visited.map(([coordinates]) => coordinates))
			.size}</summary
	>

	<div class="grid" style="--width:{width};--height:{height};--col:1rem">
		{#each map as [coordinates, cell]}
			{@const { x, y } = parse_coordinates(coordinates)}
			<span style="grid-area:{y + 1}/{x + 1}">
				{cell}
			</span>
		{/each}
		{#each part_one.visited as [coordinates, direction]}
			{@const { x, y } = parse_coordinates(coordinates)}
			{@const green =
				x === starting_position.x && y === starting_position.y}
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
		{#if hovered}
			{@const { x, y } = parse_coordinates(hovered)}
			<span class="blue" style="grid-area:{y + 1}/{x + 1}">█</span>
		{/if}
		{#each part_two.visited as [coordinates, direction], index}
			{@const { x, y } = parse_coordinates(coordinates)}
			{@const green =
				x === starting_position.x && y === starting_position.y}
			{@const red = part_two.loop_positions.has(coordinates)}
			{@const directions = part_two.visited
				.slice(index - 1, index + 2)
				.map(([, direction]) => direction)}
			{@const display_direction = display_directions(directions)}
			{#if display_direction}
				{@const display_arrow =
					(display_direction === "─" || display_direction === "│") &&
					index % 3 === 0 &&
					index <= hovered_index
						? {
								"↑": "▲",
								"→": "▶",
								"↓": "▼",
								"←": "◀",
							}[direction]
						: undefined}
				{#if display_arrow}
					<span class:red style="grid-area:{y + 1}/{x + 1};"
						>{display_arrow}</span
					>
				{/if}

				<!-- svelte-ignore a11y_no_noninteractive_tabindex -- it’s focusable! -->
				<span
					class:green
					class:red
					class:pointer={red}
					class:cut={index >= hovered_index}
					style="grid-area:{y + 1}/{x + 1};"
					data-direction={direction}
					tabindex={red ? 0 : undefined}
					onfocus={() => {
						hovered_index = index;
					}}
					onblur={() => {
						hovered_index = Infinity;
					}}
				>
					{display_directions(directions)}
				</span>
			{/if}
		{/each}
		{#each loop.slice() as [coordinates, index]}
			{@const { x, y } = parse_coordinates(coordinates)}
			{@const delay = (index - loop.length) * 60}
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
			background-color: transparent;

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

		.cut {
			opacity: 0.24;
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
