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

	let part = $state({ one: false, two: true });

	let part_one = $derived.by(() => {
		const to_visit = new Map(map);
		/** @type {Array<{type: string, size: number, fence: number}>} */
		const plots = [];
		for (const [coordinates, type] of to_visit) {
			console.log();
			console.log(type, coordinates);
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
				// todo: calculate fence size
			}
			console.log(type, neighbours.size, neighbours);
			plots.push({ type, size: neighbours.size, fence });
		}
		return { plots };
	});

	let part_two = $derived.by(() => {
		return "???";
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
	<summary>Part 2 – {part_two}</summary>
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
