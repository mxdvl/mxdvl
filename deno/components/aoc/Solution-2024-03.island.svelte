<script>
	let input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

	let part = "one";

	const part_one_regex = /mul\((\d{1,3}),(\d{1,3})\)/g;

	$: matches = [...input.matchAll(part_one_regex)].map(
		([match, left, right]) => [match, left * right],
	);


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
	<summary>Part 2 – ???</summary>


</details>

<style>
	.tolerance {
		color: firebrick;
		font-weight: bold;
	}

	.safe {
		color: forestgreen;
		font-weight: bold;
	}

	ol {
		padding-left: 6ch;
	}
</style>
