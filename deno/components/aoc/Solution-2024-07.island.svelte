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

	let part = $state("two");

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
		/** @type {Array<Array<'+' | '*'>>} */
		const test_solutions = [];
		let calibration = 0;
		for (const { total, numbers } of tests) {
			const [first, ...rest] = numbers;
			const solutions = find_valid_solutions(total, first, [], rest, [
				"+",
				"*",
			]);
			test_solutions.push(solutions);
			calibration += solutions.length > 0 ? total : 0;
		}
		return { test_solutions, calibration };
	});

	let part_two = $derived.by(() => {
		/** @type {Array<Array<'+' | '*' | '||'>>} */
		const test_solutions = [];
		let calibration = 0;
		for (const { total, numbers } of tests) {
			const [first, ...rest] = numbers;
			const solutions = find_valid_solutions(total, first, [], rest, [
				"+",
				"*",
				"||",
			]);
			test_solutions.push(solutions);
			calibration += solutions.length > 0 ? total : 0;
		}
		return { test_solutions, calibration };
	});

	/**
	 * @param {number} total
	 * @param {number} accumulator
	 * @param {('+' | '*' | '||')[]} left
	 * @param {number[]} right
	 * @param {('+' | '*' | '||')[]} operations
	 */
	function find_valid_solutions(total, accumulator, left, right, operations) {
		const [next, ...rest] = right;
		if (!next) return total === accumulator ? [left] : [];

		return operations.flatMap((operation) => {
			switch (operation) {
				case "+": {
					const accumulated = accumulator + next;
					return accumulated <= total
						? find_valid_solutions(
								total,
								accumulated,
								left.concat(operation),
								rest,
								operations,
							)
						: [];
				}
				case "*": {
					const accumulated = accumulator * next;
					return accumulated <= total
						? find_valid_solutions(
								total,
								accumulated,
								left.concat(operation),
								rest,
								operations,
							)
						: [];
				}
				case "||": {
					const factor = 10 ** Math.ceil(Math.log10(next + 1));
					const accumulated = accumulator * factor + next;
					return accumulated <= total
						? find_valid_solutions(
								total,
								accumulated,
								left.concat(operation),
								rest,
								operations,
							)
						: [];
				}
			}
		});
	}
</script>

<textarea rows="10" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – {part_one.calibration}</summary>

	<ul>
		{#each tests as { total, numbers }, index}
			{@const solutions = part_one.test_solutions[index]}
			<li class:green={solutions?.length}>
				{total} – {numbers.reduce(
					(accumulator, next, index) =>
						`${accumulator} ${solutions[0]?.[index - 1] ?? "?"} ${next}`,
				)} ({solutions?.length})
			</li>
		{/each}
	</ul>
</details>

<details open={part === "two"}>
	<summary>Part 2 – {part_two.calibration}</summary>

	<ul>
		{#each tests as { total, numbers }, index}
			{@const solutions = part_two.test_solutions[index]}
			<li class:green={solutions?.length}>
				{total} – {numbers.reduce(
					(accumulator, next, index) =>
						`${accumulator} ${solutions[0]?.[index - 1] ?? "?"} ${next}`,
				)} ({solutions?.length})
			</li>
		{/each}
	</ul>
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
