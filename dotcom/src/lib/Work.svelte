<script lang="ts" context="module">
	import type { Work } from "../../../content/src/lib/works";
	import type { Lang } from "$lib/lang";
</script>

<script lang="ts">
	import { cleanDate } from "$lib/Works.svelte";

	export let work: Work;
	export let lang: Lang;
</script>

<section lang={work.content[lang] ? undefined : "en"}>
	<h2>{work.metadata.titles[lang] ?? work.metadata.titles.en}</h2>
	<h4>
		{cleanDate(work.metadata.date)}
	</h4>

	{@html work.content[lang] ?? work.content.en}
</section>
