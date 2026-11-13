<script lang="ts">
	import { qr as encode } from "headless-qr";
	import { onMount } from "svelte";
	import Button from "./Button.svelte";
	import type { Lang } from "./lang.js";

	let { lang = "en" }: { lang: Lang } = $props();

	const fallback = lang === "en" ?  'https://www.mxdvl.com/tools/square' : 'https://www.mxdvl.com/outils/square'
	let input = $state(fallback)

	const presets = [
		{ label: "🔄", value: fallback },
		{ label: "parkrun · P001", value: "P001" },
		{ label: "Bluesky · @mxdvl.com", value: "https://bsky.app/profile/mxdvl.com" },
		{ label: "Rickroll", value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
		{ label: "¯\\_(ツ)_/¯", value: "¯\\_(ツ)_/¯" },
	];

	// Client-side only, so server and first client render match
	onMount(() => {
		input = new URL(location.href).searchParams.get("q")?.trim() || fallback;
	});

	let text = $derived(input.trim());

	// Quiet zone, in modules (half a grid unit each)
	const margin = 4;
	let modules = $derived(text ? encode(text, { correction: "L" }) : []);
	// QR sizes are odd: add one module so the total is a whole number of grid units
	let total = $derived(modules.length + 2 * margin + (modules.length % 2));

	$effect(() => {
		history.replaceState(null, "", input !== fallback ? `?q=${encodeURIComponent(input)}` : "")
	})
</script>

<label>
	{#if lang === "en"}
		Encode any text into a QR code
	{:else if lang === "fr"}
		Encoder tout texte en code QR
	{/if}
	<input type="text" bind:value={input} />
</label>

<p>
	{#if lang === "en"}
		Presets:
	{:else if lang === "fr"}
		Préréglages&thinsp;:
	{/if}
</p>
<ul>
	{#each presets as { label, value } (value)}
		<li><Button disabled={text === value} on:click={() => (input = value)}>{label}</Button></li>
	{/each}
</ul>

{#if modules.length > 0}
	<div class="qr" role="img" aria-label={text} style:--total={total}>
		{#each modules as row, y}
			{#each row as dark, x}
				{#if dark}
					<i style:grid-area="{y + margin + 1} / {x + margin + 1}"></i>
				{/if}
			{/each}
		{/each}
	</div>
{/if}

<style>
	/* Whole grid units tall (1 + 2), so the code below starts on the grid */
	label {
		display: block;
	}

	input {
		display: block;
		box-sizing: border-box;
		width: 100%;
		max-width: 24rem;
		height: var(--grid-double);
		margin: 0;
		padding: 0 0.5rem;
		border: none;
		outline: 2px solid var(--skies);
		outline-offset: -1px;
		border-radius: 1px;
		color: inherit;
		font: inherit;
		background: transparent;
	}

	input:focus-visible {
		outline-color: var(--ocean);
	}


	.qr {
		--module: calc(var(--grid) / 2);
		display: grid;
		position: relative;
		margin: var(--grid) 0;
		grid-template: repeat(var(--total), var(--module)) / repeat(var(--total), var(--module));
		width: max-content;
		max-width: 100%;
		overflow: auto;
		background: var(--clouds);
		color: var(--earth);
		transition: color 1.2s, background-color 1.2s;
		/* Straddles the edge like the image frame, and isn't clipped by overflow */
		outline: 2px solid var(--skies);
		outline-offset: -1px;
	}

	i {
		background: currentColor;
	}
</style>
