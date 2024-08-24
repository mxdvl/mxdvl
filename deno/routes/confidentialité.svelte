<script>
	import Layout from "../components/Layout.svelte";
	import Alternates from "../components/Alternates.svelte";
	import Tracking from "../components/Tracking.island.svelte";

	const lang = "fr";
</script>

<Alternates en="/privacy" fr="/confidentialité" />

<Layout {lang}>
	<p>
		Un suivi anonyme via <a href="https://usefathom.com/">Fathom</a> me permet de savoir quelles pages sont les plus
		visitées. Vous pouvez toutefois choisir de désactiver ce suivi complètement ci-dessous.
	</p>
	<Tracking {lang} />
</Layout>
