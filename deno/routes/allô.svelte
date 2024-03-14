<script>
	import Alternates from "../../dotcom/src/lib/Alternates.svelte";
	import Layout from "../components/Layout.svelte";

	const { id } = { id: 999 };
</script>

<Alternates en="/hi" fr="/allô" />

<Layout>
	<h1>Allô!</h1>

	<p>Allô, c’est Max.</p>

	<p>
		Un dévelopeur & designer <a href="/hi">bilingue</a> à Londres
		<span data-id={id}>"nuageuse"</span>. Je travaille actuellement chez The
		Guardian.
	</p>

	<p>
		<a href="/travaux">Mon travail</a>
		s’illustre par son élégance et sa simplicité. J’adore bâtir pour le web et
		<a href="https://github.com/mxdvl"
			>contribuer à du code source ouvert
		</a>.
	</p>
</Layout>
