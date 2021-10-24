<script lang="ts">
	import Header from "$lib/Header.svelte";
	import Footer from "$lib/Footer.svelte";
	import "../app.css";
</script>

<Header />

<main>
	<slot />
</main>

<Footer />

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>
