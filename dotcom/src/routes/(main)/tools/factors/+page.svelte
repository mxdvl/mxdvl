<script context="module">
	/** @param {number} n */
	export const getFactors = (n) => {
		const factors = [n];

		for (var i = 2; i <= Math.sqrt(n); i++) {
			if (n % i == 0) {
				factors.push(i);

				if (n / i != i) factors.push(n / i);
			}
		}

		return factors.sort((a, b) => a - b);
	};

	export const max = 100_000_000_003;
</script>

<script>
	import Alternates from "$lib/Alternates.svelte";
	import Number from "$lib/Number.svelte";

	const max = 100_000_000_003;

	let number = 12_000;

	$: factors = getFactors(number);
</script>

<Alternates en="/tools/factors" fr="/outils/facteurs" />

<p>
	<Number min={1} {max} bind:value={number} />
</p>

<ul>
	{#if factors.length === 1}
		<li>{factors[0]} is prime!</li>
	{:else}
		{#each factors as factor}
			<li>{factor}</li>
		{/each}
	{/if}
</ul>

<style>
	ul {
		display: flex;
		list-style-type: none;
		padding: var(--grid) 0;
		margin: 0;
		gap: var(--grid);
		flex-wrap: wrap;
		justify-content: center;
	}

	li {
		border-radius: 1px;
		background-color: var(--skies);
		outline: 2px solid var(--skies);
		outline-offset: -1px;
		padding: calc(var(--grid) / 2);
	}
</style>
