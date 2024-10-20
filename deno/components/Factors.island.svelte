<script>
	import Number from "./Number.svelte";

	/** @type {import('./lang.js').Lang} */
	export let lang = "en";

	/** @param {number} n */
	const getFactors = (n) => {
		const factors = [n];

		for (var i = 2; i <= Math.sqrt(n); i++) {
			if (n % i == 0) {
				factors.push(i);

				if (n / i != i) factors.push(n / i);
			}
		}

		return factors.sort((a, b) => a - b);
	};

	const max = 100_000_000_003;

	let number = 12_000;

	$: factors = getFactors(number);
</script>

<p>
	<Number min={1} {max} bind:value={number} />
</p>

<ul>
	{#if factors.length === 1}
		<li>
			{factors[0]}
			{#if lang === "fr"}
				est premier!
			{:else}
				is prime!
			{/if}
		</li>
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
