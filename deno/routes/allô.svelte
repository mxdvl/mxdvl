<script>
	import Alternates from "../../dotcom/src/lib/Alternates.svelte";
	import Layout from "../components/Layout.svelte";

	const { id } = { id: 999 };
</script>

<Alternates en="/hi" fr="/allô" />

<Layout lang="fr" url={new URL("https://www.mxdvl.com/allô")}>
<h1>Allô, c’est <strong>Max</strong>.</h1>

<p>
	Un dévelopeur & designer <a href="/hi">bilingue</a> à Londres
	<span data-weather-id={id}>"nuageuse"</span>.
</p>

<p>
	Je fabrique actuellement une <a href="https://www.hometrack.com/products/opportunity-insight/"
		>platforme web de données chez Hometrack</a
	>. J’ai aussi contribué au <a href="https://www.theguardian.com/uk">site du Guardian</a>. Il est possible d’en voir
	plus sur mon parcours professionel sur <a href="/profil">mon profil</a>.
</p>

<p>Récemment, je suis fier d’avoir accompli et participé aux projets suivants:</p>

<ul>
	<li>
		Visualiser le <a href="https://observablehq.com/@mxdvl/equinoxe">trajet d’Equinoxe</a> vers la
		<a href="https://transatqsm.com">Transat Québec–St-Malo</a>
	</li>
	<li><a href="/works/bobbin">Bobbin</a>, un outil pour tresser des symmétries délicates</li>
	<li>
		Le lancement de <a href="https://github.com/guardian/typescript-school">l’école TypeScript</a> (en anglais), qui
		permet à tous les dévelopeurs d’être sur la même page
	</li>
	<li>Avoir été le mentor de quatre collègues ingénieur logiciels, avec lesquels je me suis développé</li>

	<li>
		Continuer à tripatouiller avec CSS & JS sur <a href="https://codepen.io/mxdvl">CodePen</a> et sur
		<a href="https://www.mxdvl.com/aoc/2023">l’Advent of Code 2023</a>
	</li>
</ul>

<p>
	Comme je travaille principalement en Anglais, il y a <a href="/hi">plus d'info de ce côté-là</a>.
</p>
</Layout>
