<script>
	import Image from "../../components/Image.svelte";
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";
	import { entree, symetrie } from "../travaux/silence-solennel.svelte";

	const fr = "/travaux/silence-solennel";
</script>

<Alternates en="/works/solemn-silence" fr="/travaux/silence-solennel" />

<Layout lang="en">
<section>
	<h2>Silence Solennel</h2>

	<h3>2011-05</h3>

	<Image ratio={2 / 3} src={symetrie} alt="1:10 model highlighting the symmetry of the space" />

	<Image ratio={2 / 3} src={entree} alt="view of the model through the door" />

	<p>Read more in french: <a href={fr}>Silence Solennel</a>.</p>
</section>
</Layout>
