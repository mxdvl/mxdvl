<script context="module" lang="ts">
	import { Lang, pathLang } from "$lib/lang";
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ page }) => {
		const lang: Lang = pathLang(page.path);
		return {
			props: {
				lang
			}
		};
	};
</script>

<script lang="ts">
	import Header from "$lib/Header.svelte";
	import Footer from "$lib/Footer.svelte";

	import "../app.css";

	export let lang: Lang;
</script>

<Header {lang} />

<main>
	<slot />
</main>

<button
	on:click={() => {
		["light", "dark"].forEach((token) => window.document.body.classList.toggle(token));
	}}>switch</button
>

<Footer {lang} />

<style>
	main {
		padding: 1rem;
		margin: 0 auto;
	}
</style>
