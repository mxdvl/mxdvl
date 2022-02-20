<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { WorkUrls } from "../../../../content/src/routes/works/index.json";

	// export const base = "https://content.mxdvl.com/";
	export const base = "http://content-git-add-content-mxdvl.vercel.app";

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

	export let works: WorkUrls[];
</script>

## Selected works

<Works lang="en" {works} />
