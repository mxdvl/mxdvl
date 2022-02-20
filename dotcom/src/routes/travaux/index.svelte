<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { WorkUrls } from "../../../../content/src/routes/works/index.json";

	import { base } from "../works/index.svelte";

	export const load: Load = async ({ fetch, url }) => {
		const works = await fetch(new URL(`/works.json`, base).toString()).then((r) => r.json());

		return {
			props: {
				works,
			},
		};
	};
</script>

<script lang="ts">
	import Works from "$lib/Works.svelte";

	export let works: WorkUrls[];
</script>

## Selection de travaux

<Works lang="fr" {works} />
