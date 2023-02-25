<script lang="ts">
	export let count: number;
</script>

<g data-count={count}>
	{#each Array.from({ length: count }, (_, i) => `rotate(${(360 / count) * i - 90})`) as transform}
		<g {transform}><slot /></g>
	{/each}
</g>
