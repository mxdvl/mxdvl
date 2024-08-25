<script context="module">
	const responsive = "florian-busch/responsive-website.png";

	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";

	const date = "2018-06";

	const fr = "/travaux/florian-busch";
	const en = "/works/florian-busch";

	export { responsive, fr, en, date };
</script>

<Alternates {en} {fr} />

<Layout lang="en">
<section>
	<h2>Florian Busch Architects’ website</h2>

	<h3>{date}</h3>

	<p>
		At Florian Busch Architects, I developed the company database and servers to be used for both for internal use
		and exposed on the public website.
	</p>

	<p>See the website at <a href="https://www.florianbusch.com/">www.florianbusch.com</a></p>

	<Image ratio={6 / 9} src={responsive} alt="screenshot of Nicolas’s website" />
</section>
</Layout>
