<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { Work } from "../../../../content/src/lib/works";


	export const load: Load = async ({ fetch, params }) => {
		const { slug } = params;
		const { work } = await fetch(new URL(`/works/${slug}.json`, base).toString()).then((r) => r.json());

		return {
			props: {
				work,
			},
		};
	};
</script>

<script lang="ts">
	import WorkComponent from "$lib/Work.svelte";
import { base } from "./index.svelte";

	export let work: Work;
</script>

<WorkComponent {work} lang="en" />
