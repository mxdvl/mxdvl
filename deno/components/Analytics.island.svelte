<script>
	import { onMount } from "svelte";
	import { load, trackPageview } from "npm:fathom-client@3.5.0";

	onMount(() => {
		load("MDDFSRVF", {
			includedDomains: ["www.mxdvl.com"],
			url: "https://cdn.usefathom.com/script.js",
		});
		trackPageview();
	});
</script>
