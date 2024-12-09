<script>
	/** @type {{count: number, snippet: import('svelte').Snippet<[number]>}} */
	let { count, snippet } = $props();

	const angles = $derived(Array.from({ length: count }, (_, index) => (360 / count) * index))
</script>

<g data-count={count}>
	{#each angles as angle (angle)}
		{@render snippet?.(angle)}
	{/each}
</g>
