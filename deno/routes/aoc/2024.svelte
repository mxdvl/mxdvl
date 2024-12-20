<script context="module">
	import Layout from "../../components/aoc/Layout.svelte";

	export const year = 2024;
	export const days = /** @type {const} */ (
		[
			// all them days…
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
		]
	);
</script>

<Layout {days} {year}>
	<ul>
	{#each days as day}
		<li><a href="/aoc/2024/day/{day}">Day {String(day).padStart(2, '0')}</a></li>
	{/each}
	<ul>
	<p>
		You can also<a href="/aoc/2023">have a peek at 2023</a>.
	</p>
</Layout>
