<script>
	import { getCondition } from "$lib/weather.js";
	import Alternates from "$lib/Alternates.svelte";

	export let data;

	const { feels_like, id } = data;
</script>

<Alternates en="/hi" fr="/allô" />

<h1>Allô, c’est <strong>Max</strong>!</h1>

<h2>
	Un dévelopeur & designer à Londres
	<span data-id={id} data-temp={feels_like}>{feels_like > 300 ? "bouillante" : getCondition(id, "fr")}</span>. Je travaille actuellement chez
	The Guardian.
</h2>

<p>
	<a href="/travaux">Mon travail</a>
	s’illustre par son élégance et sa simplicité. J’adore bâtir pour le web et
	<a href="https://github.com/mxdvl">contribuer à du code source ouvert </a>.
</p>

<p>
  Comme je travaille principalement en Anglais,
  il y a <a href="/hi">plus d'info de ce côté-là</a>.
</p>
