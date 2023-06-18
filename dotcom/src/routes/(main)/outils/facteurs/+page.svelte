<script>
	import Alternates from "$lib/Alternates.svelte";
	import Number from "$lib/Number.svelte";
	import { getFactors, max } from "../../tools/factors/+page.svelte";

	let number = 12_000;

	$: factors = getFactors(number);
</script>

<Alternates en="/tools/factors" fr="/outils/facteurs" />

<p>
	<Number min={1} {max} bind:value={number} />
</p>

<ul>
	{#if factors.length === 1}
		<li>{factors[0]} est un nombre premier!</li>
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
