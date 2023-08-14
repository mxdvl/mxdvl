<script>
	import Alternates from "$lib/Alternates.svelte";
	import { GRID_SIZE } from "$lib/grid.js";
	import { keyframes } from "../../tools/slideshow/keyframes.js";

	/** en degrés */
	let angle = 24;

	/** en pixels */
	let decalage = 36;

	/** en secondes */
	let visible = 2;
	/** en secondes */
	let transition = 0.25;

	/** nombre de diapositives */
	let selection = 3;

	/** empêche le fond d´être visible au travers de la transition */
	let diapositives_milieu = true;

	const colours = /** @type {const} */ (["maroon", "salmon", "coral", "tomato", "bisque"]);
	$: diapositives = colours.slice(0, selection);

	$: image_clefs_diapositive_milieu = keyframes({
		length: diapositives.length,
		last: false,
		fade: transition,
		display: visible,
	});
	$: image_clefs_diapositive_fin = keyframes({
		length: diapositives.length,
		last: true,
		fade: transition,
		display: visible,
	});
</script>

<svelte:head>
	{@html "<sty" + "le>@keyframes diapositive-milieu { " + image_clefs_diapositive_milieu + "}</sty" + "le>"}
	{@html "<sty" + "le>@keyframes diapositive-fin { " + image_clefs_diapositive_fin + "}</sty" + "le>"}
</svelte:head>

<Alternates en="tools/slideshow" fr="outils/diaporama" />

<div style={`--angle:${angle}deg;--decalage:${decalage}px;--duration:${diapositives.length * (visible + transition)}s`}>
	{#each diapositives as couleur, index (Math.random())}
		<figure
			style={`--slide:${index};--delay:${(visible + transition) * index - transition}s;--colour:${couleur};${
				!diapositives_milieu && "animation-name: last-slide;"
			}`}
		>
			{couleur}
		</figure>
	{/each}
</div>

<p>(placer le curseur sur le diaporama le met en pause)</p>

<form>
	<label><input type="range" min="0" max="60" bind:value={angle} />{angle}deg</label>
	<label><input type="range" min="0" max="48" bind:value={decalage} />{decalage}px</label>
	<label><input type="range" min="1" max="12" bind:value={visible} />{visible}s</label>
	<label><input type="range" min="0.125" max="4" step="0.125" bind:value={transition} />{transition}s</label>
	<label><input type="range" min="1" max="5" bind:value={selection} />{selection} diapositive(s)</label>
	<label><input type="checkbox" bind:checked={diapositives_milieu} />régler la transparence de la transition</label>
</form>

<svg
	viewBox={`-18 -18 ${GRID_SIZE * (diapositives.length + 1) * (visible + transition)} ${
		GRID_SIZE * (diapositives.length * 2 + 1)
	}`}
	height={GRID_SIZE * (diapositives.length * 2 + 1)}
	stroke-width={2}
	fill="var(--skies)"
	stroke="var(--ocean)"
>
	{#each diapositives as _, index}
		{#if index === 0}
			<path
				d={[
					`M0,${GRID_SIZE}`,
					`v${-GRID_SIZE}`,
					`h${diapositives.length * (visible + transition) * GRID_SIZE}`,
					`v${GRID_SIZE}`,
					"z",
				].join(" ")}
			/>
		{:else if diapositives_milieu && index !== diapositives.length - 1}
			<path
				d={[
					`M0,${(1 + index * 2) * GRID_SIZE}`,
					`h${(index * (visible + transition) - transition) * GRID_SIZE}`,
					`l${transition * GRID_SIZE},${-GRID_SIZE}`,
					`h${(visible + transition) * GRID_SIZE}`,
					`v${GRID_SIZE}`,
					`h${(diapositives.length - index - 1) * (visible + transition) * GRID_SIZE}`,
					"z",
				].join(" ")}
			/>
		{:else}
			<path
				d={[
					`M0,${(1 + index * 2) * GRID_SIZE}`,
					`h${(index * (visible + transition) - transition) * GRID_SIZE}`,
					`l${transition * GRID_SIZE},${-GRID_SIZE}`,
					`h${visible * GRID_SIZE}`,
					`l${transition * GRID_SIZE},${GRID_SIZE}`,
					`h${(diapositives.length - index - 1) * (visible + transition) * GRID_SIZE}`,
					"z",
				].join(" ")}
			/>
		{/if}
	{/each}
</svg>

<pre>
{@html "@keyframes diapositive-milieu {\n\t" + image_clefs_diapositive_fin.replaceAll("\n", "\n\t") + "\n}"}
{@html diapositives_milieu
		? "@keyframes diapositive-fin {\n\t" + image_clefs_diapositive_milieu.replaceAll("\n", "\n\t") + "\n}"
		: "/* il faut des images-clefs (keyframes) différentes pour les images du milieu */"}
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
			translate3d(calc(var(--slide) * var(--decalage)), 0, calc(var(--slide) * var(--decalage)));
	}

	figure:first-child {
		color: white;
	}

	figure:nth-child(n + 2) {
		animation-duration: var(--duration);
		animation-delay: var(--delay);
		animation-iteration-count: infinite;
		animation-timing-function: ease-in-out;
		animation-name: diapositive-milieu;
		opacity: 0;
	}
	figure:last-child {
		animation-name: diapositive-fin;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	div:hover figure {
		animation-play-state: paused;
	}
</style>
