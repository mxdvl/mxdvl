<script context="module" lang="ts">
	import type { Lang } from "$lib/lang";
	import { pathLang } from "$lib/lang";
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ url }) => {
		const lang: Lang = pathLang(url.pathname);
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
	import { onMount } from "svelte";
	import { browser } from "$app/env";
	import { page } from "$app/stores";
	import { load as loadFathom, trackPageview } from "fathom-client";

	import "../app.css";
	import "../ibm-plex-var.css";

	export let lang: Lang;

	onMount(() => {
		loadFathom("MDDFSRVF", {
			includedDomains: ["www.mxdvl.com"],
			url: "https://earthworm.mxdvl.com/script.js",
		});
	});

	// track a page view when the URL path changes
	$: $page.url.pathname, browser && trackPageview();
</script>

<svelte:head>
	<html {lang} />
</svelte:head>

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
