<script lang="ts">
	import Header from "$lib/Header.svelte";
	import Footer from "$lib/Footer.svelte";
	import "../app.css";
</script>

<Header />

<main>
	<slot />
</main>

<button
	on:click={() => {
		["light", "dark"].forEach((token) => window.document.body.classList.toggle(token));
	}}>switch</button
>

<Footer />

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>
