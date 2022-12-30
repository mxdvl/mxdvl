<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;

	const { urls } = data;

	const getSlug = (path: string) => {
		const slug = path.split("/").at(-1)?.replace(".json", "");
		// There are accents in some routes, so we need to decode the URI
		return decodeURIComponent(slug ?? "error");
	};
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
				<a href={url.en.replace("/works/", "/travaux/")}>{getSlug(url.en)}</a>
				(fr manquant)
			</li>
		{/if}
	{/each}
</ul>
