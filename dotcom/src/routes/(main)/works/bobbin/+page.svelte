<script>
	import { derived, get, writable } from "svelte/store";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	import Shape from "./Shape.svelte";
	import Controls from "./Controls.svelte";
	import { animate, debug, patterns, selected, selected_index } from "./store";
	import { patterns_to_string, string_to_patterns } from "./data";
	import Polygon from "./catalogue/Polygon.svelte";
	import Loop from "./catalogue/Loop.svelte";
	import Crescent from "./catalogue/Crescent.svelte";
	import Curve from "./catalogue/Curve.svelte";
	import Star from "./catalogue/Star.svelte";

	export let data;

	const size = 20 * 18 * 2;

	/** @type {SVGSVGElement} */
	let svg;

	let guides = true;

	let dragging = false;
	/** @type {import('./data').Point} */
	const initial_point = { x: 0, y: 0 };
	$: dragStart = initial_point;
	$: dragEnd = initial_point;
	$: dragOffset = initial_point;
	$: dragDelta = initial_point;
	$: final_position = initial_point;

	/** @type {(event: MouseEvent) => DOMPointReadOnly} */
	const point_from_event = (event) => new DOMPointReadOnly(event.offsetX - size / 2, event.offsetY - size / 2);

	const current = derived([patterns, selected], ([$patterns, $selected]) => $patterns.get($selected ?? ""));

	/** @type {import("svelte/store").Writable<DOMMatrixReadOnly | undefined>}*/
	const current_matrix = writable();

	const state = /** @type {const} */ ({
		/** @param {string} state */
		set: (state) => {
			const saved_patterns = string_to_patterns(state);

			$patterns.clear();
			for (const saved_pattern of saved_patterns) {
				$patterns.set(saved_pattern.id, writable(saved_pattern));
			}

			$patterns = $patterns;
		},
		get: () => {
			/** @type {import('./data').Pattern[]} */
			const patterns_snapshot = [];

			for (const [, pattern] of $patterns) {
				patterns_snapshot.push(get(pattern));
			}

			return patterns_to_string(patterns_snapshot);
		},
		write: () => {
			const search = "?" + new URLSearchParams({ state: state.get() });

			if (window.location.search !== search) {
				goto(search, { noScroll: true });
			}
		},
		copy: () => {
			navigator.clipboard.writeText(state.get());
		},
		clear: () => {
			$patterns = new Map();
		},
	});

	if (data.state) state.set(data.state);

	const drag = /** @type {const} @satisfies {Record<string, (event: PointerEvent) => void>} */ ({
		start: (event) => {
			if (event.target instanceof SVGUseElement) {
				event.preventDefault();
				animate.set(false);

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
			state.write();
		},
	});

	onMount(async () => {
		debug.set(window.location.hostname === "localhost");

		/** handle legacy hash states */
		const prefix = "#shape/";
		if (window.location.hash.startsWith(prefix)) {
			window.location.href = window.location.href.replace(prefix, "?state=");
		}

		patterns.subscribe(() => {
			state.write();
		});

		selected.subscribe((selected) => {
			selected === undefined && selected_index.set(0);
		});

		window.addEventListener("popstate", () => {
			const previous_state = new URLSearchParams(window.location.search).get("state");
			if (previous_state) state.set(previous_state);
		});
	});
</script>

<h1>Bobbin</h1>
<h2>delicate circular symmetries</h2>

<noscript>
	<h4>Note: JavaScript is required to edit the shape</h4>
</noscript>

<div id="workspace">
	<div id="canvas" class="border">
		<svg
			bind:this={svg}
			viewBox={`-${size / 2},-${size / 2} ${size},${size}`}
			on:pointerdown={drag.start}
			on:pointermove={drag.update}
			on:pointerup={drag.stop}
			on:pointercancel={drag.stop}
		>
			<defs>
				<text>Generated with @mxdvl’s Rosace</text>
				<text>https://www.mxdvl.com/works/rosace{$page.url.search}</text>
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

	<Controls {patterns} {svg} />

	<ul id="shapes">
		<li><Polygon /></li>
		<li><Loop /></li>
		<li><Crescent /></li>
		<li><Curve /></li>
		<li><Star /></li>
	</ul>
</div>

{#if $page.url.host !== "www.mxdvl.com"}
	<h3>
		<a href={`https://www.mxdvl.com/works/rosace${$page.url.search}`}
			>Currently on a develop branch, see www.mxdvl.com version</a
		>
	</h3>
{/if}

<article>
	<h1>About <em>Bobbin</em></h1>

	<p>
		Weaving together technologies of the past and future, <em>Bobbin</em> invites us to explore the delicate
		intricacies of circular patterns. Mimicking the delicacy found in traditional crafts, <em>Bobbin</em> leverages Svelte
		to enable us all to become artists. Like modern day lace makers, we are invited to create our own designs and step
		back and admire the possibilities of the web as a design tool. This tool celebrates the advancements we have made
		on seeing speedy results, without compromising on elegance or beauty.
	</p>
	<p>
		All the editing features use the web platform’s native toolset, which made Svelte & SvelteKit an ideal
		environment for development:
	</p>
	<ul>
		<li>The design is encoded as state search parameter</li>
		<li>Undo and redo rely on the web history</li>
		<li>Patterns can be seen without without JavaScript with SSR</li>
		<li>The resulting SVG can be exported as-is and used as the basis for further work</li>
		<li>Animations are built with CSS and the Web Animation API</li>
	</ul>

	<p>
		<a href="https://en.wikipedia.org/wiki/Bobbin_lace#Bobbins">Bobbins</a> are used to hold the thread to create lace,
		which was the inspiration for this tool.
	</p>
</article>

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
