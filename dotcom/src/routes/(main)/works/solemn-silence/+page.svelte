<script>
	import { page } from "$app/stores";
	import Image from "$lib/Image.svelte";
	import Alternates from "$lib/Alternates.svelte";
	import { entree, symetrie } from "../../travaux/silence-solennel/+page.svelte";

	const fr = "/travaux/silence-solennel";
</script>

<Alternates en={$page.url.pathname} {fr} />

<section>
	<h2>Silence Solennel</h2>

	<h3>2011-05</h3>

	<Image ratio={2 / 3} picture={symetrie} alt="1:10 model highlighting the symmetry of the space" />

	<Image ratio={2 / 3} picture={entree} alt="view of the model through the door" />

	<p>Read more in french: <a href={fr}>Silence Solennel</a>.</p>
</section>
