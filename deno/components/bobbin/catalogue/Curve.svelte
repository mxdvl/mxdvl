<script>
	import Button from "../../Button.svelte";
	import SVG from "../SVG.svelte";
	import { add_pattern, bobbin } from "../store.svelte.js";

	let width = $state(90);
	let offset = $state(30);
	let start = $state(59);
	let end = $state(19);

	const d = $derived(
		[
			`M0,${offset}`,
			`C0,${offset + start}`,
			`${width},${end}`,
			`${width},0`,
		].join(" "),
	);

	const current = $derived(bobbin.patterns.get(bobbin.selected));
</script>

<SVG size={18 * 6 - 2}>
	<g transform="translate(3 3)">
		<g fill="var(--ocean)" stroke="none">
			<circle cy={offset + start} r={2} />
			<circle cx={width} cy={end} r={2} />
		</g>
		<g stroke="var(--ocean)">
			<line y1={offset} y2={offset + start} />
			<line x1={width} y1={0} x2={width} y2={end} />
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
	}}>{current ? "set to" : "add"} curve</Button
>

<label>
	Width
	<input type="range" bind:value={width} min={20} max={90} step={1} />
</label>
<label>
	Offset
	<input type="range" bind:value={offset} min={0} max={30} step={1} />
</label>
<label>
	Pull start
	<input type="range" bind:value={start} min={10} max={60} step={1} />
</label>
<label>
	Pull end
	<input type="range" bind:value={end} min={10} max={60} step={1} />
</label>
