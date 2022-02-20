<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		const urls = await fetch('/works.json').then((r) => r.clone().json());

		return {
			props: {
				urls
			}
		};
	};

	// NO JAVASCRIPT!
	export const hydrate = false;
	export const router = false;
</script>

<script lang="ts">
	import type { WorkUrls } from './works/index.json';

	export let urls: WorkUrls[];

	const getSlug = (path: string) =>
		decodeURIComponent(path.split('/').slice(-1)[0].replace('.json', ''));
</script>

<h1>Content API for MXDVL</h1>

<p>Is this over-engineered? Yes, probably. ¯\_(ツ)_/¯</p>

<ul>
	{#each urls as url}
		<li>{url.date}: <a href={url.en}>{getSlug(url.en)}</a> (en)</li>
		{#if url.fr}
			<li>{url.date}: <a href={url.fr}>{getSlug(url.fr)}</a> (fr)</li>
		{:else}
			<li>
				{url.date}:
				<a href={url.en.replace('/works/', '/travaux/')}>{getSlug(url.en)}</a>
				(fr manquant)
			</li>
		{/if}
	{/each}
</ul>
