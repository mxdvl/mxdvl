<script>
	import { onMount } from "svelte";
	import Button from "../components/Button.svelte";

	/** @type {import('./lang.js').Lang} */
	export let lang = "en";

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

<p>
	{#if lang === "en"}
		{#if tracking}
			Anonymous tracking <strong>active</strong>. <Button on:click={block}>Completely disable</Button>.
		{:else}
			No tracking whatsoever. <Button on:click={unblock}>Reactivate</Button>.
		{/if}
	{:else if tracking}
		Suivi anonyme <strong>actif</strong>. <Button on:click={block}>Désactiver complètement</Button>.
	{:else}
		Aucun suivi. <Button on:click={unblock}>Réactiver</Button>.
	{/if}
</p>
