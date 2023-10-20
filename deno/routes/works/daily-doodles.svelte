<script context="module">
	const date = "2016-04";

	const electricCables = "dd-electric_cables.jpg";
	const d12 = "d12.jpg";
	const ochanomizu = "img_2692.jpg";

	export { date, electricCables, d12, ochanomizu };
</script>

<script>
	import Layout from "../../components/Layout.svelte";
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
</script>

<Alternates en="/works/daily-doodles" fr="/travaux/croquis-quotidien" />

<Layout>
	<section>
		<h2>Daily Doodles</h2>
		<h3>{date}</h3>

		<p>
			Life scenes from the Land of the Rising Sun, full archive
			<a href="https://sktch.mxdvl.com/">on tumblr</a>.
		</p>

		<Image ratio={8 / 6} src={electricCables} alt="Electric cables" />
		<Image ratio={12 / 6} src={d12} alt="Last night in Shibuya" />

		<p>
			Prints are available, <a href="mailto:hi+prints@mxdvl.com"
				>drop me a line</a
			> for details.
		</p>

		<Image ratio={3 / 6} src={ochanomizu} alt="Ochanimizu" />
	</section>
</Layout>
