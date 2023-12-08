<script>
	import { onMount } from "svelte";

	import { zoom, zoomIdentity } from "d3-zoom";
	import { select } from "d3-selection";
	import { drag } from "d3-drag";
	import { forceSimulation, forceLink, forceManyBody, forceCenter, forceRadial } from "d3-force";

	/** @typedef {import('./types.js').NodeDatum} NodeDatum */
	/** @typedef {import('./types.js').LinkDatum} LinkDatum */

	/** @type {{nodes: NodeDatum[], links: LinkDatum[]}} */
	export let graph = { links: [], nodes: [] };

	export let width = 600;
	export let height = 600;

	$: ({ links, nodes } = graph);

	const colours = { Z: "var(--red)", A: "var(--green)", node: "currentColor" };

	/** @type {import('d3-force').Simulation<NodeDatum, LinkDatum>} */
	let simulation;
	/** @type {import('d3-selection').Selection<SVGElement, unknown, HTMLElement, unknown>} */
	let svg;
	onMount(() => {
		simulation = forceSimulation(nodes)
			.force(
				"link",
				forceLink(links).id((d) => d.id),
			)
			// .force("pins", d3.forceCenter())
			.force("charge", forceManyBody().strength(-0.6))
			.force("center", forceRadial((d) => (d.group === "node" ? width / 3 : 100), 0, 0).strength(0.001))
			// .force("center", d3.forceCenter(width / 2, height / 2))
			.on("tick", simulationUpdate);

		svg = select("svg");

		const g = svg.append("g"); // Need container when combining drag and zoom
		// See example: https://observablehq.com/@d3/drag-zoom

		const link = g
			.append("g")
			.attr("stroke", "#999")
			.attr("stroke-opacity", 0.6)
			.selectAll("line")
			.data(links)
			.join("line");
		// .attr("stroke-width", (d) => Math.sqrt(d.value));

		const node = g
			.append("g")
			.attr("stroke", "#fff")
			.attr("stroke-width", 1.5)
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("r", (d) => (d.group === "node" ? 3 : 6))
			.attr("fill", (d) => colours[d.group])
			.call(drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

		node.append("title").text((d) => d.id);

		svg.call(
			zoom()
				.extent([
					[-width, -height],
					[width, height],
				])
				.scaleExtent([1 / 10, 8])
				.on("zoom", zoomed),
		);

		function simulationUpdate() {
			link.attr("x1", (d) => d.source.x)
				.attr("y1", (d) => d.source.y)
				.attr("x2", (d) => d.target.x)
				.attr("y2", (d) => d.target.y);

			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
		}

		function zoomed(event) {
			g.attr("transform", event.transform);
			simulationUpdate();
		}
	});

	/** @param {import('d3-drag').D3DragEvent<HTMLElement, unknown, NodeDatum>} event */
	function dragstarted(event) {
		if (!event.active) simulation.alphaTarget(0.3).restart();
		event.subject.fx = event.x;
		event.subject.fy = event.y;
	}

	/** @param {import('d3-drag').D3DragEvent<HTMLElement, unknown, NodeDatum>} event */
	function dragged(event) {
		event.subject.fx = event.x;
		event.subject.fy = event.y;
	}

	/** @param {import('d3-drag').D3DragEvent<HTMLElement, unknown, NodeDatum>} event */
	function dragended(event) {
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
