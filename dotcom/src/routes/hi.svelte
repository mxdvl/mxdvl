<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { WeatherAPIRespone } from "src/routes/weather/[city].json";

	export const load: Load = async ({ fetch }) => {
		const response = await fetch("/weather/london.json");
		const weather = await response.json();

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

<h1>Hi, there!</h1>

<p>Hello, it’s Max.</p>

<p>
	A <a href="/allo">bilingual</a> developer &amp; designer in
	<em data-id={weather.weather[0]?.id}>cloudy</em>
	London. Currently working at The Guardian.
</p>

<p>
	Elegance, simplicity and accessibility guide <a href="/works">my work</a>. I love building for the web and making
	<a href="https://github.com/mxdvl">open-source contributions</a>.
</p>

<p class="warn">This relaunch is still a work-in-progress. Expect frequent updates in January 2022.</p>

<p>{weather}</p>

<style>
	.warn {
		font-weight: 800;
	}
</style>
