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
	$: current = $selected === id;
	$: active = current && $selected_index === index;
</script>

<use
	href={`#shape-${id}`}
	data-id={id}
	data-index={index}
	{transform}
	class:current
	class:active
	stroke={colour}
	on:pointerover={() => {
		if (active) selected_index.set(index);
	}}
/>

{#if active}
	<use {transform} href={`#shape-${id}`} class:current stroke-width={2} />
	{#if $debug}
		<text x={30} y={-20} {transform}>a:{Math.floor(angle)} s:{scale}</text>
		<line {transform} stroke="var(--ocean)" stroke-dasharray={[2, 6].join(" ")} x2={-position.x} y2={-position.y} />
	{/if}
{/if}

<style>
	use {
		fill: transparent;
		stroke-dasharray: 12;
	}

	use[data-id]:hover {
		cursor: move;
	}
	use.current {
		stroke: var(--ocean);
		animation: fill 360ms forwards;
	}

	use.active {
		stroke: var(--skies);
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 18;
	}

	text {
		stroke: none;
		fill: var(--skies);
		pointer-events: none;
	}

	@keyframes fill {
		from {
			stroke-dashoffset: 12;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
