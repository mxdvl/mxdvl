<script lang="ts">
	import { getCondition, type WeatherAPIResponse } from "$lib/weather";

	export let data: WeatherAPIResponse;

	const id = data.weather[0]?.id ?? 803;
</script>

<h1>Allô!</h1>

<p>Allô, c’est Max.</p>

<p>
	Un dévelopeur & designer <a href="/hi">bilingue</a> à Londres
	<span data-id={id}>{getCondition(id, "fr")}</span>. Je travaille actuellement chez The Guardian.
</p>

<p>
	<a href="/travaux">Mon travail</a>
	s’illustre par son élégance et sa simplicité. J’adore bâtir pour le web et
	<a href="https://github.com/mxdvl">contribuer à du code source ouvert </a>.
</p>

<p>Température ressentie {data.main.feels_like}K</p>
