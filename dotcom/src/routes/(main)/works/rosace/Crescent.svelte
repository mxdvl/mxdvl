<script lang="ts">
	import Button from "../../../../lib/Button.svelte";
	import SVG from "./SVG.svelte";
	import { add_pattern, current } from "./store";

	let radius = 6;

	const get_name = (radius: number) => {
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

	$: d = ["M0,18", "A18,18 0 0 1 0,-18", `A${Math.abs(radius)},18 0 0 ${radius > 0 ? "0" : "1"} 0,18`, "Z"].join("");
	$: name = get_name(radius);
</script>

<SVG centre>
	<g fill="var(--ocean)" stroke="none">
		<circle r={2} />
	</g>
	<path {d} />
</SVG>

<input type="range" bind:value={radius} min={-18} max={18} step={1} />

<Button
	on:click={() => {
		if ($current) {
			$current.update((c) => ({ ...c, d }));
		} else {
			add_pattern(d);
		}
	}}>{$current ? "set to" : "add"} {name}</Button
>
