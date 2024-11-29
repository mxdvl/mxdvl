<script>
	const year = 2024;
	const days = /** @type {const} */ ([
		// all them days
		1]);
</script>

For the year {year}:

<ul>
	{#each days as day}
		<li>
			Day {String(day).replace("day/", "")} –
			<a href="https://adventofcode.com/{}year}/{day}">the problem</a> and
			<a href="/aoc/{year}/day/{day}">my solution</a>
		</li>
	{/each}
</ul>
