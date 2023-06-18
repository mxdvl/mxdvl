<script context="module">
	import responsive from "./responsive-website.png";

	import Image from "$lib/Image.svelte";
	import Alternates from "$lib/Alternates.svelte";

	const date = "2018-06";

	const fr = "/travaux/florian-busch";
	const en = "/works/florian-busch";

	export { responsive, fr, en, date };
</script>

<Alternates {en} {fr} />

<section>
	<h2>Florian Busch Architects’ website</h2>

	<h3>{date}</h3>

	<p>
		At Florian Busch Architects, I developed the company database and servers to be used for both for internal use
		and exposed on the public website.
	</p>

	<p>See the website at <a href="https://www.florianbusch.com/">www.florianbusch.com</a></p>

	<Image ratio={6 / 9} picture={responsive} alt="screenshot of Nicolas’s website" />
</section>
