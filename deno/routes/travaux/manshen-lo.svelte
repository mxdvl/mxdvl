<script context="module">
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
	import { date, en, fr, screenshot } from "../works/manshen-lo.svelte";
	import Layout from "../../components/Layout.svelte";
</script>

<Alternates {en} {fr} />

<Layout lang="fr">
<section>
	<h2>Site web de Manshen Lo</h2>

	<h3>{date}</h3>

	<p>
		The drawings of illustrator Manshen Lo needed to be presented in pristine visual quality, without compromising
		how quickly <a href="https://www.manshenlo.com/">her online gallery</a> would load. A 90+ Pagespeed score was achieved
		with lazy-loading and CSS rules to prevent content from jumping on load.
	</p>

	<Image ratio={12 / 6} src={screenshot} alt="mobile screenshot of Manshen's portfolio" />
</section>
</Layout>
