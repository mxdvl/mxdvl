<script>
	import Shape from "./Shape.svelte";
	import Controls from "./Controls.svelte";
	import { bobbin } from "./store.svelte.js";
	import { patterns_to_string, string_to_patterns } from "./data.js";
	import Polygon from "./catalogue/Polygon.svelte";
	import Loop from "./catalogue/Loop.svelte";
	import Crescent from "./catalogue/Crescent.svelte";
	import Curve from "./catalogue/Curve.svelte";
	import Star from "./catalogue/Star.svelte";

	const size = 20 * 18 * 2;

	/** @type {SVGSVGElement} */
	let svg = $state();

	let guides = $state(true);

	let dragging = $state(false);

	/** @type {import('./data').Point} */
	const initial_point = { x: 0, y: 0 };

	let drag_points = $state({
		start: initial_point,
		end: initial_point,
		offset: initial_point,
		delta: initial_point,
		final_position: initial_point,
	});

	/** @type {(event: MouseEvent) => DOMPointReadOnly} */
	const point_from_event = (event) =>
		new DOMPointReadOnly(
			event.offsetX - size / 2,
			event.offsetY - size / 2,
		);

	// const current = $derived(selected && patterns.get(selected));

	/** @type {DOMMatrixReadOnly | undefined}*/
	let current_matrix = $state();

	const bobbin_state = /** @type {const} */ ({
		/** @param {string} state */
		set: (state) => {
			const patterns = string_to_patterns(state);

			bobbin.patterns.clear();
			for (const pattern of patterns) {
				const reactive_pattern = $state(pattern);
				bobbin.patterns.set(pattern.id, reactive_pattern);
			}

			// $patterns = $patterns;
		},
		/** get serialised pattern representation */
		get: () => patterns_to_string([...bobbin.patterns.values()]),
		/** save serialised representation to the URL */
		write: () => {
			const search =
				"?" + new URLSearchParams({ state: bobbin_state.get() });

			if (window.location.search !== search) {
				//goto(search, { noScroll: true });
			}
		},
		/** get the serialised state to the clipboard */
		copy: () => {
			navigator.clipboard.writeText(bobbin_state.get());
		},
		clear: () => {
			bobbin.patterns.clear();
		},
	});

	const current = $derived(bobbin.patterns.get(bobbin.selected));

	/** A seven-sided shape that illustrates advanced features */
	const default_state =
		"NoIgpgTAxgdghgWwF4A4DmBrAPgRgCxYCyWAtDgGwDsWADETQDQkDMNAOjAMIQQMCsATgAEAxjmGiGNEAxAIAVjgCezAGYwaARwGqs1YuIhY8zelI5QWYvjSHlyDHLfLWUHDjJB9mmmJqQATlB4ACZKWBAoWAD6ERAEdISMNHAoDChCtrY4Qji8KWkZWblCZPkAWp4hABZQAG4ANgDOcACWAPbkYBE4MRHM5LhRSVKp6ZkTOXmjhRPZpdM0lbIw6nB1AXiOAC5QULgEsfEEJHyDI+zws8VTvCwcY0WTC7zMHMsgqgGUSPJoITAUBBNHo+hA+NRTgIzJdHnMSrk7m8ruMbi8GMwPnAMBgcKlqpQYDgAA4RKJHSjURLJOFoxa055lKQfACu5GqqigIQgLLgACN9vpSIMcChhmIUABBUWOJ7zRhkKVpUXwrKyyoAXSAA";

	const drag =
		/** @type {const} @satisfies {Record<string, (event: PointerEvent) => void>} */ ({
			start: (event) => {
				console.log(current);
				if (event.target instanceof SVGUseElement) {
					event.preventDefault();
					bobbin.animate = false;

					const { id, index } = event.target.dataset;
					bobbin.selected = id;

					const numeric_index = Number(index);
					if (!Number.isNaN(numeric_index))
						bobbin.selected_index = numeric_index;

					if (bobbin.selected !== "") {
						current_matrix = DOMMatrixReadOnly.fromMatrix(
							event.target.transform.baseVal.consolidate()
								?.matrix,
						);

						const point = point_from_event(event);
						const offset = new DOMPointReadOnly(
							0,
							0,
						).matrixTransform(current_matrix);
						drag_points.offset = offset;

						drag_points.start = point;
						drag_points.end = point;
						drag_points.delta = initial_point;
						drag_points.final_position = initial_point;
						dragging = true;
					}
				} else {
					bobbin.selected = "";
				}
			},
			update: (event) => {
				if (dragging && current_matrix && current) {
					event.preventDefault();
					const point = point_from_event(event);
					drag_points.end = point;
					const delta = new DOMPointReadOnly(
						drag_points.end.x - drag_points.start.x,
						drag_points.end.y - drag_points.start.y,
					);
					drag_points.delta = delta;

					const position = new DOMPointReadOnly(
						drag_points.offset.x + delta.x,
						drag_points.offset.y + delta.y,
					).matrixTransform(
						current_matrix
							.inverse()
							.translate(
								drag_points.offset.x,
								drag_points.offset.y,
							),
					);
					drag_points.final_position = position;

					current.position = position;
				}
			},
			stop: () => {
				dragging = false;
				bobbin_state.write();
			},
		});

	// search = "";

	$effect.root(() => {
		// handle legacy hash states
		const prefix = "#shape/";
		if (window.location.hash.startsWith(prefix)) {
			window.location.href = window.location.href.replace(
				prefix,
				"?state=",
			);
		}

		bobbin.debug = window.location.hostname === "localhost";

		bobbin_state.set(default_state);

		function listener() {
			const previous_state = new URLSearchParams(
				window.location.search,
			).get("state");
			if (previous_state) bobbin_state.set(previous_state);
		}
		window.addEventListener("popstate", listener);

		return () => window.removeEventListener("popstate", listener);
	});

	$effect(() => {
		console.log(bobbin);
		bobbin_state.write();
	});
</script>

<div id="workspace">
	<div id="canvas" class="border">
		<svg
			bind:this={svg}
			viewBox={`-${size / 2},-${size / 2} ${size},${size}`}
			onpointerdown={drag.start}
			onpointermove={drag.update}
			onpointerup={drag.stop}
			onpointercancel={drag.stop}
		>
			<defs>
				<text>Generated with @mxdvl’s Rosace</text>
				<text>https://www.mxdvl.com/works/rosace{bobbin_state}</text>
			</defs>

			{#each [...bobbin.patterns] as [id, pattern] (id)}
				<Shape {pattern} {guides} />
			{/each}

			{#if bobbin.debug && dragging}
				<g style="pointer-event: none;">
					<text
						x={-size / 2}
						y={size / 2}
						font-size={12}
						fill="currentColor"
						stroke="none">{current_matrix?.toString()}</text
					>
					<circle
						cx={drag_points.start.x}
						cy={drag_points.start.y}
						r={3}
						fill="currentColor"
					/>
					<line
						x1={drag_points.start.x}
						y1={drag_points.start.y}
						x2={drag_points.end.x}
						y2={drag_points.end.y}
					/>
					<line
						x1={drag_points.start.x}
						y1={drag_points.start.y}
						x2={drag_points.end.x}
						y2={drag_points.end.y}
					/>

					<circle
						cx={drag_points.offset.x}
						cy={drag_points.offset.y}
						r={2}
						fill="var(--glint)"
						stroke="none"
					/>
					<line
						stroke="var(--glint)"
						x1={drag_points.offset.x}
						y1={drag_points.offset.y}
						x2={drag_points.offset.x + drag_points.delta.x}
						y2={drag_points.offset.y + drag_points.delta.y}
					/>
					<line
						stroke="var(--glint)"
						x1={0}
						y1={0}
						x2={drag_points.offset.x + drag_points.delta.x}
						y2={drag_points.offset.y + drag_points.delta.y}
					/>

					<line
						stroke="var(--ocean)"
						x1={0}
						y1={0}
						x2={drag_points.final_position.x}
						y2={drag_points.final_position.y}
					/>
				</g>
			{/if}
		</svg>
	</div>

	<Controls {svg} />

	<ul id="shapes">
		<li><Polygon /></li>
		<li><Loop /></li>
		<li><Crescent /></li>
		<li><Curve /></li>
		<li><Star /></li>
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

	ul {
		padding: 0;
		margin: 0;
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
		row-gap: var(--grid-y);
	}

	#shapes li {
		background-color: var(--clouds);
		border: 2px solid var(--skies);
		margin: -1px;
		display: grid;
		align-items: center;
		grid-template-columns: min-content auto;
		width: 100%;
	}

	#shapes li :global(svg) {
		grid-row-start: 1;
		grid-row-end: span 6;
	}

	#shapes li :global(label) {
		grid-column-start: 2;
		display: flex;
		gap: 0.5rem;
	}

	#shapes li :global(input) {
		min-width: calc(2 * var(--grid-x));
		flex-grow: 1;
	}

	#shapes li :global(button) {
		width: max-content;
	}
</style>
