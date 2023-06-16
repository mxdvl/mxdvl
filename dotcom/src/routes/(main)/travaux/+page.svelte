<script>
	import Works from "$lib/Works.svelte";

	export let data;

	const { works } = data;
</script>

## Selection de travaux

<Works lang="fr" {works} />
