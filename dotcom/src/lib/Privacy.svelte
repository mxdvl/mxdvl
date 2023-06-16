<script>
	import { onMount } from "svelte";
	import Button from "./Button.svelte";

	/** @type {import("$lib/lang.js").Lang} */
	export let lang;

	let tracking = false;
	onMount(() => {
		tracking = localStorage.blockFathomTracking ? false : true;
	});

	const block = () => {
		window.fathom?.blockTrackingForMe();
		tracking = false;
	};
	const unblock = () => {
		window.fathom?.enableTrackingForMe();
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
			Suivi anonyme <strong>actif</strong>. <Button on:click={block}>Désactiver complètement</Button>.
		{:else}
			Aucun suivi. <Button on:click={unblock}>Réactiver</Button>.
		{/if}
	</p>
{:else}
	<p>
		Anonymous tracking via <a href="https://usefathom.com/">Fathom</a> helps me understand which pages are the most seen.
		You can still choose to opt out below.
	</p>
	<p>
		{#if tracking}
			Anonymous tracking <strong>active</strong>. <Button on:click={block}>Completely disable</Button>.
		{:else}
			No tracking whatsoever. <Button on:click={unblock}>Reactivate</Button>.
		{/if}
	</p>
{/if}
