<script lang="ts">
	import { onMount } from "svelte";
	import type { Lang } from "./lang";

	export let lang: Lang;

	let tracking = false;
	onMount(() => {
		tracking = localStorage.blockFathomTracking ? false : true;
	});

	const block = () => {
		// @ts-expect-error -- this is missing from the type definition
		window.fathom.blockTrackingForMe();
		tracking = false;
	};
	const unblock = () => {
		// @ts-expect-error -- this is missing from the type definition
		window.fathom.enableTrackingForMe();
		tracking = true;
	};
</script>

{#if lang === "fr"}
	<p>
		Un suivi anonyme via <a href="https://usefathom.com/">Fathom</a> me permet de savoir quelles pages sont les plus
		visitées. Vous pouvez toutefois choisir de désactiver ce suivi complètement ci-dessous.
	</p>
	<p>
		{#if tracking}
			Suivi anonyme <strong>actif</strong>. <button on:click={block}>Désactiver complètement</button>.
		{:else}
			Aucun suivi. <button on:click={unblock}>Réactiver</button>.
		{/if}
	</p>
{:else}
	<p>
		Anonymous tracking via <a href="https://usefathom.com/">Fathom</a> helps me understand which pages are the most seen.
		You can still choose to opt out below.
	</p>
	<p>
		{#if tracking}
			Anonymous tracking <strong>active</strong>. <button on:click={block}>Completely disable</button>.
		{:else}
			No tracking whatsoever. <button on:click={unblock}>Reactivate</button>.
		{/if}
	</p>
{/if}

<style>
	button {
		display: inline-block;
		--border: var(--ocean);
		border: none;
		padding: 0;
		padding-bottom: 1px;
		margin: 0;
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		font-style: inherit;
		font-weight: inherit;
		line-height: inherit;
		background-size: 2px 2px;
		background-repeat: repeat-x;
		background-position: bottom center;
		background-color: transparent;
		background-image: linear-gradient(to top, var(--border), var(--border) 100%);
	}

	button:hover {
		cursor: pointer;
		color: var(--border);
	}
</style>
