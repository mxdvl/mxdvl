<script>
	import Button from "../components/Button.svelte";

	/** @type {{ lang: import('./lang.js').Lang }} */
	let { lang = "en" } = $props();

	let tracking = $state(false);
	$effect(() => {
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
			Anonymous tracking <strong>active</strong>. <Button onclick={block}
				>Completely disable</Button
			>.
		{:else}
			No tracking whatsoever. <Button onclick={unblock}
				>Reactivate</Button
			>.
		{/if}
	{:else if tracking}
		Suivi anonyme <strong>actif</strong>. <Button onclick={block}
			>Désactiver complètement</Button
		>.
	{:else}
		Aucun suivi. <Button onclick={unblock}>Réactiver</Button>.
	{/if}
</p>
