<script context="module">
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
	import { date, en, fr, projects } from "../works/nicolas-menard.svelte";
	import Layout from "../../components/Layout.svelte";
</script>

<Alternates {en} {fr} />

<Layout lang="fr">
<section>
	<h2>Site web de Nicolas Ménard</h2>

	<h3>{date}</h3>

	<p>
		Nicolas Ménard est un directeur d’animation et designer londonien brillant. Je l’ai aidé à lancer son <a
			href="https://www.nicolasmenard.com/">portfolio en ligne</a
		>.
	</p>

	<p>Les pages se chargent plus rapidement grâce à un réseau distribué de contenu (CDN).</p>

	<Image ratio={13 / 6} src={projects} alt="capture d’écran du site web de Nicolas" />
</section>
</Layout>
