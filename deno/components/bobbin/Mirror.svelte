<script>
	/** @type {{ scales: [1] | [-1, 1] }} */
	let { scales } = $props();
</script>

{#each scales as scale}
	{#if children}
		{@render children({ scale, })}
	{:else}
		<text>Missing shape to mirror</text>
	{/if}
{/each}
