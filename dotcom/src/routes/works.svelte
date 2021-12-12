<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { Work } from "./works.json";

	export const load: Load = async ({ fetch }) => {
		const url = "/works.json";
		const res = await fetch(url);
		const works = (await res.json()).works;

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

## worky works

<Works lang="en" {works} />
