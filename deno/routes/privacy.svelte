<script>
	import { onMount } from "svelte";
	import Button from "../components/Button.svelte";
	import Layout from "../components/Layout.svelte";
	import Alternates from "../components/Alternates.svelte";

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

<Alternates en="/privacy" fr="/confidentialité" />

<Layout lang="en">
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
</Layout>
