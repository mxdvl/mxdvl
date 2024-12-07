<script>
	import Button from "../../Button.svelte";
	import SVG from "../SVG.svelte";
	import { add_pattern, get_current } from "../store.svelte.js";

	let radius = $state(6);

	/** @param {number} radius */
	const get_name = (radius) => {
		switch (radius) {
			case -18:
				return "circle";
			case 0:
				return "semicircle";
			case 18:
				return "arc";

			default:
				return "crescent";
		}
	};

	const d = $derived(
		[
			"M0,18",
			"A18,18 0 0 1 0,-18",
			`A${Math.abs(radius)},18 0 0 ${radius > 0 ? "0" : "1"} 0,18`,
			"Z",
		].join(""),
	);
	const name = $derived(get_name(radius));

	const current = $derived(get_current());
</script>

<SVG centre>
	<g fill="var(--ocean)" stroke="none">
		<circle r={2} />
	</g>
	<path {d} />
</SVG>

<Button
	on:click={() => {
		if (current) {
			current.d = d;
		} else {
			add_pattern(d);
		}
	}}>{current ? "set to" : "add"} {name}</Button
>

<label>
	Angle
	<input type="range" bind:value={radius} min={-18} max={18} step={1} />
</label>
