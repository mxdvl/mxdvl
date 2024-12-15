<script>
	import {
		arrows,
		create_map,
		format_coordinates,
		parse_coordinates,
	} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`);

	let part = $state({ one: true, two: false });

	const REGEX =
		/Button A: X\+(?<ax>\d+), Y\+(?<ay>\d+)\nButton B: X\+(?<bx>\d+), Y\+(?<by>\d+)\nPrize: X=(?<px>\d+), Y=(?<py>\d+)/m;

	let machines = $derived.by(() => {
		return input.split("\n\n").flatMap((machine) => {
			const result = machine.match(REGEX);
			if (!result?.groups) return [];

			const { ax, ay, bx, by, px, py } = result.groups;

			return [
				{
					ax: parseInt(ax, 10),
					ay: parseInt(ay, 10),
					bx: parseInt(bx, 10),
					by: parseInt(by, 10),
					px: parseInt(px, 10),
					py: parseInt(py, 10),
				},
			];
		});
	});

	let part_one = $derived.by(() => {
		const presses = machines.flatMap(({ ax, ay, bx, by, px, py }) => {
			const a = (bx * py - by * px) / (ay * bx - ax * by);
			if (!Number.isInteger(a)) return [];
			const b = (px - a * ax) / bx;
			if (!Number.isInteger(b)) return [];
			if (b > 100 || a > 100) return [];

			const tokens = a * 3 + b * 1;

			return [{ ax, ay, bx, by, px, py, a, b, tokens }];
		});

		return presses;
	});

	let part_two = $derived.by(() => {
		return "???";
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details bind:open={part.one}>
	<summary
		>Part 1 – {part_one.reduce(
			(accumulator, { tokens }) => accumulator + tokens,
			0,
		)}</summary
	>

	<ol>
		{#each machines as { ax, ay, bx, by, px, py }}
			<li>A({ax},{ay}) – B({bx},{by}) – P({px},{py})</li>
		{/each}
	</ol>
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
