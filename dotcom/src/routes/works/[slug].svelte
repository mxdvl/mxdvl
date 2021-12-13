<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { Work } from "$lib/works";
	import type { Lang } from "$lib/lang";

	import { pathLang } from "$lib/lang";

	export const load: Load = async ({ fetch, page }) => {
		const res = await fetch(`${page.path}.json`);
		const work = (await res.json()).work;

		const lang = pathLang(page.path);

		return {
			props: {
				work,
				lang,
			},
		};
	};
</script>

<script lang="ts">
	import { cleanDate } from "$lib/works";
	import Figure from "$lib/Figure.svelte";

	export let work: Work;
	export let lang: Lang;
</script>

<section lang={work.content[lang] ? undefined : "en"}>
	<h2>{work.metadata.titles[lang] ?? work.metadata.titles.en}</h2>
	<h4>
		{cleanDate(work.metadata.date)}
	</h4>

	{@html work.content[lang] ?? work.content.en}

	<Figure path="/content/works/solemn-silence/symetrie.jpg" />
</section>
