<script lang="ts">
	import type { WeatherAPIResponse } from "$lib/weather";

	export let weather: WeatherAPIResponse;
</script>

<h1>Allô!</h1>

<p>Allô, c’est Max.</p>

<p>
	Un dévelopeur & designer <a href="/hi">bilingue</a> à Londres
	<em data-id={weather.weather[0]?.id}>nuageuse</em>. Je travaille actuellement chez The Guardian.
</p>

<p>
	<a href="/travaux">Mon travail</a>
	s’illustre par son élégance et sa simplicité. J’adore bâtir pour le web et
	<a href="https://github.com/mxdvl">contribuer à du code source ouvert </a>.
</p>

<p>Température ressentie {weather.main.feels_like}K</p>
