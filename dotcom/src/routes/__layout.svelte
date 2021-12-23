<script context="module" lang="ts">
	import { Lang, pathLang } from "$lib/lang";
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ page }) => {
		const lang: Lang = pathLang(page.path);
		return {
			props: {
				lang,
			},
		};
	};
</script>

<script lang="ts">
	import Header from "$lib/Header.svelte";
	import Footer from "$lib/Footer.svelte";

	import "../app.css";
	import "../ibm-plex-var.css";

	export let lang: Lang;
</script>

<Header {lang} />

<main>
	<slot />
</main>

<Footer {lang} />

<style>
	main {
		padding: var(--grid-double) 0;
		margin: 0 auto;
	}
</style>
