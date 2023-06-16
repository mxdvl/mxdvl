<script>
	import Works from "$lib/Works.svelte";

	export let data;
	const { works } = data;
</script>

<h2>Selected works</h2>

<Works lang="en" {works} />
