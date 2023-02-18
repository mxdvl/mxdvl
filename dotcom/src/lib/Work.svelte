<script lang="ts" context="module">
	import type { Work } from "$lib/work";
</script>

<script lang="ts">
	import { cleanDate } from "$lib/Works.svelte";

	export let work: Work;
</script>

<section lang={work.metadata.lang}>
	<h2>{work.metadata.title}</h2>
	<h4>
		{cleanDate(work.metadata.date)}
	</h4>

	{@html work.content}
</section>
