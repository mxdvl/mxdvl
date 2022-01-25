<script context="module" lang="ts">
	const tools = ["pace", "factors"] as const;
</script>

<h2>Some tools!</h2>

<ul>
	{#each tools as tool}
		<li><a href={`/tools/${tool}`}>{tool}</a></li>
	{/each}
</ul>
