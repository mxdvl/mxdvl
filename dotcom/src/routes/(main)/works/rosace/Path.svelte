<script lang="ts">
	import type { Point } from "./data";
	import { selected } from "./store";

	export let d: string;
	export let uuid: string | undefined = undefined;
	export let position: Point = { x: 0, y: 0 };
	export let angle = 0;
	export let scale = 1;

	export let colour: string | undefined = undefined;

	$: transform = `scale(${scale} 1) rotate(${angle}) translate(${position.x} ${position.y})`;
	$: active = $selected === uuid;
</script>

<div draggable="true" />

{#if uuid}
	<path {transform} data-uuid={uuid} class:active stroke={colour} {d} />
	{#if active}
		<!-- <text x={30} y={-20} {transform}>a:{Math.floor(angle)} s:{scale}</text> -->
		<!-- <line {transform} stroke="var(--ocean)" x2={-position.x} y2={-position.y} /> -->
	{/if}
{:else}
	<path {transform} stroke={colour} {d} />
{/if}

<style>
	path {
		fill: transparent;
	}

	text {
		stroke: none;
		fill: var(--skies);
		pointer-events: none;
		user-select: none;
	}

	[data-uuid]:hover {
		stroke: var(--glint);
		stroke-width: 2;
		cursor: move;
	}

	.active {
		stroke: var(--ocean);
		fill: var(--skies);
	}
</style>
