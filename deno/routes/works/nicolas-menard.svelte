<script context="module">
	const projects = "nicolas-menard/projects.png";

	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";

	const date = "2020-01";

	const fr = "/travaux/nicolas-ménard";
	const en = "/works/nicolas-menard";

	export { projects, fr, en, date };
</script>

<Alternates {en} {fr} />

<Layout lang="en">
<section>
	<h2>Nicolas Ménard’s website</h2>

	<h3>{date}</h3>

	<p>
		Nicolas Ménard is a brilliant animation director and designer in London, and I've helped launch <a
			href="https://www.nicolasmenard.com/">his new portfolio</a
		>.
	</p>

	<p>The pages now load much faster, using clever caching and distributed assets on a global CDN.</p>

	<Image ratio={13 / 6} src={projects} alt="screenshot of Nicolas’s website" />
</section>
</Layout>
