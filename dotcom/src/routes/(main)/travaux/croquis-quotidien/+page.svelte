<script context="module" lang="ts">
	export const date = "2016-04";
</script>

<script lang="ts">
	import { page } from "$app/stores";

	import Image from "$lib/Image.svelte";
	import Alternates from "$lib/Alternates.svelte";
	import { d12, electricCables, ochanomizu } from "../../works/daily-doodles/+page.svelte";

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

	<Image ratio={8 / 6} picture={electricCables} alt="Câbles électriques" />
	<Image ratio={12 / 6} picture={d12} alt="La veille à Shibuya" />

	<p>
		Si vous voulez des impressions, veuillez
		<a href="mailto:allo+impressions@mxdvl.com">me contacter</a>
		pour plus de details.
	</p>

	<Image ratio={3 / 6} picture={ochanomizu} alt="Ochanimizu" />
</section>
