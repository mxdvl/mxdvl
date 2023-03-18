<script lang="ts">
	import { fade } from "svelte/transition";

	import Shape from "./Shape.svelte";
	import Loop from "./Loop.svelte";
	import Polygon from "./Polygon.svelte";
	import Spread from "./Spread.svelte";
	import { active } from "./store";
	import Path from "./Path.svelte";

	const xmlns = "http://www.w3.org/2000/svg";

	const size = 20 * 18 * 2;

	let sides = 5;

	let guides = true;
</script>

<div class="workspace">
	<h1>Rosace</h1>
	<div class="canvas" style={`width: ${size}px; height: ${size}px;`}>
		<svg viewBox={`-${size / 2},-${size / 2} ${size},${size}`}>
			{#if guides}
				<g class="guides" transition:fade>
					<Spread count={sides}>
						<line y2={-size / 2} />
					</Spread>

					<circle cx={0} cy={0} r={60} />
					<circle cx={0} cy={0} r={120} />
					<circle cx={0} cy={0} r={240} />
					<circle cx={0} cy={0} r={360} />
				</g>
			{/if}

			<Shape let:uuid>
				<Spread count={sides}>
					<g transform="rotate(-90) translate(20)">
						<Loop {uuid} length={30} count={3} />
					</g>
				</Spread>
			</Shape>

			<Shape let:uuid={uuid_2} let:position>
				<Spread count={sides} let:angle>
					<Path {position} {angle} uuid={uuid_2} d="M12,-60 l-6,-60 h36 Z" />
					<Path {position} {angle} uuid={uuid_2} d="M-12,-60 l6,-60 h-36 Z" />
				</Spread>
			</Shape>

			<Polygon radius={20} {sides} />
		</svg>
	</div>

	<h2>Todo</h2>
	<ul>
		<li>control individual elements + any symmetries</li>
		<li>save previous state</li>
		<li>handle each element via UUIDs</li>
		<li>create a catalog of shapes (loop, polygon, etc)</li>
		<li>handle different symmetries (translation, planar, polar)</li>
		<li>export resulting SVG</li>
		<li>Finish by April 17th</li>
	</ul>

	<div class="controls">
		<label>
			<input type="range" bind:value={sides} min="3" max="12" step="1" />
			– Number of sides ({sides})
		</label>

		<label>
			<input type="checkbox" bind:checked={guides} /> – Show guides
		</label>

		<div>Current context – {$active}</div>
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
