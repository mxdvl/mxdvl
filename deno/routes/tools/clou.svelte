<script lang="ts">
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
	import Clou from "../../components/Clou.island.svelte";

	const lang = "en";
</script>

<Alternates en="/tools/clou" fr="/outils/clou" />

<Layout {lang}>
	<p>Clou is a Garmin watch face. <a href="https://github.com/mxdvl/clou">Source on GitHub</a>.</p>

	<Clou {lang} />
</Layout>
