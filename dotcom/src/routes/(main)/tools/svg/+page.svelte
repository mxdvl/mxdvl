<script>
	import Button from "$lib/Button.svelte";
	import EditablePath from "./EditablePath.svelte";
	import SVGPathCommander from "svg-path-commander";
	import { onMount } from "svelte";

	/** @param {import('svg-path-commander').PathArray} segments */
	const format = (segments) => segments.map((segment) => segment.join(" ")).join("\n");

	/** @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d */
	let d = format([
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
	]);

	const size = 360;

	/** @type {HTMLTextAreaElement | undefined} */
	let textArea = undefined;

	/** @param {string} path */
	const getSegments = (path) => {
		return SVGPathCommander.isValidPath(path)
			? SVGPathCommander.pathToRelative(path)
			: /** @type {import('svg-path-commander').RelativeArray} */ ([["M", 0, 0]]);
	};

	let segments = getSegments(d);

	/** @type {(path: string, method: 'relative' | 'absolute') => string} */
	const formatPath = (path, method) => {
		switch (method) {
			case "relative": {
				return format(SVGPathCommander.pathToRelative(path));
			}
			case "absolute": {
				return format(SVGPathCommander.pathToAbsolute(path));
			}
		}
	};

	let selected = -1;

	$: disabled = !SVGPathCommander.isValidPath(d);

	$: normalised = !disabled && (d === formatPath(d, "relative") || d === formatPath(d, "absolute"));

	$: updateLine = () => {
		if (!textArea) return;
		if (!normalised) return;
		selected = d.slice(0, textArea.selectionStart).split("\n").length - 1;
	};

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const path = params.get("d");
		if (!path) return;
		if (!SVGPathCommander.isValidPath(path)) return;
		d = path;
	});
</script>

<svg viewBox={`0,0 ${size},${size}`} width={size} height={size} stroke="var(--earth)" stroke-width={2} fill="none">
	{#if !disabled}
		<EditablePath normalisedSegments={SVGPathCommander.normalizePath(d)} bind:selected />
	{/if}
</svg>

<textarea
	bind:this={textArea}
	autocomplete="off"
	cols="30"
	rows={Math.max(12, d.split("\n").length + 1)}
	bind:value={d}
	on:keyup={() => updateLine()}
	on:click={() => updateLine()}
	class:normalised
	style={`background-position-y: calc(${selected} * var(--grid-y) + 0.25rem);`}
/>

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

<p>
	Normalised? {normalised}
</p>

{#if !disabled}
	<ol>
		{#each SVGPathCommander.pathToRelative(d) as segment}
			<li>{segment}</li>
		{/each}
	</ol>
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
		font-family: ui-monospace;
		font-size: 1rem;
		line-height: var(--grid-y);
		resize: none;
	}

	textarea.normalised {
		background-image: linear-gradient(var(--skies), var(--skies) var(--grid-y), transparent var(--grid-y));
	}

	textarea:focus {
		border-color: var(--ocean);
		outline: none;
	}
</style>
