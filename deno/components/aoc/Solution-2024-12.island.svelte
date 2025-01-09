<script>
	import {
		arrows,
		create_map,
		format_coordinates,
		parse_coordinates,
	} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`AAAA
BBCD
BBCC
EEEC`);

	let map = $derived(create_map(input));

	let part = $state({ one: true, two: false });

	let part_one = $derived.by(() => {
		const to_visit = new Map(map);
		/** @type {Array<{type: string, size: number, fence: number}>} */
		const plots = [];
		for (const [coordinates, type] of to_visit) {
			let fence = 0;
			const neighbours = new Set([coordinates]);
			for (const neighbour of neighbours) {
				const { x, y } = parse_coordinates(neighbour);
				for (const [dx, dy] of [
					[0, -1],
					[1, -0],
					[-0, 1],
					[-1, 0],
				]) {
					const next_coordinates = format_coordinates({
						x: x + dx,
						y: y + dy,
					});
					if (to_visit.get(next_coordinates) === type) {
						neighbours.add(next_coordinates);
					} else {
						fence++;
					}
				}
			}
			for (const neighbour of neighbours) {
				to_visit.delete(neighbour);
			}
			plots.push({ type, size: neighbours.size, fence });
		}
		return { plots };
	});

	let part_two = $derived.by(() => {
		const to_visit = new Map(map);
		/** @type {Array<{type: string, size: number, sides: number}>} */
		const plots = [];

		return {plots}
		// FIXME: get this to work…

		for (const [coordinates, type] of to_visit) {
			// const directions = /** @type {const} */ (["→", "←", "↑", "↓"]);
			/** @type {Set<`${Coordinates}:${Coordinates}`>} */
			const fence = new Set();
			const neighbours = new Set([coordinates]);
			for (const neighbour of neighbours) {
				const { x, y } = parse_coordinates(neighbour);
				for (const [dx, dy, direction] of /** @type {const} */ ([
					[0, -1, "↑"],
					[1, -0, "→"],
					[-0, 1, "↓"],
					[-1, 0, "←"],
				])) {
					const next_coordinates = format_coordinates({
						x: x + dx,
						y: y + dy,
					});
					if (to_visit.get(next_coordinates) === type) {
						neighbours.add(next_coordinates);
						fence.delete(`${neighbour}:${next_coordinates}`);
					} else {
						fence.add(`${neighbour}:${next_coordinates}`);
					}
				}
			}
			for (const neighbour of neighbours) {
				to_visit.delete(neighbour);
			}
			let [dx, dy] = [0, 0];
			for (const side of fence) {
				const [left, right] = side.split(":");
				const { x: x1, y: y1 } = parse_coordinates(left);
				const { x: x2, y: y2 } = parse_coordinates(right);
				console.log(x1 - x2, y1 - y2);
				// 	const [dx, dy] = {
				// 		"↑": [0, -1],
				// 		"→": [1, -0],
				// 		"↓": [-0, 1],
				// 		"←": [-1, 0],
				// 	}[direction];
				// 	const opposite = {
				// 		"↑": "↓",
				// 		"→": "←",
				// 		"↓": "↑",
				// 		"←": "→",
				// 	}[direction];
				// 	const facing = `${format_coordinates({ x: x + dx, y: y + dy })}:${opposite}`;
				// 	console.log(side, facing);
				// 	if (sides.has(facing)) {
				// 		sides.delete(side);
				// 		sides.delete(facing);
				// 	}
				// 	console.log(sides);
			}
			console.log();
			console.log(type);
			console.log(fence);
			plots.push({ type, size: neighbours.size, sides: fence.size });
		}
		return { plots };
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details bind:open={part.one}>
	<summary
		>Part 1 – {part_one.plots.reduce(
			(accumulator, { size, fence }) => accumulator + size * fence,
			0,
		)}</summary
	>

	<ul>
		{#each part_one.plots as { type, size, fence }}
			<li>{type}: area {size} &times; {fence} = {size * fence}</li>
		{/each}
	</ul>
</details>

<details bind:open={part.two}>
	<summary>Part 2 – {"???"}</summary>

	<ul>
		{#each part_two.plots as { type, size, sides }}
			<li>area {type}: {size} &times; {sides} = {size * sides}</li>
		{/each}
	</ul>
</details>

<hr />

<div class="grid">
	<div class="red"></div>
	<div class="green"></div>
	<div class="blue"></div>
</div>

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
