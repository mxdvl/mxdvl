<script context="module">
	const date = "2016-04";

	const photographs = /** @type {const} */ ([
		"émergences/crête.jpg",
		"émergences/plaine.jpg",
		"émergences/côte.jpg",
		"émergences/ravin.jpg",
	]);

	export { photographs };
</script>

<script>
	import Layout from "../../components/Layout.svelte";
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
</script>

<Alternates en="/works/emergences" fr="/travaux/émergences" />

<Layout>
	<section>
		<h2>Emergences</h2>

		<h3>{date}</h3>

		Four research projects lead by Börkur Bergmann in the north of Québec.

		{#each photographs as src}
			<Image ratio={2 / 3} {src} alt={`Picture of the exhibition`} />
		{/each}

		<p>
			<em>made with Émélie DT</em>
		</p>
	</section>
</Layout>
