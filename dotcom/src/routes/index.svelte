<script context="module" lang="ts">
	import type { Lang } from "$lib/lang";
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async () => {
		const lang: Lang = "en";
		return {
			props: {
				lang,
			},
		};
	};
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	onMount(() => {
		window?.navigator?.language.startsWith("fr") ? goto("/allô") : goto("/hi");
	});
</script>

<h1>This page is never to be seen</h1>
