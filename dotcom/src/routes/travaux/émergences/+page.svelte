<script context="module" lang="ts">
	export const date = "2012-07";

	export const projects = ["crête", "plaine", "côte", "ravin"] as const;
</script>

<script lang="ts">
	import { page } from "$app/stores";
	import Image from "$lib/Image.svelte";
	import Alternates from "$lib/Alternates.svelte";
</script>

<Alternates en="/works/solemn-silence" fr={$page.url.pathname} />

<section>
	<h2>émergences</h2>

	<h3>{date}</h3>

	Quatre projets de recherche menés par Börkur Bergmann dans le nord du Québec.

	{#each projects as projet}
		<Image ratio={2 / 3} src={`${projet}.jpg`} alt={`Photo du projet ${projet}`} />
	{/each}

	<p>
		<em>fait avec Émélie DT</em>
	</p>
</section>
