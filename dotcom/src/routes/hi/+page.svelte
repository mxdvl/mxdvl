<script lang="ts">
	import { getCondition } from "$lib/weather";
	import type { PageData } from "./$types";

	export let data: PageData;

	const { feels_like, id } = data;
</script>

<h1>Hi, there!</h1>

<p>Hello, it’s Max.</p>

<p>
	A <a href="/allô">bilingual</a> developer &amp, designer in
	<span data-id={id}>{feels_like > 300 ? "boiling" : getCondition(id, "en")}</span>
	London. Currently working at The Guardian.
</p>

<p>
	Elegance, simplicity and accessibility guide <a href="/works">my work</a>. I love building for the web and making
	<a href="https://github.com/mxdvl">open-source contributions</a>.
</p>

<p>Feels like {feels_like}K</p>
