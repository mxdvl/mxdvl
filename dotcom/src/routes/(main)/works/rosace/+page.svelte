<script lang="ts">
	import { derived, get, writable } from "svelte/store";
	import { onMount } from "svelte";
	import { page } from "$app/stores";

	import Shape from "./Shape.svelte";
	import Controls from "./Controls.svelte";
	import { debug, patterns, selected, selected_index } from "./store";
	import { patterns_to_string, type Pattern, type Point, string_to_patterns } from "./data";
	import Polygon from "./Polygon.svelte";
	import Loop from "./Loop.svelte";

	export let data;

	onMount(async () => {
		debug.set(window.location.hostname === "localhost");

		/** handle legacy hash states */
		const prefix = "#shape/";
		if (window.location.hash.startsWith(prefix)) {
			window.location.href = window.location.href.replace(prefix, "?state=");
		}

		patterns.subscribe(() => {
			save_state();
		});

		selected.subscribe((selected) => {
			selected === undefined && selected_index.set(0);
		});
	});

	const size = 20 * 18 * 2;

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

	const current = derived([patterns, selected], ([$patterns, $selected]) => $patterns.get($selected ?? ""));

	const current_matrix = writable<DOMMatrixReadOnly | undefined>();

	const save_state = () => {
		const patterns_snapshot: Pattern[] = [];

		for (const [, pattern] of $patterns) {
			patterns_snapshot.push(get(pattern));
		}

		const state = patterns_to_string(patterns_snapshot);

		const search = "?" + new URLSearchParams({ state });

		if (window.location.search !== search) {
			window.history.pushState(state, "", search);
		}
	};

	const read_state = (state: string) => {
		const saved_patterns = string_to_patterns(state);

		$patterns.clear();
		for (const saved_pattern of saved_patterns) {
			$patterns.set(saved_pattern.id, writable(saved_pattern));
		}

		$patterns = $patterns;
	};

	console.log({ data });

	if (data.state) read_state(data.state);

	const drag = {
		start: (event) => {
			if (event.target instanceof SVGUseElement) {
				event.preventDefault();
				const { id, index } = event.target.dataset;
				selected.set(id);

				const numeric_index = Number(index);
				if (!Number.isNaN(numeric_index)) selected_index.set(numeric_index);

				if ($selected !== undefined) {
					current_matrix.set(
						DOMMatrixReadOnly.fromMatrix(event.target.transform.baseVal.consolidate()?.matrix),
					);
					const point = point_from_event(event);
					const offset = new DOMPointReadOnly(0, 0).matrixTransform($current_matrix);
					dragOffset = offset;

					dragStart = point;
					dragEnd = point;
					dragDelta = initial_point;
					final_position = initial_point;
					dragging = true;
				}
			} else {
				selected.set(undefined);
			}
		},
		update: (event) => {
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
		},
		stop: () => {
			dragging = false;
			save_state();
		},
	} as const satisfies Record<string, (event: PointerEvent) => void>;
</script>

{#if $page.url.origin !== "www.mxdvl.com"}
	<h3>
		<a href={`https://www.mxdvl.com/works/rosace?${$page.url.search}`}
			>Currently on a develop branch, see www.mxdvl.com version</a
		>
	</h3>
{/if}

<div id="workspace">
	<div id="canvas" class="border">
		<svg
			id="rosace"
			viewBox={`-${size / 2},-${size / 2} ${size},${size}`}
			on:pointerdown={drag.start}
			on:pointermove={drag.update}
			on:pointerup={drag.stop}
			on:pointercancel={drag.stop}
		>
			<defs>
				<text stroke="none">Generated with @mxdvl’s Rosace</text>
				<text stroke="none">https://www.mxdvl.com/works/rosace{$page.url.search}</text>
			</defs>

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
		</svg>
	</div>

	<Controls {patterns} />

	<ul id="shapes">
		<li><Polygon /></li>
		<li><Loop /></li>
	</ul>

	<h2>Todo</h2>
	<ul id="todo">
		<li><s>control individual elements + any symmetries</s></li>
		<li><s>handle each element via unique IDs</s></li>
		<li><s>great drag-and-drop</s></li>
		<li><s>individual element repetition control</s></li>
		<li>handle different symmetries (translation, planar, polar)</li>
		<li>
			<s>save previous state</s>
			<button
				on:click={() => {
					window.location.hash = "";
					$patterns = new Map();
				}}>clear</button
			>
		</li>
		<li><label> <input type="checkbox" bind:checked={$debug} />Advanced debug info</label></li>
		<li>create a catalog of shapes (loop, polygon, etc)</li>
		<li><s>export resulting SVG</s></li>
		<li>Finish by <strong>April 17th</strong></li>
	</ul>
</div>

<style>
	#workspace {
		display: grid;
		grid-template-columns: auto;
		column-gap: var(--grid-x);
		row-gap: var(--grid-y);
	}

	/** 18 × 61 = 1098 */
	@media screen and (min-width: 1098px) {
		#workspace {
			grid-template-columns: 720px 1fr;
		}
	}

	h2 {
		margin: 0;
		grid-column: 1 / -1;
	}

	ul {
		padding: 0;
		margin: 0;
	}

	#todo {
		padding-left: 1rem;
	}

	#todo li {
		padding-bottom: var(--grid-y);
	}

	#canvas {
		background: var(--clouds);
		aspect-ratio: 1;
	}

	.border {
		margin: -1px;
		border: 2px solid var(--skies);
	}

	svg {
		display: block;
		stroke-width: 1;
		stroke: var(--earth);
		fill: none;
		touch-action: pinch-zoom;
	}

	svg :global(text) {
		user-select: none;
	}

	#shapes {
		display: flex;
		list-style-type: none;
		margin: 0;
		padding: 0;
		flex-wrap: wrap;
		column-gap: var(--grid-x);
	}
</style>
