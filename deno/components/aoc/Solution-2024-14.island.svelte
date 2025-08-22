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

	let part = $state({ one: false, two: true });

	let tiles = $derived.by(() => {
		const REGEX =
			/^p=(?<px>[-\d]+),(?<py>[-\d]+) v=(?<vx>[-\d]+),(?<vy>[-\d]+)$/;

		let width = 0;
		let height = 0;
		const robots = input.split("\n").flatMap((robot) => {
			const matches = robot.match(REGEX);
			if (!matches?.groups) return [];

			const [x, y, vx, vy] = matches
				.slice(1)
				.map((coordinate) => parseInt(coordinate, 10));

			width = Math.max(width, x);
			height = Math.max(height, y);

			return [{ x, y, vx, vy }];
		});

		const row = height / 2;
		const column = width / 2;

		height++;
		width++;

		if (!Number.isInteger(row) || !Number.isInteger(column)) {
			throw Error(`Invalid width (${width}) or height (${height})`);
		}

		return { robots, height, width, row, column };
	});

	let steps = $state(0);

	let part_one = $derived.by(() => {
		let step = 0;
		let { robots, width, height } = tiles;
		robots = robots.map((robot) => ({ ...robot }));
		while (step++ < steps && part.one) {
			for (const robot of robots) {
				robot.x = (robot.x + robot.vx + width) % width;
				robot.y = (robot.y + robot.vy + height) % height;
			}
		}

		let q1 = 0;
		let q2 = 0;
		let q3 = 0;
		let q4 = 0;

		for (const robot of robots) {
			if (robot.x > tiles.column && robot.y < tiles.row) {
				q1++;
			} else if (robot.x > tiles.column && robot.y > tiles.row) {
				q2++;
			} else if (robot.x < tiles.column && robot.y > tiles.row) {
				q3++;
			} else if (robot.x < tiles.column && robot.y < tiles.row) {
				q4++;
			}
		}

		const score = q1 * q2 * q3 * q4;

		return { robots, score };
	});

	let part_two = $derived.by(() => {
		let { robots, width, height } = tiles;
		// new objects
		robots = robots.map((robot) => ({ ...robot }));
		let step = 0;
		while (step++ < steps && part.two) {
			for (const robot of robots) {
				robot.x = (robot.x + robot.vx + width) % width;
				robot.y = (robot.y + robot.vy + height) % height;
			}
		}

		return { robots };
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details bind:open={part.one}>
	<summary>Part 1 – {part_one.score}</summary>

	<label>
		<input type="range" bind:value={steps} />
		{steps}
	</label>

	<div
		class="grid"
		style="--width:{tiles.width};--height:{tiles.height};gap: 1ch;"
	>
		<div
			style="grid-area:{[
				1,
				tiles.column + 1,
				tiles.height + 1,
				tiles.column + 2,
			].join('/')};background:var(--blue);"
		></div>
		<div
			style="grid-area:{[
				tiles.row + 1,
				1,
				tiles.row + 2,
				tiles.width + 1,
			].join('/')};background:var(--blue);"
		></div>
		{#each part_one.robots as { x, y }, index}
			{@const red = x === tiles.column || y === tiles.row}
			<div class:red style="grid-area:{y + 1}/{x + 1}">
				{index.toString(36)}
			</div>
		{/each}
	</div>
</details>

<details bind:open={part.two}>
	<summary>Part 2 – {part_two}</summary>

	<label>
		<input type="number" bind:value={steps} />
		{steps}
	</label>

	<div class="grid" style="--width:{tiles.width};--height:{tiles.height};">
		{#each part_two.robots as { x, y }, index}
			{@const red = index % 2 === 0}
			{@const green = !red}
			<div class:red class:green style="grid-area:{y + 1}/{x + 1}">█</div>
		{/each}
	</div>
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
