<script lang="ts">
	import type { PageData } from "./$types";

	import { getCondition } from "$lib/weather";
	import Alternates from "$lib/Alternates.svelte";

	export let data: PageData;

	const { feels_like, id } = data;
</script>

<Alternates en="/hi" fr="/allô" />

<h1>Allô!</h1>

<p>Allô, c’est Max.</p>

<p>
	Un dévelopeur & designer <a href="/hi">bilingue</a> à Londres
	<span data-id={id}>{feels_like > 300 ? "bouillante" : getCondition(id, "fr")}</span>. Je travaille actuellement chez
	The Guardian.
</p>

<p>
	<a href="/travaux">Mon travail</a>
	s’illustre par son élégance et sa simplicité. J’adore bâtir pour le web et
	<a href="https://github.com/mxdvl">contribuer à du code source ouvert </a>.
</p>

<p>Température ressentie {feels_like}K</p>
