<script>
	import { onMount } from "svelte";
	import Layout from "../components/Layout.svelte";
	import Alternates from "../components/Alternates.svelte";
	import Tracking from "../components/Tracking.island.svelte";

	const lang = "en";
</script>

<Alternates en="/privacy" fr="/confidentialité" />

<Layout {lang}>
	<p>
		Anonymous tracking via <a href="https://usefathom.com/">Fathom</a> helps me understand which pages are the most seen.
		You can still choose to opt out below.
	</p>
	<Tracking {lang} />
</Layout>
