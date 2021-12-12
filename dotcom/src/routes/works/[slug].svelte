<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { Work } from "../works.json";

	export const load: Load = async ({ fetch, page }) => {
		const res = await fetch(`${page.path}.json`);
		const work = (await res.json()).work;

		return {
			props: {
				work,
			},
		};
	};
</script>

<script lang="ts">
	import { cleanDate } from "$lib/date";

	export let work: Work;
</script>

<h2>{work.metadata.titles.en}</h2>
<h4>
	{cleanDate(work.metadata.date)}
</h4>

{@html work.content.en}
