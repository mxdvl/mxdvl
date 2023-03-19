<script lang="ts">
	import { readable, type Readable } from "svelte/store";
	import { selected } from "./store";

	export let d: string;
	export let uuid: string | undefined = undefined;
	export let position: Readable<{ x: number; y: number }> = readable({ x: 0, y: 0 });
	export let angle = 0;
	export let scale = 1;

	$: transform = `scale(${scale} 1) rotate(${angle}) translate(${$position.x} ${$position.y})`;
	$: active = $selected === uuid;
</script>

<div draggable="true" />

{#if uuid}
	{#if active}
		<text {transform}>angle:{Math.floor(angle)} scale:{scale}</text>
		<line {transform} stroke="var(--ocean)" x2={-$position.x} y2={-$position.y} />
	{/if}
	<path {transform} data-uuid={uuid} class:active {d} />
{:else}
	<path {transform} {d} />
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
		cursor: grab;
	}

	.active {
		stroke: var(--ocean);
		fill: var(--skies);
	}
</style>
