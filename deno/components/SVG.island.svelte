<script>
	import Button from "./Button.svelte";
	import EditablePath from "./EditablePath.svelte";
	import SVGPathCommander from "npm:svg-path-commander";

	/** @param {import('svg-path-commander').PathArray} segments */
	function format(segments) {
		return segments.map((segment) => segment.join(" ")).join("\n");
	}

	/** @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d */
	let d = $state(
		formatPath(format([
			["M", 30, 140],
			["v", 40],
			["a", 50, 50, 0, 0, 0, 50, 50],
			["h", 20],
			["c", 60, 0, 60, -20, 20, -20],
			["c", 40, 0, 40, -20, 0, -20],
			["c", 40, 0, 40, -20, -20, -20],
			["h", -20],
			["a", 10, 10, 0, 0, 1, 0, -20],
			["h", 200],
			["a", 10, 10, 0, 0, 1, 0, 20],
			["h", -20],
			["c", -60, 0, -60, 20, -20, 20],
			["c", -40, 0, -40, 20, 0, 20],
			["c", -40, 0, -40, 20, 20, 20],
			["h", 20],
			["a", 50, 50, 0, 0, 0, 50, -50],
			["v", -40],
			["M", 190, 180],
			["l", -20, 20],
			["l", 10, 10],
			["l", -10, 20],
			["l", 20, -20],
			["l", -10, -10],
			["l", 10, -20],
		]), 'relative'),
	);

	const size = 360;

	/** @type {HTMLTextAreaElement | undefined} */
	let textArea = $state(undefined);

	/** @type {(path: string, method: 'relative' | 'absolute') => string} */
	function formatPath(path, method) {
		switch (method) {
			case "relative": {
				return format(SVGPathCommander.pathToRelative(path));
			}
			case "absolute": {
				return format(SVGPathCommander.pathToAbsolute(path));
			}
		}
	};

	let selected = $state(-1);

	const disabled = $derived(!SVGPathCommander.isValidPath(d));

	const normalised = $derived(
		!disabled &&
			(d === formatPath(d, "relative") ||
				d === formatPath(d, "absolute")),
	);

	function updateLine() {
		if (!textArea) return;
		if (!normalised) return;
		selected = d.slice(0, textArea.selectionStart).split("\n").length - 1;
	}

	$effect(() => {
		const params = new URLSearchParams(window.location.search);
		const path = params.get("d");
		if (!path) return;
		if (!SVGPathCommander.isValidPath(path)) return;
		d = path;
		const s = parseInt(params.get("s") ?? "-1", 10);
		if (s >= 0) selected = s;
	});
</script>

<svg
	viewBox={`0,0 ${size},${size}`}
	width={size}
	height={size}
	stroke="var(--earth)"
	stroke-width={2}
	fill="none"
>
	{#if !disabled}
		<EditablePath
			normalisedSegments={SVGPathCommander.normalizePath(d)}
			bind:selected
		/>
	{/if}
</svg>

<textarea
	bind:this={textArea}
	autocomplete="off"
	cols="30"
	rows={Math.max(12, d.split("\n").length + 1)}
	bind:value={d}
	onkeyup={() => updateLine()}
	onkeydown={() => updateLine()}
	onkeypress={() => updateLine()}
	onclick={() => updateLine()}
	class:normalised
	style={`background-position-y: calc(${selected} * var(--grid-y) + 0.25rem);`}
></textarea>

<Button
	disabled={disabled || d === formatPath(d, "relative")}
	on:click={() => {
		d = formatPath(d, "relative");
	}}>format to relative</Button
>
<Button
	disabled={disabled || d === formatPath(d, "absolute")}
	on:click={() => {
		d = formatPath(d, "absolute");
	}}>format to absolute</Button
>
<Button
	disabled={disabled || d === formatPath(d, "absolute")}
	on:click={() => {
		const params = new URLSearchParams({
			d,
		});
		if (selected >= 0) params.set("s", String(selected));
		window.location.search = `?${params.toString()}`;
	}}>save to URL</Button
>

{#if !normalised}
	<p>
		If you normalise &amp; format the path,
		you can higlight a line in the text
		area and get the corresponding segment higlighted
	</p>
{/if}

<style>
	svg,
	textarea {
		border: 0.125rem solid var(--skies);
	}

	textarea {
		display: block;
		appearance: none;
		border-radius: 0.125rem;
		width: min(calc(12 * var(--grid-x)), 100%);
		background: var(--clouds);
		color: var(--earth);
		margin: 0;
		transition:
			color 1.2s,
			background-color 1.2s;

		padding: 0.25rem;
		font-family: ui-monospace, monospace;
		font-size: 1rem;
		line-height: var(--grid-y);
		resize: none;
	}

	textarea.normalised {
		background-image: linear-gradient(
			var(--skies),
			var(--skies) var(--grid-y),
			transparent var(--grid-y)
		);
	}

	textarea:focus {
		border-color: var(--ocean);
		outline: none;
	}
</style>
