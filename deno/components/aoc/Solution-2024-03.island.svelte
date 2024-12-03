<script>
	let input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

	let part = "two";

	const part_one_regex = /mul\((\d{1,3}),(\d{1,3})\)/g;

	$: matches = [...input.matchAll(part_one_regex)].map(
		([match, left, right]) => [match, left * right],
	);

	const part_two_regex = /mul\((\d{1,3}),(\d{1,3})\)|do(?:n\'t)?\(\)/g;

	$: part_two_matches = [...input.matchAll(part_two_regex)];
</script>

<textarea rows="7" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary
		>Part 1 – {matches.reduce(
			(accumulator, [, multiplication]) => accumulator + multiplication,
			0,
		)}</summary
	>

	<ol>
		{#each matches as [match, multiplication]}
			<li>{match} = {multiplication}</li>
		{/each}
	</ol>
</details>

<details open={part === "two"}>
	<summary
		>Part 2 – {part_two_matches.reduce(
			(accumulator, [match, left, right]) => {
				switch (match) {
					case "do()":
						accumulator.process = true;
						break;
					case "don't()":
						accumulator.process = false;
						break;
					default:
						accumulator.total += accumulator.process
							? Number(left) * Number(right)
							: 0;
						break;
				}

				return accumulator;
			},
			{ total: 0, process: true },
		).total}</summary
	>

	<ol>
		{#each part_two_matches as match, index}
			{@const yes = match[0] === "do()"}
			{@const no = match[0] === "don't()"}
			{@const disabled =
				!yes &&
				part_two_matches
					.slice(0, index)
					.findLast(([match]) => match.startsWith("do"))?.[0] ===
					"don't()"}
			<li class:yes class:no class:disabled>
				{match} [{index}, {disabled}]
			</li>
		{/each}
	</ol>
</details>

<style>
	.yes {
		color: forestgreen;
	}

	.no {
		color: firebrick;
	}

	.disabled {
		color: firebrick;
		font-weight: lighter;
	}

	ol {
		padding-left: 6ch;
	}
</style>
