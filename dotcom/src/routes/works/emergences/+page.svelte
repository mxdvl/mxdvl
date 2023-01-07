<script lang="ts">
	import { page } from "$app/stores";
	import Image from "$lib/Image.svelte";
	import Alternates from "$lib/Alternates.svelte";
	import { date, projects } from "../../travaux/émergences/+page.svelte";

	const fr = "/travaux/émergences";
</script>

<Alternates en={$page.url.pathname} {fr} />

<section>
	<h2>Emergences</h2>

	<h3>{date}</h3>

	Four research projects lead by Börkur Bergmann in the north of Québec.

	{#each projects as projet}
		<Image path={fr} ratio={2 / 3} src={`${projet}.jpg`} alt={`Picture of ${projet} project`} />
	{/each}

	<p>
		<em>made with Émélie DT</em>
	</p>
</section>
