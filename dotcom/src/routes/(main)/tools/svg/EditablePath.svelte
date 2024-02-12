<script>
	import SVGPathCommander from "svg-path-commander";

	/** @type {import('svg-path-commander').NormalArray} */
	export let normalisedSegments;

	/** @typedef {[import('svg-path-commander').MSegment, import('svg-path-commander').NormalSegment]} Segment */

	/**
	 * @param {Segment} segment
	 */
	const getHandles = (segment) => {
		const [, x0, y0] = segment[0];
		switch (segment[1][0]) {
			case "Z":
			case "M": {
				return [];
			}
			case "L": {
				const [, x1, y1] = segment[1];
				return [`M${x0},${y0}L${x1},${y1}`];
			}
			case "C": {
				const [, x1, y1, x2, y2, x3, y3] = segment[1];
				return [`M${x0},${y0}L${x1},${y1}`, `M${x3},${y3}L${x2},${y2}`];
			}
			case "Q": {
				const [, x1, y1, x2, y2] = segment[1];
				return [`M${x0},${y0}L${x1},${y1} ${x2},${y2}`];
			}
			case "A": {
				const [, rx, ry, angle, large, sweep, x1, y1] = segment[1];
				return [
					`M${x0},${y0}L${x1},${y1}`,
					`M${x0},${y0}A${rx},${ry},${angle},${1 - large},${1 - sweep},${x1},${y1}`,
				];
			}
		}
	};

	/** @param {import('svg-path-commander').NormalArray} normalArray */
	const getAbsoluteSegments = (normalArray) =>
		normalArray.reduce(
			({ x, y, segments }, segment) => {
				switch (segment[0]) {
					case "M": {
						segments.push([["M", x, y], segment]);
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
					case "Z": {
						const [[, x0, y0]] = SVGPathCommander.normalizePath(normalArray);
						segments.push([
							["M", x, y],
							["L", x0, y0],
						]);
						return { x: x0, y: y0, segments };
					}
				}
			},
			{
				x: 0,
				y: 0,
				segments: /** @type {Segment[]} */ ([]),
			},
		).segments;

	/** @type {number | undefined} */
	export let selected = undefined;
</script>

<marker id="dot" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="6" markerHeight="6">
	<circle cx="6" cy="6" r="4" fill="var(--glint)" stroke="none" />
</marker>

{#each getAbsoluteSegments(normalisedSegments) as segment, index}
	{@const active = index === selected}
	{#if active}
		{@const { x, y, width, height } = SVGPathCommander.getPathBBox(segment)}
		<rect x={x - 6} y={y - 6} width={width + 12} height={height + 12} />
		{#if segment[1][0] === "M"}
			<line
				class="handles"
				x1={x}
				y1={y}
				x2={x + width}
				y2={y + height}
				marker-start="url(#dot)"
				marker-end="url(#dot)"
			/>
		{/if}
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
		{#each getHandles(segment) as handle}
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

	.handles {
		stroke: var(--glint);
		stroke-width: 1.5;
		stroke-dasharray: 2 6;
		stroke-linecap: round;
	}

	rect {
		stroke: var(--skies);
		stroke-width: 2;
	}
</style>
