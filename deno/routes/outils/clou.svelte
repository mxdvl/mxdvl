<script lang="ts">
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
	import Clou from "../../components/Clou.island.svelte";

	const lang = "fr";
</script>

<Alternates en="/tools/clou" fr="/outils/clou" />

<Layout {lang}>
	<p>Clou est un cadran de montre Garmin. <a href="https://github.com/mxdvl/clou">Code source sur GitHub</a> (en anglais).</p>

	<Clou {lang} />
</Layout>
