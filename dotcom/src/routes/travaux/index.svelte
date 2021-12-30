<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import { Lang, pathLang } from "$lib/lang";
	import type { Work } from "$lib/works";

	export const load: Load = async ({ page, fetch }) => {
		const url = "/works.json";
		const res = await fetch(url);
		const works = (await res.json()).works;

		const lang: Lang = pathLang(page.path);

		return {
			props: {
				works,
				lang,
			},
		};
	};
</script>

<script lang="ts">
	import Works from "$lib/Works.svelte";

	export let works: Work[];
	export let lang: Lang;
</script>

## Selection de travaux

<Works {lang} {works} />
