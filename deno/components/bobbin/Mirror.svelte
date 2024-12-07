<script>
	/** @type {{ scales: [1] | [-1, 1], snippet: import('svelte').Snippet<[number]>  }} */
	let { scales, snippet } = $props();
</script>

{#each scales as scale}
	{@render snippet(scale)}
{/each}
