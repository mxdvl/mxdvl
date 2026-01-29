<script>
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
	import Pace from "../../components/Pace.island.svelte";
	const lang = "fr";
</script>

<Alternates en="/tools/pace" fr="/outils/cadence" />

<Layout {lang}>
	<Pace {lang} />
</Layout>
