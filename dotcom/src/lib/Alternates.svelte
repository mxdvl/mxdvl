<script lang="ts">
	export let en: string;
	export let fr: string;
</script>

<svelte:head>
	<link rel="alternate" hreflang="en" href={en} />
	<link rel="alternate" hreflang="fr" href={fr} />
</svelte:head>
