<script lang="ts">
	import type { Writable } from "svelte/store";
	import { active } from "./store";

	export let d: string;
	export let uuid: string | undefined;
	export let position: Writable<{ x: number; y: number }>;
	export let angle = 0;

	let dragging = false;

	const radians = (angle * Math.PI) / 180;
	const { sin, cos } = Math;
</script>

<g
	transform={`translate(${$position.x} ${$position.y})`}
	on:mousemove={({ movementX, movementY }) => {
		if (dragging) {
			$position.x += movementX * cos(radians) + movementY * sin(radians);
			$position.y += movementX * -sin(radians) + movementY * cos(radians);
		}
	}}
	on:mousedown={() => {
		dragging = true;
	}}
	on:mouseup={() => {
		dragging = false;
	}}
	on:mouseleave={() => {
		dragging = false;
	}}
>
	<!-- <text>{angle}</text>
	<text dy="16">{radians}</text> -->
	<path class:active={$active === uuid} {d} />
</g>

<style>
	path {
		fill: transparent;
	}

	path:hover {
		stroke: var(--glint);
		stroke-width: 2;
	}

	.active {
		stroke: var(--ocean);
		fill: var(--skies);
		cursor: grab;
	}
</style>
