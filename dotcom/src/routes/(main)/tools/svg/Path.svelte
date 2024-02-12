<script>
	import SVGPathCommander from "svg-path-commander";
	import Svg from "../../works/bobbin/SVG.svelte";

	export let visualise = false;
	/** @type {string} */
	export let d;

	/** @typedef {{ x: number, y: number, segment: import('svg-path-commander').NormalSegment}} Segment */

	/** @param {string} d */
	const getHandles = (d) => {
		try {
			return SVGPathCommander.normalizePath(d).reduce(
				({ x0, y0, handles }, segment) => {
					switch (segment[0]) {
						case "M": {
							return { x0: segment[1], y0: segment[2], handles };
						}
						case "L": {
							const [, x1, y1] = segment;
							handles.push(`M${x0},${y0}L${x1},${y1}`);
							return { x0: segment[1], y0: segment[2], handles };
						}
						case "C": {
							const [, x1, y1, x2, y2, x3, y3] = segment;
							handles.push(`M${x0},${y0}L${x1},${y1}`);
							handles.push(`M${x3},${y3}L${x2},${y2}`);
							return { x0: segment[5], y0: segment[6], handles };
						}
						case "Q": {
							const [, x1, y1, x2, y2] = segment;
							handles.push(`M${x0},${y0}L${x1},${y1} ${x2},${y2}`);
							return { x0: segment[3], y0: segment[4], handles };
						}
						case "A": {
							const [, rx, ry, angle, large, sweep, x1, y1] = segment;
							handles.push(`M${x0},${y0}L${x1},${y1}`);
							handles.push(`M${x0},${y0}A${rx},${ry},${angle},${1 - large},${1 - sweep},${x1},${y1}`);
							return { x0: segment[6], y0: segment[7], handles };
						}
						case "Z": {
							return { x0: 0, y0: 0, handles };
						}
					}
				},
				{ x0: 0, y0: 0, handles: /** @type {string[]} */ ([]) },
			).handles;
		} catch (_) {
			return [];
		}
	};

	/** @param {string} d */
	const getSegments = (d) => {
		try {
			return SVGPathCommander.normalizePath(d).reduce(
				({ x, y, segments }, segment) => {
					switch (segment[0]) {
						case "M": {
							return { x: segment[1], y: segment[2], segments };
						}
						case "L": {
							segments.push([["M", x, y], segment]);
							return { x: segment[1], y: segment[2], segments };
						}
						case "C": {
							segments.push([["M", x, y], segment]);
							return { x: segment[5], y: segment[6], segments };
						}
						case "Q": {
							segments.push([["M", x, y], segment]);
							return { x: segment[3], y: segment[4], segments };
						}
						case "A": {
							segments.push([["M", x, y], segment]);
							return { x: segment[6], y: segment[7], segments };
						}
						case "Z":
					}

					return { x, y, segments };
				},
				{
					x: 0,
					y: 0,
					segments: /** @type {import('svg-path-commander').NormalArray[]} */ ([]),
				},
			).segments;
		} catch (_) {
			return [];
		}
	};

	$: handles = visualise ? getHandles(d) : [];

	$: segments = getSegments(d);

	/** @type {number | undefined} */
	let selected = undefined;
</script>

<marker id="dot" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="6" markerHeight="6">
	<circle cx="6" cy="6" r="4" fill="var(--glint)" stroke="none" />
</marker>

{#each segments as segment}{/each}

{#each segments as segment, index}
	{@const active = index === selected}
	{#if active}
		{@const { x, y, width, height } = SVGPathCommander.getPathBBox(segment)}
		<rect x={x - 6} y={y - 6} width={width + 12} height={height + 12} />
	{/if}
	<path
		class:active
		class="segment"
		d={SVGPathCommander.pathToString(segment)}
		on:click={() => {
			selected = index;
		}}
		tabindex={0}
		role="button"
		on:keydown={(event) => {
			if (!["Enter", " "].includes(event.key)) return;
			event.preventDefault();
			selected = index;
		}}
	/>
	{#if active}
		{#each getHandles(SVGPathCommander.pathToString(segment)) as handle}
			<path
				class="handles"
				d={handle}
				stroke-dasharray="1 6"
				stroke-linecap="round"
				marker-start="url(#dot)"
				marker-mid="url(#dot)"
				marker-end="url(#dot)"
			/>
		{/each}
	{/if}
{/each}

<style>
	path {
		stroke: var(--earth);
		stroke-width: 2;
	}

	path.segment {
		cursor: pointer;
	}

	path.segment.active {
		stroke: var(--ocean);
	}

	path.segment:hover,
	path.segment:focus {
		outline: none;
		stroke: var(--glint);
		stroke-width: 4;
	}

	path.handles {
		stroke: var(--glint);
		stroke-width: 1.5;
	}

	rect {
		stroke: var(--skies);
		stroke-width: 2;
	}
</style>
