<script lang="ts">
	import { onMount } from "svelte";

	let lang: string;
	const languages = ["allo", "hi"];

	onMount(() => {
		lang = window?.navigator?.language;
	});
</script>

<h1>
	{#each languages as language, i}
		<a href="/{language}">{language}</a>{#if i < languages.length - 1}—{/if}
	{/each}
</h1>

<h2>({lang})</h2>
