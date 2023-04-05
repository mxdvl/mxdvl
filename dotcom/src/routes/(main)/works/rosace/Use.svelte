<script lang="ts">
	import type { Point } from "./data";
	import { debug, selected, selected_index } from "./store";

	export let id: string;
	export let position: Point = { x: 0, y: 0 };
	export let angle = 0;
	export let scale = 1;

	export let colour: string | undefined = undefined;

	const index = scale * angle;

	$: transform = `scale(${scale} 1) rotate(${angle}) translate(${position.x} ${position.y})`;
	$: active = $selected === id;
	$: hover = active && $selected_index === index;
</script>

<use
	href={`#shape-${id}`}
	data-id={id}
	data-index={index}
	{transform}
	class:active
	class:hover
	stroke={colour}
	on:pointerover={() => {
		if (active) selected_index.set(index);
	}}
/>
{#if active && $debug}
	<text x={30} y={-20} {transform}>a:{Math.floor(angle)} s:{scale}</text>
	<line {transform} stroke="var(--ocean)" stroke-dasharray={[2, 6].join(" ")} x2={-position.x} y2={-position.y} />
{/if}

<style>
	use {
		fill: transparent;
	}

	text {
		stroke: none;
		fill: var(--skies);
		pointer-events: none;
	}

	.active {
		stroke: var(--ocean);
		fill: var(--skies);
	}

	.hover[data-id] {
		stroke: var(--glint);
		stroke-width: 2;
		cursor: move;
	}
</style>
