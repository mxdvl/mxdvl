<script context="module">
	export const date = "2012-07";

	const crete = "émergences/crête.jpg";
	const plaine = "émergences/plaine.jpg";
	const cote = "émergences/côte.jpg";
	const ravin = "émergences/ravin.jpg";

	export const projects = /** @type {const} */ ([crete, plaine, cote, ravin]);
</script>

<script>
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
</script>

<Alternates en="/works/emergences" fr="/travaux/émergences" />

<Layout lang="fr">
<section>
	<h2>émergences</h2>

	<h3>{date}</h3>

	Quatre projets de recherche menés par Börkur Bergmann dans le nord du Québec.

	{#each projects as src}
		<Image ratio={2 / 3} {src} alt={`Photo du projet ${src.split("/").at(-1)}`} />
	{/each}

	<p>
		<em>fait avec Émélie DT</em>
	</p>
</section>
</Layout>
