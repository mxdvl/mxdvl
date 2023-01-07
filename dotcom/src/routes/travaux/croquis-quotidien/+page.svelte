<script context="module" lang="ts">
	export const date = "2016-04";
</script>

<script lang="ts">
	import { page } from "$app/stores";

	import Image from "$lib/Image.svelte";
	import Alternates from "../../../lib/Alternates.svelte";

	const en = "/works/daily-doodle";
</script>

<Alternates {en} fr={$page.url.pathname} />

<section>
	<h2>Daily Doodles</h2>
	<h3>{date}</h3>

	<p>
		Scènes de vie du pays du Soleil-Levant. Archive complète
		<a href="https://sktch.mxdvl.com/">sur tumblr</a>.
	</p>

	<Image path={en} ratio={8 / 6} src="dd-electric_cables.jpg" alt="Câbles électriques" />
	<Image path={en} ratio={12 / 6} src="d-12.jpg" alt="La veille à Shibuya" />

	<p>
		Si vous voulez des impressions, veuillez
		<a href="mailto:allo+impressions@mxdvl.com">me contacter</a>
		pour plus de details.
	</p>

	<Image path={en} ratio={3 / 6} src="img_2692.jpg" alt="Ochanimizu" />
</section>
