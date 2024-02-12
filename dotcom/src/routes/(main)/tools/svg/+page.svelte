<script>
	import EditablePath from "./EditablePath.svelte";
	import SVGPathCommander from "svg-path-commander";

	/** @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d */
	let d = SVGPathCommander.pathToString([
		["m", 3, 3],
		["l", 60, 40],
		["a", 90, 120, 30, 0, 1, 120, 0],
		["l", -20, 60],
		["q", -20, 60, 20, 20],
		["l", 60, 0],
		["c", 60, 0, 60, -20, 20, -20],
		["c", 40, 0, 40, -20, 0, -20],
		["c", 40, 0, 40, -20, -20, -20],
	]);

	const size = 360;

	/** @param {string} d */
	const getSegments = (d) => {
		try {
			return SVGPathCommander.pathToRelative(d);
		} catch (_) {
			return [];
		}
	};

	$: segments = getSegments(d);
</script>

<svg viewBox={`0,0 ${size},${size}`} width={size} height={size} stroke="var(--earth)" stroke-width={2} fill="none">
	<EditablePath {d} />
</svg>

<textarea cols="30" rows="12" bind:value={d} />

<ul>
	{#each segments as [command, ...parts]}
		<li>
			<strong>{command}</strong>: {parts.join(" ")}
		</li>
	{/each}
</ul>

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
			background 1.2s;

		padding: 0.25rem;
		font-family: ui-monospace;
		font-size: 1rem;
		line-height: var(--grid-y);
		resize: none;
	}

	textarea:focus {
		border-color: var(--ocean);
		outline: none;
	}
</style>
