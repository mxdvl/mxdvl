<script lang="ts">
	import { fade } from "svelte/transition";
	import { derived, get, writable, type Writable } from "svelte/store";
	import { v4 } from "uuid";

	import Shape from "./Shape.svelte";
	import Polygon from "./Polygon.svelte";
	import Spread from "./Spread.svelte";
	import Path from "./Path.svelte";
	import Mirror from "./Mirror.svelte";

	import { selected } from "./store";
	import { back_and_forth } from "./weaving";
	import Number from "../../../../lib/Number.svelte";

	/** the SVG XML namespace */
	const xmlns = "http://www.w3.org/2000/svg";

	const size = 20 * 18 * 2;

	let sides = 5;

	const loop = (count: number, bulge: number, length: number) =>
		back_and_forth([
			`a${length / bulge},${length / bulge} 0 0 1 ${length},0`,
			`a${length / bulge},${length / bulge} 0 0 1 -${length},0`,
		])(count);

	let guides = true;

	let dragging = false;
	let dragStart = { x: 0, y: 0 };
	let dragEnd = { x: 0, y: 0 };
	let dragOffset = { x: 0, y: 0 };

	const mouse_down = (event: MouseEvent) => {
		if (event.target instanceof SVGPathElement) {
			event.preventDefault();
			const { uuid } = event.target.dataset;
			selected.set(uuid);

			if (uuid) {
				start_drag(
					event.target.transform.baseVal.consolidate()?.matrix,
					new DOMPoint(event.offsetX - size / 2, event.offsetY - size / 2),
				);
			}
		} else {
			selected.set(undefined);
		}
	};

	const current_matrix = writable<DOMMatrix>();

	const start_drag = (matrix = new DOMMatrix(), point: DOMPoint) => {
		current_matrix.set(matrix);

		dragStart = point.matrixTransform($current_matrix.inverse());
		dragEnd = dragStart;

		const current_pattern = patterns.find(({ id }) => id === $selected);
		if (current_pattern) {
			dragOffset = get(current_pattern.position);
		}
		dragging = true;
	};

	const update_drag = (x: number, y: number) => {
		dragEnd = new DOMPoint(x, y).matrixTransform($current_matrix.inverse());
		const { position } = patterns.find(({ id }) => id === $selected) ?? {};
		position?.set({ x: dragOffset.x + dragEnd.x - dragStart.x, y: dragOffset.y + dragEnd.y - dragStart.y });
	};

	interface Point {
		x: number;
		y: number;
	}

	interface Pattern {
		id: string;
		count: number;
		mirror: boolean;
		position: Writable<Point>;
		d: string;
	}

	let patterns: Pattern[] = [
		{
			id: v4(),
			count: sides,
			mirror: true,
			position: writable({ x: 0, y: -80 }),
			d: ["M0,0", ...loop(3, 3 / 2, 19), "Z"].join(" "),
		},
		{
			id: v4(),
			count: sides,
			mirror: false,
			position: writable({ x: 20, y: 0 }),
			d: ["M0,0", ...loop(3, 4 / 3, 30), "Z"].join(" "),
		},
		{
			id: v4(),
			count: sides,
			mirror: true,
			position: writable({ x: 0, y: -50 }),
			d: ["M0,0", ...loop(2, 3 / 2, 18), "Z"].join(" "),
		},
		{
			id: v4(),
			count: sides,
			mirror: false,
			position: writable({ x: 0, y: -150 }),
			d: ["M-12,0", ...loop(1, 2, 24), "Z"].join(" "),
		},
	];
</script>

<div class="workspace">
	<h1>Rosace</h1>
	<div class="canvas" style={`width: ${size}px; height: ${size}px;`}>
		<svg
			viewBox={`-${size / 2},-${size / 2} ${size},${size}`}
			on:mousedown={mouse_down}
			on:mousemove={({ offsetX, offsetY }) => {
				if (dragging) {
					update_drag(offsetX - size / 2, offsetY - size / 2);
				}
			}}
			on:mouseup={() => {
				dragging = false;
			}}
			on:mouseleave={() => {
				dragging = false;
			}}
		>
			{#if guides}
				<g class="guides" transition:fade>
					<Spread count={sides} let:angle>
						<Path angle={angle - 90} d={`M0,0H${size}`} />
					</Spread>

					<circle cx={0} cy={0} r={60} />
					<circle cx={0} cy={0} r={120} />
					<circle cx={0} cy={0} r={240} />
					<circle cx={0} cy={0} r={360} />
				</g>
			{/if}

			{#each patterns as { id, mirror, count, position, d } (id)}
				<Shape>
					<Spread {count} let:angle>
						<Mirror scales={mirror ? [-1, 1] : [1]} let:scale>
							<Path {position} {angle} {scale} uuid={id} {d} />
						</Mirror>
					</Spread>
				</Shape>
			{/each}

			<Polygon radius={20} {sides} />
		</svg>
	</div>

	<h2>Todo</h2>
	<ul>
		<li><s>control individual elements + any symmetries</s></li>
		<li><s>handle each element via UUIDs</s></li>
		<li>great drag-and-drop</li>
		<li>individual element repetition control</li>
		<li>handle different symmetries (translation, planar, polar)</li>
		<li>save previous state</li>
		<li>create a catalog of shapes (loop, polygon, etc)</li>
		<li>export resulting SVG</li>
		<li>Finish by <strong>April 17th</strong></li>
	</ul>

	<div class="controls">
		<label>
			<input type="range" bind:value={sides} min="3" max="12" step="1" />
			– Number of sides ({sides})
		</label>

		<label>
			<input type="checkbox" bind:checked={guides} /> – Show guides
		</label>

		<div>
			Selected: – {$selected},
			<button
				on:click={() => {
					patterns = patterns.filter(({ id }) => id !== $selected);
				}}>delete</button
			>
		</div>
	</div>
</div>

<style>
	.workspace {
		display: grid;
		grid-template-columns: min-content 1fr;
		grid-template-rows: auto calc(var(--grid-y) * 3) auto;
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

	.guides {
		stroke: var(--skies);
		stroke-width: 2;
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
