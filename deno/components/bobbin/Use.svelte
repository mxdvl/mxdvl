<script>
	import { state as bobbin_state } from "./store.svelte.js";

	/** @type {{id: string, position?: import('./data').Point, angle?: number, scale?: number, colour?: string}} */
	let {
		id,
		position = { x: 0, y: 0 },
		angle = 0,
		scale = 1,
		colour,
	} = $props();
	/** @type {}*/

	const index = scale * angle;

	const transform = $derived(
		`scale(${scale} 1) rotate(${angle}) translate(${position.x} ${position.y})`,
	);
	const current = $derived(bobbin_state.selected === id);
	const active = $derived(current && bobbin_state.selected_index === index);
	const angle_difference = $derived(
		Math.abs((bobbin_state.selected_index ?? 0) - index),
	);
	const angle_distance = $derived(
		angle_difference > 180 ? 360 - angle_difference : angle_difference,
	);
</script>

<use
	href={`#shape-${id}`}
	data-id={id}
	data-index={index}
	{transform}
	class:current
	class:active
	style={`--delay: ${angle_distance * 3}ms`}
	stroke={colour}
	on:pointerover={() => {
		if (active) selected_index.set(index);
	}}
/>

{#if active}
	<use
		{transform}
		href={`#shape-${id}`}
		class:current
		stroke-width={2}
		class="do-not-point"
	/>
	{#if bobbin_state.debug}
		<text x={30} y={-20} {transform} class="do-not-point"
			>a:{Math.floor(angle)} s:{scale}</text
		>
		<line
			{transform}
			stroke="var(--ocean)"
			stroke-dasharray={[2, 6].join(" ")}
			x2={-position.x}
			y2={-position.y}
		/>
	{/if}
{/if}

<style>
	.do-not-point {
		pointer-events: none;
	}

	use {
		fill: transparent;
		stroke-dasharray: 12;
	}

	use[data-id]:hover {
		cursor: move;
	}
	use.current {
		stroke: var(--ocean);
		animation: fill 180ms ease-out var(--delay) both;
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
