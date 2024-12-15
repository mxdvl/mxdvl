<script>
	import {
		arrows,
		create_map,
		format_coordinates,
		parse_coordinates,
	} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`);

	let part = $state({ one: true, two: false });

	const width = 101;
	const height = 103;

	let robots = $derived.by(() => {
		const REGEX =
			/^p=(?<px>[-\d]+),(?<py>[-\d]+) v=(?<vx>[-\d]+),(?<vy>[-\d]+)$/;

		return input.split("\n").flatMap((robot) => {
			const matches = robot.match(REGEX);
			if (!matches?.groups) return [];

			const { px, py, vx, vy } = matches.groups;

			return {
				px: parseInt(px, 10),
				py: parseInt(py, 10),
				vx: parseInt(vx, 10),
				vy: parseInt(vy, 10),
			};
		});
	});

	let part_one = $derived.by(() => {
		console.log(robots);
		return "???";
	});

	let part_two = $derived.by(() => {
		return "???";
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details bind:open={part.one}>
	<summary>Part 1 – {part_one}</summary>
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
