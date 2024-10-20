<script context="module">
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
	import { date, en, fr, responsive } from "../works/florian-busch.svelte";
	import Layout from "../../components/Layout.svelte";
</script>

<Alternates {en} {fr} />

<Layout lang="fr">
<section>
	<h2>Site web de Florian Busch Architects</h2>

	<h3>{date}</h3>

	<p>
		Chez Florian Busch Architects, j’ai développé la base de donnée de la compagnie, utilisée pour tant à l’interne
		que pour le site web public.
	</p>

	<p>Le site web se trouve à <a href="https://www.florianbusch.com/">www.florianbusch.com</a></p>

	<Image ratio={6 / 9} src={responsive} alt="mobile screenshot of Manshen's portfolio" />
</section>
</Layout>
