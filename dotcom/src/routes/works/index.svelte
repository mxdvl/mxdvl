<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { Work } from "../../../../content/src/lib/works";

	export const base = "https://content.mxdvl.com/";

	export const load: Load = async ({ url, fetch }) => {
		const works = await fetch(new URL("/works.json", base).toString()).then((r) => r.json());

		return {
			props: {
				works,
			},
		};
	};
</script>

<script lang="ts">
	import Works from "$lib/Works.svelte";

	export let works: Work[];
</script>

## Selected works

<Works lang="en" {works} />
