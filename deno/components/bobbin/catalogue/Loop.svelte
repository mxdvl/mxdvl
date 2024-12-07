<script>
	import Button from "../../Button.svelte";
	import SVG from "../SVG.svelte";
	import { add_pattern, get_current } from "../store.svelte.js";
	import { loop } from "../weaving.js";

	let count = $state(2);
	let bulge = $state(3 / 2);
	let length = $state(16);

	const d = $derived(["M0,0", ...loop(count, bulge, length), "Z"].join(""));
	const name = $derived(bulge === 2 ? "circle" : "loop");
	const current = $derived(get_current());
</script>

<SVG centre>
	<g transform="translate(-18,0)">
		<g fill="var(--ocean)" stroke="none">
			<circle r={2} />
		</g>
		<path {d} />
	</g>
</SVG>

<Button
	on:click={() => {
		if (current) {
			current.d = d;
		} else {
			add_pattern(d);
		}
	}}
	>{current ? "set to" : "add"}
	{count > 1 ? `${count} ${name}s` : name}</Button
>

<label>
	Count
	<input type="range" bind:value={count} min={1} max={6} step={1} />
</label>
<label>
	Length
	<input type="range" bind:value={length} min={6} max={18} step={1} />
</label>
<label>
	Bulge
	<input type="range" bind:value={bulge} min={0.75} max={2} step={0.0625} />
</label>
