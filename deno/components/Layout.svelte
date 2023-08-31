<script>
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";
	import Analytics from "./Analytics.island.svelte";
	import { capitalise } from "../../dotcom/src/lib/capitalise.js";

	const url = new URL("/hi", "https://www.mxdvl.com/");

	const lang = "en";
</script>

<svelte:head>
	<title
		>MXDVL – {url.pathname
			.split("/")
			.filter(({ length }) => length > 0)
			.slice(0, 1) // TODO: handle deeper navigations
			.map(decodeURIComponent)
			.map(capitalise)}</title
	>
	<link href="/assets/styles.css" rel="stylesheet" />
</svelte:head>

<Header {url} {lang} />

<main>
	<slot />
</main>

<Footer {url} {lang} />

<Analytics />

<style>
	main {
		padding: var(--grid-double) 0;
		margin: 0 auto;
	}
</style>
