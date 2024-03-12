<script>
	export let data;

	$: ({ days } = data);
</script>

For the year 2023:

<ul>
	{#each days as day}
		<li>
			Day {day.replace("day/", "")} –
			<a href="https://adventofcode.com/2023/{day}">the problem</a> and
			<a href="/aoc/2023/{day}">my solution</a>
		</li>
	{/each}
</ul>
