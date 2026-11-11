<script lang="ts">
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
	import Square from "../../components/Square.island.svelte";

	const lang = "fr";
</script>

<Alternates en="/tools/square" fr="/outils/square" />

<Layout {lang}>
	<Square {lang} />
</Layout>
