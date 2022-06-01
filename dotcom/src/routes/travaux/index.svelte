<script lang="ts">
	import type { WorkUrls } from "@mxdvl/content/routes/works/index.json";
	import Works from "$lib/Works.svelte";

	export let works: WorkUrls[];
</script>

## Selection de travaux

<Works lang="fr" {works} />
