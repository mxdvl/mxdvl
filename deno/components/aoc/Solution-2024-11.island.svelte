<script>
	import {
		arrows,
		create_map,
		format_coordinates,
		parse_coordinates,
	} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */


	let input = $state(`125 17`);

	let part = $state({ one: true, two: false });

	let steps = $state(25);

	let stones = $derived(
		input.split(" ").flatMap((stone) => {
			const digits = parseInt(stone, 10);
			return Number.isInteger(digits) ? [BigInt(digits)] : [];
		}),
	);

	let part_one = $derived.by(() => {
		let arrangement = [...stones];
		let blinks = [[...arrangement]];
		// console.log(...arrangement);
		for (let step = 0; step < steps; step++) {
			let index = 0;
			while (index < arrangement.length) {
				const stone = arrangement[index];
				if (stone === undefined) break;
				if (stone === 0n) {
					arrangement[index] = 1n;
					index += 1;
					continue;
				}
				if (stone < 10n) {
					arrangement[index] = stone * 2024n;
					index += 1;
					continue;
				}
				const digits = BigInt(String(stone).length);
				// console.log(stone, String(stone), digits)
				if (digits % 2n === 0n) {
					const factor = 10n ** (digits / 2n);
					const [left, right] = [stone / factor, stone % factor];

					// console.log({ digits, stone, factor, left, right });
					arrangement.splice(index, 1, left, right);
					index += 2;
					continue;
				}

				arrangement[index] = stone * 2024n;
				index += 1;
			}
			// console.log(...arrangement);
			// blinks.push([...arrangement]);
			console.log(step, arrangement.length);
		}

		console.log(arrangement.length);

		return { arrangement, blinks };
	});

	let part_two = $derived.by(() => {
		return "???";
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details bind:open={part.one}>
	<summary>Part 1 – {part_one.arrangement.length}</summary>

	<input type="range" bind:value={steps} max={25} />
	{steps}
	<!-- 185677 -->
	<ul>
		{#each part_one.blinks as blink}
			<li>{blink.slice(0, 24).join(" ")}</li>
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
