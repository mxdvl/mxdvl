<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { WeatherAPIRespone } from "src/routes/weather/[city].json";

	export const load: Load = async ({ fetch }) => {
		const response: WeatherAPIRespone = await fetch("/weather/london.json").then((r) => r.json());
		const weather: Partial<WeatherAPIRespone> =
			response.cod === 200
				? response
				: {
						weather: [{ id: 800, main: "cloudy", description: "failed API call", icon: "--" }],
						main: {
							temp: 270,
							feels_like: 270,
							temp_min: 240,
							temp_max: 300,
							pressure: 1200,
							humidity: 60,
						},
				  };

		return {
			props: {
				weather,
			},
		};
	};
</script>

<script lang="ts">
	export let weather: WeatherAPIRespone;
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

<p class="warn">Ce nouveau site est en construction. Attendez-vous à beaucoup de changements en janvier 2022.</p>

<p>Température ressentie {weather.main.feels_like}K</p>
