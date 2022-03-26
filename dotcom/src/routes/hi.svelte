<script lang="ts">
	import type { WeatherAPIResponse } from "$lib/weather";

	export let weather: WeatherAPIResponse;
</script>

<h1>Hi, there!</h1>

<p>Hello, it’s Max.</p>

<p>
	A <a href="/allô">bilingual</a> developer &amp, designer in
	<em data-id={weather.weather[0]?.id}>cloudy</em>
	London. Currently working at The Guardian.
</p>

<p>
	Elegance, simplicity and accessibility guide <a href="/works">my work</a>. I love building for the web and making
	<a href="https://github.com/mxdvl">open-source contributions</a>.
</p>

<p class="warn">This relaunch is still a work-in-progress. Expect frequent updates in January 2022.</p>

<p>Feels like {weather.main.feels_like}K</p>

<style>
	.warn {
		font-weight: 800;
	}
</style>
