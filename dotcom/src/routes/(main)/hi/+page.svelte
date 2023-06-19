<script>
	import { getCondition } from "$lib/weather.js";
	import Alternates from "$lib/Alternates.svelte";

	export let data;

	const { feels_like, id } = data;
</script>

<Alternates en="/hi" fr="/allô" />

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
