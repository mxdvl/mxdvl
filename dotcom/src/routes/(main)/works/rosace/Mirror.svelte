<script lang="ts">
	export let scales: [1] | [-1, 1];
</script>

{#each scales as scale}
	<slot {scale}><text>Missing shape to mirror</text></slot>
{/each}
