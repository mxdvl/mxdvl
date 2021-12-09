<script context="module" lang="ts">
	import type { Lang } from "$lib/lang";
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async () => {
		const lang: Lang = "en";
		return {
			props: {
				lang
			}
		};
	};
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	onMount(() => {
		window?.navigator?.language.startsWith("fr") ? goto("/allo") : goto("/hi");
	});

	export let lang: Lang;
</script>

<h1>Allô, c’est Max | Hi, it’s Max</h1>

<h2>{lang}</h2>
