<script lang="ts">
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
	import Clou from "../../components/Clou.island.svelte";

	const lang = "en";
</script>

<Alternates en="/tools/clou" fr="/outils/clou" />

<Layout {lang}>
	<p>Clou is a <a href="https://apps.garmin.com/apps/62bde47f-25b3-4c7a-bbd9-fcbd482556f8">Garmin watch face</a>. <a href="https://github.com/mxdvl/clou">Source on GitHub</a>.</p>

	<Clou {lang} />
</Layout>
