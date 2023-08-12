<script>
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

	/**
	 * @param {object} options
	 * @param {number} options.length number of slides
	 * @param {number} options.display duration of display
	 * @param {number} options.fade duration of fade
	 * @param {boolean} options.last whether the slide is last
	 */
	const createAnimation = ({ length, last, fade, display }) => {
		const stages = /** @type {const} @satisfies {ReadonlyArray<{time: number, opacity: 0 | 1}>} */ ([
			{ time: 0, opacity: 0 },
			{ time: fade, opacity: 1 },
			{ time: fade + display + fade * (last ? 0 : 1), opacity: 1 },
			{ time: fade + display + fade * (last ? 1 : 1.01), opacity: 0 },
		]);
		const duration = length * (fade + display);
		return stages.map(({ time, opacity }) => `${(time / duration) * 100}% { opacity: ${opacity}; }`).join("\n");
	};

	$: animationMiddle = createAnimation({ length: slides.length, last: false, fade, display });
	$: animationLast = createAnimation({ length: slides.length, last: true, fade, display });
</script>

<svelte:head>
	{@html "<sty" + "le>@keyframes middle-slide { " + animationMiddle + "}</sty" + "le>"}
	{@html "<sty" + "le>@keyframes last-slide { " + animationLast + "}</sty" + "le>"}
</svelte:head>

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

<pre>
{@html "@keyframes last-slide {\n\t" + animationLast.replaceAll("\n", "\n\t") + "\n}"}
{@html middle_slides_display_longer
		? "@keyframes middle-slide {\n\t" + animationMiddle.replaceAll("\n", "\n\t") + "\n}"
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
