<script>
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`125 17`);

	let part = $state({ one: false, two: true });


	let stones = $derived(
		input.split(" ").flatMap((stone) => {
			const digits = parseInt(stone, 10);
			return Number.isInteger(digits) ? [BigInt(digits)] : [];
		}),
	);

	let part_one_steps = $state(25);
	let part_one = $derived.by(() => {
		let arrangement = [...stones];
		let blinks = [[...arrangement]];
		// console.log(...arrangement);
		for (let step = 0; step < part_one_steps; step++) {
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
			blinks.push([...arrangement]);
		}

		return { arrangement, blinks };
	});

	/**
	 * @template T
	 * @template U
	 * @param {(...args: U) => T} fn
	 * @returns {(...args: U) => T}
	 */
	function memoise(fn) {
		/** @type {Map<string, T>} */
		const cache = new Map();

		return function (...args) {
			const key = JSON.stringify(args);
			const cached = cache.get(key);
			if (cached) {
				return cached;
			}
			const result = fn(...args);
			cache.set(key, result);
			return result;
		};
	}
	/**
	 * @param {number} stone
	 * @param {steps} steps
	 * @param {(stone: number, steps: number) => number} [fn]
	 * @returns {number}
	 */
	function blink(stone, steps, fn = this) {
		if (steps <= 0) return 1;

		if (stone === 0) {
			return fn(1, steps - 1, fn);
		}

		const digits = String(stone).length;
		if (digits % 2 === 0) {
			const factor = 10 ** (digits / 2);
			const [left, right] = [Math.floor(stone / factor), stone % factor];
			return fn(left, steps - 1, fn) + fn(right, steps - 1, fn);
		}
		const result = fn(stone * 2024, steps - 1, fn);
		return result;
	}

	const blink_fast = memoise((stone, steps) =>
		blink(stone, steps, blink_fast),
	);

	let part_two_steps = $state(75);
	let part_two = $derived.by(() => {
		const cache = stones.map((stone) => ({
			stone,
			splits: blink_fast(Number(stone), part_two_steps),
		}));

		const count = cache.reduce(
			(accumulator, { splits }) => accumulator + splits,
			0,
		);

		return { cache, count };
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details bind:open={part.one}>
	<summary>Part 1 – {part_one.arrangement.length}</summary>

	<p>
		<input type="range" bind:value={part_one_steps} max={25} />
		{part_one_steps}
	</p>
	<ul>
		{#each part_one.blinks as blink}
			<li>{blink.slice(0, 24).join(" ")}</li>
		{/each}
	</ul>
</details>

<details bind:open={part.two}>
	<summary>Part 2 – {part_two.count}</summary>

	<p>
		<input type="range" bind:value={part_two_steps} max={75} />
		{part_two_steps}
	</p>

	<ol>
		{#each part_two.cache as { stone, splits }}
			<li>{stone} &rarr; {splits} stones</li>
		{/each}
	</ol>
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
