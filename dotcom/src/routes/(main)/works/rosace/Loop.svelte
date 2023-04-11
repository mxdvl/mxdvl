<script lang="ts">
	import Button from "../../../../lib/Button.svelte";
	import SVG from "./SVG.svelte";
	import { add_pattern, current } from "./store";
	import { loop } from "./weaving";

	let count = 2;
	let bulge = 3 / 2;
	let length = 16;

	$: d = ["M0,0", ...loop(count, bulge, length), "Z"].join("");
	$: name = bulge === 2 ? "circle" : "loop";
</script>

<SVG centre>
	<g transform="translate(-18,0)">
		<g fill="var(--ocean)" stroke="none">
			<circle r={2} />
		</g>
		<path {d} />
	</g>
</SVG>

<input type="range" bind:value={count} min={1} max={6} step={1} />
<input type="range" bind:value={length} min={6} max={18} step={1} />
<input type="range" bind:value={bulge} min={0.75} max={2} step={0.0625} />

<Button
	on:click={() => {
		if ($current) {
			$current.update((c) => ({ ...c, d }));
		} else {
			add_pattern(d);
		}
	}}>{$current ? "set to" : "add"} {count > 1 ? `${count} ${name}s` : name}</Button
>
