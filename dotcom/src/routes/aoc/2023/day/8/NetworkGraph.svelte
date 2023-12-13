<script lang="ts">
	import { onMount } from "svelte";

	import { zoom, type D3ZoomEvent } from "d3-zoom";
	import { select, type Selection } from "d3-selection";
	import { drag, type D3DragEvent } from "d3-drag";
	import { forceSimulation, forceLink, forceManyBody, forceCenter, type Simulation } from "d3-force";
	import type { LinkDatum, NodeDatum } from "./types";

	export let graph: { nodes: NodeDatum[]; links: LinkDatum[] } = { links: [], nodes: [] };

	export let width = 600;
	export let height = 600;

	$: ({ links, nodes } = graph);

	$: starting_points = nodes.filter(({ id }) => id.endsWith("A"));

	const colours = { Z: "var(--red)", A: "var(--green)", node: "currentColor" };

	const center = (d: NodeDatum) => ({
		x: (d.group % 3) * ((2.5 * width) / starting_points.length) - width / 2,
		y: Math.floor(d.group / 3) * ((4 * height) / starting_points.length) - height / 2,
	});

	let simulation: Simulation<NodeDatum, LinkDatum>;

	let svg: Selection<SVGElement, unknown, HTMLElement, unknown>;

	$: {
		for (const link of links) {
			if (!nodes.some((d) => d.id === link.target))
				nodes.push(
					// @ts-expect-error -- it’s D3
					{ id: link.target, group: -1 },
				);
		}
		nodes = nodes;
	}
	onMount(() => {
		simulation = forceSimulation(nodes)
			.force(
				"link",
				forceLink<NodeDatum, LinkDatum>(links)
					.id((d) => d.id)
					.strength(0.8),
			)
			.force("charge", forceManyBody().distanceMax(120).distanceMin(10))
			.force("center", forceCenter(0, 0))
			.on("tick", simulationUpdate);

		simulation.force("radial");

		svg = select("svg");

		const g = svg.append("g"); // Need container when combining drag and zoom
		// See example: https://observablehq.com/@d3/drag-zoom

		const link = g
			.append("g")
			.attr("stroke", "currentColor")
			.attr("stroke-opacity", 0.1)
			.selectAll("line")
			.data(links)
			.join("line");

		const node = g
			.append("g")
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("r", (d) => (d.id.endsWith("A") ? 6 : d.id.endsWith("Z") ? 4 : 2))
			.attr("fill", (d) =>
				d.id.endsWith("Z")
					? colours.Z
					: d.id.endsWith("A")
					  ? colours.A
					  : d.group % 2 === 0
					    ? colours.node
					    : "var(--blue)",
			)
			.call(
				// @ts-expect-error -- it’s D3
				drag().on("start", dragstarted).on("drag", dragged).on("end", dragended),
			);

		node.append("title").text((d) => {
			const index = starting_points.findIndex((p) => p.id === d.id);
			return `${d.id} &rarr; ${center(d).x},${center(d).y}`;
		});

		svg.call(
			// @ts-expect-error -- it’s D3
			zoom()
				.extent([
					[-width * 2, -height * 2],
					[width * 3, height * 3],
				])
				.scaleExtent([1 / 10, 8])
				.on("zoom", zoomed),
		);

		function simulationUpdate() {
			link.attr(
				"x1",
				(d) =>
					// @ts-expect-error -- it’s D3
					d.source.x,
			)
				.attr(
					"y1",
					(d) =>
						// @ts-expect-error -- it’s D3
						d.source.y,
				)
				.attr(
					"x2",
					(d) =>
						// @ts-expect-error -- it’s D3
						d.target.x,
				)
				.attr(
					"y2",
					(d) =>
						// @ts-expect-error -- it’s D3
						d.target.y,
				);

			node.attr(
				"cx",
				// @ts-expect-error -- it’s D3
				(d) => d.x,
			).attr(
				"cy",
				// @ts-expect-error -- it’s D3
				(d) => d.y,
			);
		}

		function zoomed(event: D3ZoomEvent<SVGGeometryElement, NodeDatum>) {
			g.attr(
				"transform",
				// @ts-expect-error -- it’s D3
				event.transform,
			);
			simulationUpdate();
		}
	});

	function dragstarted(event: D3DragEvent<HTMLElement, unknown, NodeDatum>) {
		if (!event.active) simulation.alphaTarget(0.3).restart();
		event.subject.fx = event.x;
		event.subject.fy = event.y;
	}

	function dragged(event: D3DragEvent<HTMLElement, unknown, NodeDatum>) {
		event.subject.fx = event.x;
		event.subject.fy = event.y;
	}

	function dragended(event: D3DragEvent<HTMLElement, unknown, NodeDatum>) {
		if (!event.active) simulation.alphaTarget(0);
		event.subject.fx = null;
		event.subject.fy = null;
	}
</script>

<svg {width} {height} viewBox="{-width / 2} {-height / 2} {width} {height}"></svg>

<style>
	svg {
		border: 0.125rem solid var(--blue);
	}
</style>
