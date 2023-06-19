<script context="module">
	import screenshot from "./mobile-screenshot.png";

	import Image from "$lib/Image.svelte";
	import Alternates from "$lib/Alternates.svelte";

	const date = "2019-09";

	const fr = "/travaux/manshen-lo";
	const en = "/works/manshen-lo";

	export { screenshot, fr, en, date };
</script>

<Alternates {en} {fr} />

<section>
	<h2>Manshen Lo’s website</h2>

	<h3>{date}</h3>

	<p>
		The drawings of illustrator Manshen Lo needed to be presented in pristine visual quality, without compromising
		how quickly <a href="https://www.manshenlo.com/">her online gallery</a> would load. A 90+ Pagespeed score was achieved
		with lazy-loading and CSS rules to prevent content from jumping on load.
	</p>

	<Image ratio={12 / 6} picture={screenshot} alt="mobile screenshot of Manshen's portfolio" />
</section>
