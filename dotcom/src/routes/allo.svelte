<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { WeatherData } from "api/weather/[city]";

	export const load: Load = async ({ fetch }) => {
		const response = await fetch("/api/weather/london");
		const { data } = await response.json();

		console.log({ response });

		return {
			props: {
				weather: data,
			},
		};
	};
</script>

<script lang="ts">
	export let weather: WeatherData["data"];
</script>

<h1>Allô!</h1>

<p>Allô, c’est Max.</p>

<p>
	Un dévelopeur & designer <a href="/hi">bilingue</a> à Londres
	<em>{weather.weather.main}</em>. Je travaille actuellement chez The Guardian.
</p>

<p>
	<a href="/travaux">Mon travail</a>
	s’illustre par son élégance et sa simplicité. J’adore bâtir pour le web et
	<a href="https://github.com/mxdvl">contribuer à du code source ouvert </a>.
</p>

<p class="warn">Ce nouveau site est en construction. Attendez-vous à beaucoup de changements en janvier 2022.</p>
