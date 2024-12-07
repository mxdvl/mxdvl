<script>
	import {} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`);

	let part = $state("one");

	const LINE_REGEX = /(^\d+):([ \d]+)/;

	let tests = $derived(
		input.split("\n").reduce((accumulator, line) => {
			const [, total, numbers] = line.match(LINE_REGEX) ?? [];
			if (!total || !numbers) return accumulator;
			accumulator.push({
				total: parseInt(total, 10),
				numbers: numbers
					.trim()
					.split(" ")
					.map((n) => parseInt(n, 10)),
			});
			return accumulator;
		}, []),
	);

	let part_one = $derived.by(() => {
		/**
		 * @param {number} total
		 * @param {number} accumulator
		 * @param {('+' | '*')[]} left
		 * @param {number[]} right
		 */
		function find_valid_solutions(total, accumulator, left, right) {
			const [next, ...rest] = right;
			if (!next) return total === accumulator ? [left] : [];

			return ["+", "*"].flatMap((operation) => {
				switch (operation) {
					case "+": {
						const accumulated = accumulator + next;
						console.log({ accumulated, total, left });
						return accumulated <= total
							? find_valid_solutions(
									total,
									accumulated,
									left.concat("+"),
									rest,
								)
							: [];
					}
					case "*": {
						const accumulated = accumulator * next;
						return accumulated <= total
							? find_valid_solutions(
									total,
									accumulated,
									left.concat("*"),
									rest,
								)
							: [];
					}
				}
			});
		}

		/** @type {Array<Array<'+' | '*'>>} */
		const test_solutions = [];
		let calibration = 0;
		for (const { total, numbers } of tests) {
			const [first, ...rest] = numbers;
			const solutions = find_valid_solutions(total, first, [], rest);
			test_solutions.push(solutions);
			calibration += solutions.length > 0 ? total : 0;
		}
		return { test_solutions, calibration };
	});

	let part_two = $derived.by(() => {
		return "???";
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – {part_one.calibration}</summary>

	<ul>
		{#each tests as { total, numbers }, index}
			{@const solutions = part_one.test_solutions[index]}
			<li class:green={solutions?.length}>
				{total} – {numbers.join(" ? ")} ({solutions?.length})
			</li>
		{/each}
	</ul>
</details>

<details open={part === "two"}>
	<summary>Part 2 – {part_two}</summary>
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
