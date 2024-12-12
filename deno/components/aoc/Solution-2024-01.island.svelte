<script>
	let input = $state(`3   4
4   3
2   5
1   3
3   9
3   3`);

	let part = $state("two");

	let lists = $derived.by(() => {
		const lists = [[], []];

		for (let line of input.split("\n")) {
			const [left, right] = line.split("   ").map(Number);
			lists[0].push(left);
			lists[1].push(right);
		}

		for (let list of lists) {
			list.sort();
		}

		return lists;
	});

	let part_one = $derived.by(() => {
		let distance = 0;

		for (let index = 0; index < lists[0].length; index++) {
			distance += Math.abs(lists[0][index] - lists[1][index]);
		}

		return distance;
	});

	let part_two = $derived.by(() => {
		let similarity = 0;
		for (let left of lists[0]) {
			const count = lists[1].filter((right) => right === left).length;
			similarity += left * count;
		}
		return similarity;
	});
</script>

<textarea>{input}</textarea>

<details open={part === "one"}>
	<summary>Part 1</summary>
	<p>{part_one}</p>
	<ol>
		{#each lists[0] as left, index}
			{@const right = lists[1][index]}
			<li>{left} – {right} : {Math.abs(left - right)}</li>
		{/each}
	</ol>
</details>

<details open={part === "two"}>
	<summary>Part 2</summary>
	<p>{part_two}</p>
	<ol>
		{#each lists[0] as left}
			{@const count = lists[1].filter((right) => right === left).length}
			<li class:some={count > 0}>
				{left} &times; {count} = {left * count}
			</li>
		{/each}
	</ol>
</details>

<style>
	.some {
		color: var(--red);
		font-weight: bold;
	}
</style>
