<script>
	import Path from "./Path.svelte";
	import SVGPathCommander from "svg-path-commander";

	/** @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d */
	let d = SVGPathCommander.pathToString([
		["m", 3, 3],
		["l", 60, 20],
		["l", 120, 0],
		["l", 0, 60],
		["c", 20, 0, 60, -30, 20, -20],
	]);

	const size = 360;

	/** @param {string} d */
	const getPathCommander = (d) => {
		try {
			return new SVGPathCommander(d);
		} catch (_) {
			return undefined;
		}
	};

	$: pathCommander = getPathCommander(d);
</script>

<svg viewBox={`0,0 ${size},${size}`} width={size} height={size} stroke="var(--earth)" stroke-width={2} fill="none">
	<Path visualise={true} {d} />
	<g transform="translate(20 20)">
		<Path visualise={true} d={pathCommander?.normalize.toString() ?? ""} />
	</g>
</svg>

<textarea cols="30" bind:value={d} />

<ul>
	{#each pathCommander?.segments ?? [] as [command, ...parts]}
		<li>
			{command}: {parts.join(" ")}
		</li>
	{/each}
</ul>
