<script>
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";
	// import { onMount } from "svelte";
	// import { load, trackPageview } from "npm:fathom-client@3.5.0";
	import { capitalise } from "../../dotcom/src/lib/capitalise.js";

	const url = new URL("/hi", "https://www.mxdvl.com/");

	const lang = "en";

	// onMount(() => {
	// 	load("MDDFSRVF", {
	// 		includedDomains: ["www.mxdvl.com"],
	// 		url: "https://cdn.usefathom.com/script.js",
	// 	});
	// 	trackPageview();
	// });
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
</svelte:head>

<Header {url} {lang} />

<main>
	<slot />
</main>

<Footer {url} {lang} />

<style>
	main {
		padding: var(--grid-double) 0;
		margin: 0 auto;
	}
</style>
