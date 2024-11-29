<script>
	import Layout from "../../components/aoc/Layout.svelte";

	const year = 2023;
	const days = /** @type {const} */ ([
		// all of them days
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
	]);
</script>

<Layout {year} {days}>
	<ul>
		{#each days as day}
			<li>
				Day {String(day).replace("day/", "")} –
				<a href="https://adventofcode.com/2023/day/{day}">the problem</a>
				and
				<a href="/aoc/2023/day/{day}">my solution</a>
			</li>
		{/each}
	</ul>
</Layout>
