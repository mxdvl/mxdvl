<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { Work } from "$lib/works";
	import type { Lang } from "$lib/lang";
	import { pathLang } from "$lib/lang";

	export const load: Load = async ({ url, fetch }) => {
		const res = await fetch("/works.json");
		const { works } = await res.json();

		const lang: Lang = pathLang(url.pathname);

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

## Selected works

<Works {lang} {works} />
