<script>
	import Header from "$lib/Header.svelte";
	import Footer from "$lib/Footer.svelte";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { load, trackPageview } from "fathom-client";

	import "./styles.css";
	import { lang } from "../lib/lang";
	import { capitalise } from "../lib/capitalise";

	export let data;

	onMount(() => {
		load("MDDFSRVF", {
			includedDomains: ["www.mxdvl.com"],
			url: "https://cdn.usefathom.com/script.js",
		});
	});

	$: browser && lang.set(data.lang);
	lang.subscribe(() => {
		browser && document.documentElement.setAttribute("lang", $lang);
	});

	// track a page view when the URL path changes
	$: $page.url.pathname, browser && trackPageview();
</script>

<svelte:head>
	<title
		>MXDVL – {$page.url.pathname
			.split("/")
			.filter(({ length }) => length > 0)
			.slice(0, 1) // TODO: handle deeper navigations
			.map(decodeURIComponent)
			.map(capitalise)}</title
	>
</svelte:head>

<Header />

<main>
	<slot />
</main>

<Footer />

<style>
	main {
		padding: var(--grid-double) 0;
		margin: 0 auto;
	}
</style>
