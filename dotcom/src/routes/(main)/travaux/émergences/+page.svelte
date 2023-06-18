<script context="module">
	export const date = "2012-07";

	import crete from "./crête.jpg";
	import plaine from "./plaine.jpg";
	import cote from "./côte.jpg";
	import ravin from "./ravin.jpg";

	export const projects = /** @type {const} */ ([crete, plaine, cote, ravin]);
</script>

<script>
	import { page } from "$app/stores";
	import Image from "$lib/Image.svelte";
	import Alternates from "$lib/Alternates.svelte";
</script>

<Alternates en="/works/solemn-silence" fr={$page.url.pathname} />

<section>
	<h2>émergences</h2>

	<h3>{date}</h3>

	Quatre projets de recherche menés par Börkur Bergmann dans le nord du Québec.

	{#each projects as picture}
		<Image ratio={2 / 3} {picture} alt={`Photo du projet ${picture.img.src.split("/").at(-1)}`} />
	{/each}

	<p>
		<em>fait avec Émélie DT</em>
	</p>
</section>
