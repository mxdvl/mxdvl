<script>
	export let data;

	$: ({ days } = data);
</script>

<ol>
	{#each days as day}
		<li>
			<a href="https://adventofcode.com/2023/{day}">the problem</a> and
			<a href="/aoc/2023/{day}">my solution</a>
		</li>
	{/each}
</ol>
