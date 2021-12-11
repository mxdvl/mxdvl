<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { Work } from "../works.json";
	import Works from "../works.svelte";

	export const load: Load = async ({ fetch, page }) => {
		const res = await fetch(`${page.path}.json`);
		const work = (await res.json()).work;

		return {
			props: {
				work
			}
		};
	};
</script>

<script lang="ts">
	export let work: Work;
</script>

<h2>{work.metadata.title}</h2>
<h4>
	{work.metadata.date}
</h4>

{@html work.content.html}
