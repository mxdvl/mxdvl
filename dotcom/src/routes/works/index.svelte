<script lang="ts">
	import type { WorkUrls } from "$content/routes/works/index.json";
	import Works from "$lib/Works.svelte";

	export let works: WorkUrls[];
</script>

## Selected works

<Works lang="en" {works} />
