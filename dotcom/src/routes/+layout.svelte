<script lang="ts">
	import Header from "$lib/Header.svelte";
	import Footer from "$lib/Footer.svelte";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { load as loadFathom, trackPageview } from "fathom-client";
	import type { LayoutData } from "./$types";

	import "./styles.css";

	export let data: LayoutData;

	$: ({ lang } = data);

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
	<title
		>MXDVL – {$page.url.pathname
			.split("/")
			.filter((frag) => frag.length)
			.slice(0, 1) // TODO: handle deeper navigations
			.map((frag) => decodeURIComponent(frag))
			.map((frag) => frag.charAt(0).toLocaleUpperCase() + frag.slice(1))}</title
	>
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
