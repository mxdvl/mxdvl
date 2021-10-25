<script lang="ts">
	import { get } from "svelte/store";
	import Header from "$lib/Header.svelte";
	import Footer from "$lib/Footer.svelte";
	import "../app.css";
	import { languageStore } from "$lib/lang";

	let lang = get(languageStore);
</script>

<Header {lang} />

<main>
	<slot />
</main>

<Footer />
;

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>
