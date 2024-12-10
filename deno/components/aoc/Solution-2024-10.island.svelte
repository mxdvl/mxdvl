<script>
	import {
		create_map,
		format_coordinates,
		parse_coordinates,
	} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`);

	let part = $state({ one: true, two: true });

	let { map, width, height, bases } = $derived.by(() => {
		const map = create_map(input);
		let width = 0;
		let height = 0;
		/** @type {Set<Coordinates>} */
		const bases = new Set();
		for (const [coordinates, altitude] of map) {
			const { x, y } = parse_coordinates(coordinates);
			width = Math.max(width, x);
			height = Math.max(height, y);
			const integer = parseInt(altitude, 10);
			Number.isInteger(integer) && map.set(coordinates, integer);
			integer === 0 && bases.add(coordinates);
		}

		return { map, width, height, bases };
	});

	/**
	 *
	 * @param {Map<Coordinates, number>} map
	 * @param {Coordinates} coordinates
	 * @param {number} altitude
	 */
	function get_next(map, coordinates, altitude) {
		const { x, y } = parse_coordinates(coordinates);
		return [
			[0, -1], // N
			[1, -0], // E
			[-0, 1], // S
			[-1, 0], // W
		].flatMap(([dx, dy]) => {
			const coordinates = format_coordinates({
				x: x + dx,
				y: y + dy,
			});
			return map.get(coordinates) === altitude + 1 ? [coordinates] : [];
		});
	}

	let part_one = $derived.by(() => {
		let total = 0;
		for (const base of bases) {
			let altitude = 0;
			let edge = new Set([base]);
			while (altitude < 9 && edge.size > 0) {
				edge = new Set(
					[...edge].flatMap((coord) =>
						get_next(map, coord, altitude),
					),
				);
				altitude++;
			}
			if (altitude === 9) {
				total += edge.size;
			}
		}
		return { total };
	});

	let part_two = $derived.by(() => {
		let total = 0;
		for (const base of bases) {
			let altitude = 0;
			let edge = get_next(map, base, altitude++);
			while (altitude < 9 && edge.length > 0) {
				const next = [...edge].flatMap((coord) =>
					get_next(map, coord, altitude),
				);
				edge = next;
				altitude++;
			}
			if (altitude >= 9) {
				total += edge.length;
			}
		}
		return { total };
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details bind:open={part.one}>
	<summary>Part 1 – {part_one.total}</summary>

	<div class="grid" style="--width:{width};">
		{#each map as [coordinates, altitude]}
			{@const { x, y } = parse_coordinates(coordinates)}
			{@const green = altitude === 0}
			{@const red = altitude === 9}
			<div class:green class:red style="grid-area:{y + 1}/{x + 1}">
				{altitude}
			</div>
		{/each}
	</div>
</details>

<details bind:open={part.two}>
	<summary>Part 2 – {part_two.total}</summary>


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
