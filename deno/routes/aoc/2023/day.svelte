<script>
	const days = /** @type {const} */ ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
</script>

For the year 2023:

<ul>
	{#each days as day}
		<li>
			Day {String(day).replace("day/", "")} –
			<a href="https://adventofcode.com/2023/{day}">the problem</a> and
			<a href="/aoc/2023/day/{day}">my solution</a>
		</li>
	{/each}
</ul>
