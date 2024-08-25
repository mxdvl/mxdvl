<script>
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
	import { date, d12, electricCables, ochanomizu } from "../works/daily-doodles.svelte";
	import Layout from "../../components/Layout.svelte";
</script>

<Alternates en="/works/daily-doodles" fr="/travaux/croquis-quotidien" />

<Layout lang="fr">
<section>
	<h2>Daily Doodles</h2>
	<h3>{date}</h3>

	<p>
		Scènes de vie du pays du Soleil-Levant. Archive complète
		<a href="https://sktch.mxdvl.com/">sur tumblr</a>.
	</p>

	<Image ratio={8 / 6} src={electricCables} alt="Câbles électriques" />
	<Image ratio={12 / 6} src={d12} alt="La veille à Shibuya" />

	<p>
		Si vous voulez des impressions, veuillez
		<a href="mailto:allo+impressions@mxdvl.com">me contacter</a>
		pour plus de details.
	</p>

	<Image ratio={3 / 6} src={ochanomizu} alt="Ochanimizu" />
</section>
</Layout>
