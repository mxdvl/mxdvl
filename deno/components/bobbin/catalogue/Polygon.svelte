<script>
	import Button from "../../Button.svelte";
	import SVG from "../SVG.svelte";
	import { add_pattern, get_current } from "../store.svelte.js";
	import { on_circle } from "../weaving.js";

	let radius = $state(12);
	let sides = $state(5);

	const [first, ...rest] = $derived(on_circle()(radius)(sides));
	const d = $derived(
		[
			"M",
			first?.join(","),
			"L",
			...rest.map(([x, y]) => `${x},${y} `),
			"Z",
		].join(""),
	);

	/** @param {number} n */
	const polygon = (n) => {
		switch (n) {
			case 3:
				return "triangle";
			case 4:
				return "square";
			case 5:
				return "pentagon";
			case 6:
				return "hexagon";
			case 7:
				return "heptagon";
			case 8:
				return "octagon";
			case 9:
				return "nonagon";
			case 10:
				return "decagon";
			case 12:
				return "dodecagon";

			default:
				return `${n}-gon`;
		}
	};
	const current = $derived(get_current());
</script>

<SVG centre>
	<g fill="var(--ocean)" stroke="none">
		<circle r={2} />
	</g>
	{#if first}
		<path {d} />
	{/if}
</SVG>

<Button
	on:click={() => {
		if (current) {
			current.d = d;
		} else {
			add_pattern(d);
		}
	}}>{current ? "set to" : "add"} {polygon(sides)}</Button
>

<label>
	Sides
	<input type="range" bind:value={sides} min={3} max={12} step={1} />
</label>
<label>
	Radius
	<input type="range" bind:value={radius} min={6} max={18} step={1} />
</label>
