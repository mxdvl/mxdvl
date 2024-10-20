<script context="module">
	const date = "2019-09";

	const screenshot = "manshen-lo/mobile-screenshot.png";

	const fr = "/travaux/manshen-lo";
	const en = "/works/manshen-lo";

	export { screenshot, fr, en, date };
</script>

<script>
	import Layout from "../../components/Layout.svelte";
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
</script>

<Alternates {en} {fr} />

<Layout lang="en">
<section>
	<h2>Manshen Lo’s website</h2>

	<h3>{date}</h3>

	<p>
		The drawings of illustrator Manshen Lo needed to be presented in pristine visual quality, without
		compromising how quickly <a href="https://www.manshenlo.com/">her online gallery</a> would load. A 90+ Pagespeed
		score was achieved with lazy-loading and CSS rules to prevent content from jumping on load.
	</p>

	<Image ratio={12 / 6} src={screenshot} alt="mobile screenshot of Manshen's portfolio" />
</section>
</Layout>
