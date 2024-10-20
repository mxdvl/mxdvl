<script context="module">
	const symetrie = "silence-solennel/symetrie.jpg";
	const entree = "silence-solennel/entree.jpg";

	export { symetrie, entree };
</script>

<script>
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
</script>

<Alternates en="/works/solemn-silence" fr="/travaux/silence-solennel" />

<Layout lang="fr">
<section>
	<h2>Silence Solennel</h2>

	<h3>2011-05</h3>

	<Image ratio={2 / 3} src={symetrie} alt="maquette à 1:10 soulignant la symétrie de l’espace" />

	<blockquote>
		«&ThinSpace;La Cène, rouge et or:<br />
		Coup de théâtre en contraste;<br />
		Silence solennel.&ThinSpace;»
	</blockquote>

	<Image ratio={2 / 3} src={entree} alt="vue de la maquette par la porte d’entrée" />

	<p>
		Contraste d’une vieille grange remplie de grains dorés et d’un tapis rouge sang. Nourriture inaccessible et
		tissu sensuel.
	</p>

	<p>Maquette 1:10 d'un espace pour le dernier repas. Le mandat était de créer une image, en évitant les symboles.</p>

	<p>
		Les projets des autres étudiants sont disponibles
		<a href="http://madeck.com/s/design_international-2011/"> (sur cette page)</a>
		que j’ai montée pour l’occasion.
	</p>
</section>
</Layout>
