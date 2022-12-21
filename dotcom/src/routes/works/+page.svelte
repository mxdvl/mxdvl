<script lang="ts">
	import Works from "$lib/Works.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	const { works } = data;
</script>

## Selected works

<Works lang="en" {works} />
