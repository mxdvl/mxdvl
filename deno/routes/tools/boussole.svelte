<script lang="ts">
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
	import Boussole from "../../components/Boussole.island.svelte";

	const lang = "en";
</script>

<Alternates en="/tools/boussole" fr="/outils/boussole" />

<Layout {lang}>
	<Boussole {lang} />
</Layout>
