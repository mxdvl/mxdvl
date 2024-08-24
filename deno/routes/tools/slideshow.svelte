<script>
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
	import Slideshow from "../../components/Slideshow.island.svelte";

	const lang = "en";
</script>

<Alternates en="tools/slideshow" fr="outils/diaporama" />

<Layout {lang}>
	<Slideshow>Javascript required…</Slideshow>
</Layout>
