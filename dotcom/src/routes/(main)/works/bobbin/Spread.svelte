<script lang="ts">
	export let count: number;
</script>

<g data-count={count}>
	{#each Array.from({ length: count }, (_, index) => (360 / count) * index) as angle (angle)}
		<slot {angle}><text>Missing element</text></slot>
	{/each}
</g>
