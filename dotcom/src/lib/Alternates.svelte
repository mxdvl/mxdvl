<script lang="ts">
	export let en: string;
	export let fr: string;
</script>

<svelte:head>
	<link rel="alternate" hreflang="en" href={new URL(en, 'https://www.mxdvl.com/').href} />
	<link rel="alternate" hreflang="fr" href={new URL(fr, 'https://www.mxdvl.com/').href} />
</svelte:head>
