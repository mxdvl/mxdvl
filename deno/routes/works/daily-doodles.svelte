<script context="module">
	export const date = "2016-04";

	// import electricCables from "./dd-electric_cables.jpg";
	// import d12 from "./d12.jpg";
	// import ochanomizu from "./img_2692.jpg";

	// export { electricCables, d12, ochanomizu };
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

	<!-- <Image ratio={8 / 6} picture={electricCables} alt="Electric cables" /> -->
	<!-- <Image ratio={12 / 6} picture={d12} alt="Last night in Shibuya" /> -->

	<p>
		Prints are available, <a href="mailto:hi+prints@mxdvl.com"
			>drop me a line</a
		> for details.
	</p>

	<!-- <Image ratio={3 / 6} picture={ochanomizu} alt="Ochanimizu" /> -->
</section>

</Layout>
