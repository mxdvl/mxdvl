<script context="module" lang="ts">
	import symetrie from "./symetrie.jpg";
	import entree from "./entree.jpg";

	export { symetrie, entree };
</script>

<script>
	import { page } from "$app/stores";
	import Image from "$lib/Image.svelte";
	import Alternates from "$lib/Alternates.svelte";
</script>

<Alternates en="/works/solemn-silence" fr={$page.url.pathname} />

<section>
	<h2>Silence Solennel</h2>

	<h3>2011-05</h3>

	<Image ratio={2 / 3} picture={symetrie} alt="maquette à 1:10 soulignant la symétrie de l’espace" />

	<blockquote>
		« La Cène, rouge et or:<br />
		Coup de théâtre en contraste;<br />
		Silence solennel. »
	</blockquote>

	<Image ratio={2 / 3} picture={entree} alt="vue de la maquette par la porte d’entrée" />

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
