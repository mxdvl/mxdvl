<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		const works = await fetch('/works.json').then((r) => r.clone().json());

		return {
			props: {
				works
			}
		};
	};

	// NO JAVASCRIPT!
	export const hydrate = false;
	export const router = false;
</script>

<script lang="ts">
	import type { Work } from '$lib/works';

	export let works: Work[];
</script>

<h1>Content API for MXDVL</h1>

<p>Is this over-engineered? Yes, probably. ¯\_(ツ)_/¯</p>

<ul>
	{#each works as work}
		<li><a href={work.urls.en}>{work.metadata.titles.en}</a> (en)</li>
		{#if work.urls.fr}
			<li><a href={work.urls.fr}>{work.metadata.titles.fr}</a> (fr)</li>
		{/if}
	{/each}
</ul>
