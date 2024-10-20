<script>
	import Layout from "../components/Layout.svelte";
	import Works from "../components/Works.svelte";
	import Alternates from "../components/Alternates.svelte";
</script>

<Alternates en="/works" fr="/travaux" />

<Layout lang="fr">
<h2>Travaux</h2>

<Works
	works={[
		"works/bobbin",
		"travaux/croquis-quotidien",
		"travaux/manshen-lo",
		"travaux/florian-busch",
		"travaux/nicolas-ménard",
		"travaux/silence-solennel",
		"travaux/1x-expo",
		"travaux/émergences",
	]}
	lang={"fr"}
/>
</Layout>
