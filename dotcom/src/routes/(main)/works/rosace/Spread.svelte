<script lang="ts">
	export let count: number;
</script>

<g data-count={count}>
	{#each Array.from({ length: count }, (_, i) => (360 / count) * i) as angle}
		<slot {angle}><text>Missing element</text></slot>
	{/each}
</g>
