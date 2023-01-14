<script lang="ts">
	import Works from "$lib/Works.svelte";
	import type { PageData } from "../works/$types";

	export let data: PageData;

	const { works } = data;
</script>

## Selection de travaux

<Works lang="fr" {works} />
