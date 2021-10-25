<script lang="ts">
	import { languageStore } from "$lib/lang";

	import { onMount } from "svelte";

	const languages = ["allô", "hi"];

	onMount(() => {
		if (window?.navigator?.language.startsWith("fr")) languageStore.set("fr");
	});
</script>

<h1>Allô, c’est Max | Hi, it’s Max</h1>

<button
	on:click={() => {
		languageStore.set("en");
	}}>en</button
>
<button
	on:click={() => {
		languageStore.set("fr");
	}}>fr</button
>

<h2>({$languageStore})</h2>
