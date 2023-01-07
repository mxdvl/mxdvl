<script context="module" lang="ts">
	export const date = "2016-04";
</script>

<script lang="ts">
	import { page } from "$app/stores";

	import Image from "$lib/Image.svelte";
	import Alternates from "../../../lib/Alternates.svelte";
</script>

<Alternates en={$page.url.pathname} fr="/travaux/croquis-quotidien" />

<section>
	<h2>Daily Doodles</h2>
	<h3>{date}</h3>

	<p>
		Life scenes from the Land of the Rising Sun, full archive
		<a href="https://sktch.mxdvl.com/">on tumblr</a>.
	</p>

	<Image ratio={8 / 6} src="dd-electric_cables.jpg" alt="Electric cables" />
	<Image ratio={12 / 6} src="d-12.jpg" alt="Last night in Shibuya" />

	<p>
		Prints are available, <a href="mailto:hi+prints@mxdvl.com">drop me a line</a> for details.
	</p>
	<Image ratio={3 / 6} src="img_2692.jpg" alt="Ochanimizu" />
</section>
