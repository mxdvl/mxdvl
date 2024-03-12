<script>
	import Layout from "../components/Layout.svelte";
	import Works from "../components/Works.svelte";
	import Alternates from "../components/Alternates.svelte";
</script>

<Alternates en="/works" fr="/travaux" />

<Layout>
	<h2>Works</h2>

	<Works
		works={[
			"works/bobbin",
			"works/daily-doodles",
			"works/manshen-lo",
			"works/florian-busch",
			"works/nicolas-menard",
			"works/solemn-silence",
			"works/1x-expo",
			"works/emergences",
		]}
		lang={"en"}
	/>
</Layout>
