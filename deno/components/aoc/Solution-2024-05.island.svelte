<script>
	let input = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

	let part = "two";

	const RULES = /^(\d+)\|(\d+)$/;

	$: rules = input.split("\n").reduce((accumulator, line) => {
		const matches = line.match(RULES)?.map(Number);
		if (!matches) return accumulator;
		const [, before, after] = matches;

		const first = accumulator.get(before) ?? {
			prev: new Set(),
			next: new Set([after]),
		};
		first.next.add(after);
		accumulator.set(before, first);

		const second = accumulator.get(after) ?? {
			prev: new Set([before]),
			next: new Set(),
		};
		second.prev.add(before);
		accumulator.set(after, second);

		return accumulator;
	}, /** @type {Map<number, {prev: Set<number>, next: Set<number>}>} */ (new Map()));

	const UPDATE = /^[\d,]+$/;

	$: updates = input.split("\n").flatMap((line) => {
		if (!line.match(UPDATE)) return [];

		return [line.split(",").map((digits) => parseInt(digits, 10))];
	});

	/**
	 * @template {T}
	 * @param {T[]} array
	 * @param {number} size
	 */
	function* window(array, size = 2) {
		let index = 0;
		while (index <= array.length - size) {
			yield array.slice(index, index + size);
			index++;
		}
	}

	$: incorrect = updates.filter((update) =>
		[...window(update)].some(
			([left, right]) =>
				rules.get(left)?.prev.has(right) ||
				rules.get(right).next.has(left),
		),
	);
</script>

<textarea rows="7" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary
		>Part 1 – {updates.reduce((accumulator, update) => {
			const valid = [...window(update)].every(
				([left, right]) =>
					!rules.get(left)?.prev.has(right) &&
					!rules.get(right).next.has(left),
			);
			const middle = Math.floor(update.length / 2);
			return valid ? accumulator + update[middle] : accumulator;
		}, 0)}</summary
	>

	<ul>
		{#each rules as [number, { prev, next }]}
			<li>
				{[...prev]} – <span class="green">{number}</span> - {[...next]}
			</li>
		{/each}
	</ul>

	<ol>
		{#each updates as update}
			{@const valid = [...window(update)].every(
				([left, right]) =>
					!rules.get(left)?.prev.has(right) &&
					!rules.get(right).next.has(left),
			)}
			{@const middle = Math.floor(update.length / 2)}
			<li class:red={!valid}>
				{update.slice(0, middle)}
				<span class:green={valid}>{update.at(middle)}</span>
				{update.slice(middle + 1)}
			</li>
		{/each}
	</ol>
</details>

<details open={part === "two"}>
	<summary
		>Part 2 – {incorrect.reduce((accumulator, update) => {
			const sorted = update.toSorted((a, b) => {
				if (rules.get(a)?.prev.has(b)) return +1;
				if (rules.get(b)?.next.has(a)) return +1;
				if (rules.get(a)?.next.has(b)) return -1;
				if (rules.get(b)?.prev.has(a)) return -1;
				return 0;
			});
			const middle = Math.floor(sorted.length / 2);
			return accumulator + sorted[middle];
		}, 0)}</summary
	>

	<ul>
		{#each incorrect as update}
			{@const sorted = update.toSorted((a, b) => {
				if (rules.get(a)?.prev.has(b)) return +1;
				if (rules.get(b)?.next.has(a)) return +1;
				if (rules.get(a)?.next.has(b)) return -1;
				if (rules.get(b)?.prev.has(a)) return -1;
				return 0;
			})}
			{@const middle = Math.floor(sorted.length / 2)}
			<li>
				{sorted.slice(0, middle)}
				<span class="green">{sorted.at(middle)}</span>
				{sorted.slice(middle + 1)}
			</li>
		{/each}
	</ul>
</details>

<style>
	.green {
		color: var(--green);
	}

	.red {
		color: var(--red);
	}
</style>
