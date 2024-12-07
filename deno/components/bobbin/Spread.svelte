<script>
	/** @type {{count: number, import('svelte').Snippet}} */
	let { count, children } = $props();
</script>

<g data-count={count}>
	{#each Array.from({ length: count }, (_, index) => (360 / count) * index) as angle (angle)}
		{#if children}
			{@render children({ angle })}
		{:else}
			<text>Missing element</text>
		{/if}

	{/each}
</g>
