<script lang="ts">
	import Works from "$lib/Works.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	const { works } = data;
</script>

<h2>Selected works</h2>

<Works lang="en" {works} />
