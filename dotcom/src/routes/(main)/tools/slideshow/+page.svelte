<script>
	import Alternates from "$lib/Alternates.svelte";
	import { GRID_SIZE } from "$lib/grid.js";
	import { keyframes } from "./keyframes.js";

	/** in degrees */
	let angle = 24;

	/** in pixels */
	let offset = 36;

	/** in second */
	let display = 2;
	/** in seconds */
	let fade = 0.25;

	/** number of slides */
	let pick = 3;

	/** to prevent the background seeping through the cross fade */
	let middle_slides_display_longer = true;

	const colours = /** @type {const} */ (["maroon", "salmon", "coral", "tomato", "bisque"]);
	$: slides = colours.slice(0, pick);

	$: middle_slide_keyframes = keyframes({ length: slides.length, last: false, fade, display });
	$: last_slide_keyframes = keyframes({ length: slides.length, last: true, fade, display });
</script>

<svelte:head>
	{@html "<sty" + "le>@keyframes middle-slide { " + middle_slide_keyframes + "}</sty" + "le>"}
	{@html "<sty" + "le>@keyframes last-slide { " + last_slide_keyframes + "}</sty" + "le>"}
</svelte:head>

<Alternates en="tools/slideshow" fr="outils/diaporama" />

<div style={`--angle:${angle}deg;--offset:${offset}px;--duration:${slides.length * (display + fade)}s`}>
	{#each slides as slide, index (Math.random())}
		<figure
			style={`--slide:${index};--delay:${(display + fade) * index - fade}s;--colour:${slide};${
				!middle_slides_display_longer && "animation-name: last-slide;"
			}`}
		>
			{slide}
		</figure>
	{/each}
</div>

<p>(hover slides to pause animation)</p>

<form>
	<label><input type="range" min="0" max="60" bind:value={angle} />{angle}deg</label>
	<label><input type="range" min="0" max="48" bind:value={offset} />{offset}px</label>
	<label><input type="range" min="1" max="12" bind:value={display} />{display}s</label>
	<label><input type="range" min="0.125" max="4" step="0.125" bind:value={fade} />{fade}s</label>
	<label><input type="range" min="1" max="5" bind:value={pick} />{pick} slide(s)</label>
	<label><input type="checkbox" bind:checked={middle_slides_display_longer} />fix cross fade transparency</label>
</form>

<svg
	viewBox={`-18 -18 ${GRID_SIZE * (slides.length + 1) * (display + fade)} ${GRID_SIZE * (slides.length * 2 + 1)}`}
	height={GRID_SIZE * (slides.length * 2 + 1)}
	stroke-width={2}
	fill="var(--skies)"
	stroke="var(--ocean)"
>
	{#each slides as _, index}
		{#if index === 0}
			<path
				d={[
					`M0,${GRID_SIZE}`,
					`v${-GRID_SIZE}`,
					`h${slides.length * (display + fade) * GRID_SIZE}`,
					`v${GRID_SIZE}`,
					"z",
				].join(" ")}
			/>
		{:else if middle_slides_display_longer && index !== slides.length - 1}
			<path
				d={[
					`M0,${(1 + index * 2) * GRID_SIZE}`,
					`h${(index * (display + fade) - fade) * GRID_SIZE}`,
					`l${fade * GRID_SIZE},${-GRID_SIZE}`,
					`h${(display + fade) * GRID_SIZE}`,
					`v${GRID_SIZE}`,
					`h${(slides.length - index - 1) * (display + fade) * GRID_SIZE}`,
					"z",
				].join(" ")}
			/>
		{:else}
			<path
				d={[
					`M0,${(1 + index * 2) * GRID_SIZE}`,
					`h${(index * (display + fade) - fade) * GRID_SIZE}`,
					`l${fade * GRID_SIZE},${-GRID_SIZE}`,
					`h${display * GRID_SIZE}`,
					`l${fade * GRID_SIZE},${GRID_SIZE}`,
					`h${(slides.length - index - 1) * (display + fade) * GRID_SIZE}`,
					"z",
				].join(" ")}
			/>
		{/if}
	{/each}
</svg>

<pre>
{@html "@keyframes last-slide {\n\t" + last_slide_keyframes.replaceAll("\n", "\n\t") + "\n}"}
{@html middle_slides_display_longer
		? "@keyframes middle-slide {\n\t" + middle_slide_keyframes.replaceAll("\n", "\n\t") + "\n}"
		: "/* we need different keyframes for middle slides */"}
</pre>

<style>
	div {
		position: relative;
		aspect-ratio: 16/9;
		width: 300px;
		perspective: 1200px;
		margin: var(--grid-x);
	}

	figure {
		position: absolute;
		padding: 0.25em 0.75em;
		margin: 0;
		inset: 0;
		background-color: var(--colour);
		transform-origin: center left;
		transform: rotate3d(0, 1, 0, var(--angle))
			translate3d(calc(var(--slide) * var(--offset)), 0, calc(var(--slide) * var(--offset)));
	}

	figure:first-child {
		color: white;
	}

	figure:nth-child(n + 2) {
		animation-duration: var(--duration);
		animation-delay: var(--delay);
		animation-iteration-count: infinite;
		animation-timing-function: ease-in-out;
		animation-name: middle-slide;
		opacity: 0;
	}
	figure:last-child {
		animation-name: last-slide;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	div:hover figure {
		animation-play-state: paused;
	}
</style>
