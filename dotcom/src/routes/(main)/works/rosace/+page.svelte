<script lang="ts">
	import { derived, writable } from "svelte/store";

	import Shape from "./Shape.svelte";
	import Polygon from "./Polygon.svelte";
	import Controls from "./Controls.svelte";

	import { debug, patterns, selected } from "./store";
	import type { Point } from "./data";
	import { onMount } from "svelte";

	/** the SVG XML namespace */
	const xmlns = "http://www.w3.org/2000/svg";

	onMount(() => {
		debug.set(window.location.hostname === "localhost");
	});

	const size = 20 * 18 * 2;

	let sides = 5;

	let guides = true;

	let dragging = false;
	const initial_point: Point = { x: 0, y: 0 };
	$: dragStart = initial_point;
	$: dragEnd = initial_point;
	$: dragOffset = initial_point;
	$: dragDelta = initial_point;
	$: final_position = initial_point;

	const point_from_event = (event: MouseEvent) =>
		new DOMPointReadOnly(event.offsetX - size / 2, event.offsetY - size / 2);

	const matrix_to_string = (matrix: DOMMatrixReadOnly) =>
		["matrix(", matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f, ")"].join(" ");

	const current = derived([patterns, selected], ([$patterns, $selected]) =>
		$selected ? $patterns.get($selected) : undefined,
	);

	const current_matrix = writable<DOMMatrixReadOnly | undefined>();

	current_matrix.subscribe((matrix) => {
		if (matrix) console.log(matrix_to_string(matrix));
	});

	const start_drag = (event: PointerEvent) => {
		if (event.target instanceof SVGPathElement) {
			event.preventDefault();
			const { uuid } = event.target.dataset;
			selected.set(uuid);

			if (uuid) {
				current_matrix.set(DOMMatrixReadOnly.fromMatrix(event.target.transform.baseVal.consolidate()?.matrix));
				const point = point_from_event(event);
				const offset = new DOMPointReadOnly(0, 0).matrixTransform($current_matrix);
				dragOffset = offset;

				dragStart = point;
				dragEnd = point;
				dragging = true;
			}
		} else {
			selected.set(undefined);
		}
	};

	const update_drag = (event: PointerEvent) => {
		if (dragging && $current_matrix) {
			event.preventDefault();
			const point = point_from_event(event);
			dragEnd = point;
			const delta = new DOMPointReadOnly(dragEnd.x - dragStart.x, dragEnd.y - dragStart.y);
			dragDelta = delta;

			const position = new DOMPointReadOnly(dragOffset.x + delta.x, dragOffset.y + delta.y).matrixTransform(
				$current_matrix.inverse().translate(dragOffset.x, dragOffset.y),
			);
			final_position = position;

			$current?.update((current) => ({
				...current,
				position,
			}));
		}
	};

	const stop_drag = () => {
		dragging = false;
	};
</script>

<div class="workspace">
	<h1>Rosace</h1>
	<div class="canvas" style={`width: ${size}px; height: ${size}px;`}>
		<svg
			viewBox={`-${size / 2},-${size / 2} ${size},${size}`}
			on:pointerdown={start_drag}
			on:pointermove={update_drag}
			on:pointerup={stop_drag}
			on:pointercancel={stop_drag}
		>
			{#each [...$patterns.entries()] as [id, pattern] (id)}
				<Shape {pattern} {guides} />
			{/each}

			{#if $debug && dragging}
				<g style="pointer-event: none;">
					<text x={-size / 2} y={size / 2} font-size={12} fill="currentColor" stroke="none"
						>{$current_matrix?.toString()}</text
					>
					<circle cx={dragStart.x} cy={dragStart.y} r={3} fill="currentColor" />
					<line x1={dragStart.x} y1={dragStart.y} x2={dragEnd.x} y2={dragEnd.y} />
					<line x1={dragStart.x} y1={dragStart.y} x2={dragEnd.x} y2={dragEnd.y} />

					<circle cx={dragOffset.x} cy={dragOffset.y} r={2} fill="var(--glint)" stroke="none" />
					<line
						stroke="var(--glint)"
						x1={dragOffset.x}
						y1={dragOffset.y}
						x2={dragOffset.x + dragDelta.x}
						y2={dragOffset.y + dragDelta.y}
					/>
					<line
						stroke="var(--glint)"
						x1={0}
						y1={0}
						x2={dragOffset.x + dragDelta.x}
						y2={dragOffset.y + dragDelta.y}
					/>

					<line stroke="var(--ocean)" x1={0} y1={0} x2={final_position.x} y2={final_position.y} />
				</g>
			{/if}

			<Polygon radius={20} {sides} />
		</svg>
	</div>

	<h2>Todo</h2>
	<ul>
		<li><s>control individual elements + any symmetries</s></li>
		<li><s>handle each element via UUIDs</s></li>
		<li><s>great drag-and-drop</s></li>
		<li><s>individual element repetition control</s></li>
		<li>handle different symmetries (translation, planar, polar)</li>
		<li>save previous state</li>
		<li>create a catalog of shapes (loop, polygon, etc)</li>
		<li>export resulting SVG</li>
		<li>Finish by <strong>April 17th</strong></li>
	</ul>

	<div class="controls">
		{#if $current}
			<Controls current={$current} {patterns} />
		{:else}
			<h3>(Select a pattern to control it)</h3>
		{/if}
	</div>
</div>

<style>
	.workspace {
		display: grid;
		grid-template-columns: min-content 1fr;
		grid-template-rows: auto calc(var(--grid-y) * 3) auto calc(var(--grid-y) * 9);
		column-gap: var(--grid-x);
		row-gap: var(--grid-y);
	}

	h1,
	h2 {
		margin: 0;
	}

	h1 {
		grid-column: span 2;
	}

	ul {
		padding: 0;
		padding-left: 1rem;
		margin: 0;
	}

	li {
		padding-bottom: var(--grid-y);
	}
	.canvas {
		margin: -1px;
		border: 2px solid var(--skies);
		background: var(--clouds);
		grid-row: span 2;
	}

	svg {
		display: block;
		stroke-width: 1;
		stroke: var(--earth);
		fill: none;
	}

	.controls {
		display: flex;
		flex-direction: column;
	}

	:global(header) {
		display: none;
	}
	:global(footer) {
		display: none;
	}
</style>
