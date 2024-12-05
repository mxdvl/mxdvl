<script>
	import { load, trackPageview } from "npm:fathom-client@3.5.0";

	$effect(() => {
		load("MDDFSRVF", {
			includedDomains: ["www.mxdvl.com"],
			url: "https://cdn.usefathom.com/script.js",
		});
		trackPageview();
	});
</script>
