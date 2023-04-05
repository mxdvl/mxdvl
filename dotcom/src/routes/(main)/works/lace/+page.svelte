<script lang="ts">
	import Loop from "./Loop.svelte";
	import Polygon from "./Polygon.svelte";
	import Spread from "./Spread.svelte";

	const xmlns = "http://www.w3.org/2000/svg";

	const size = 20 * 18 * 2;

	let sides = 5;
</script>

<svg viewBox={`-${size / 2},-${size / 2} ${size},${size}`} width={size} height={size}>
	<Spread count={sides}>
		<g transform="translate(20)">
			<Spread count={1}>
				<Loop length={30} count={3} />
			</Spread>
		</g>

		<g transform="translate(30,12)">
			<path d="M30,0 l30,6 v-12 Z" />
		</g>
	</Spread>

	<Polygon radius={20} {sides} />
</svg>

<input type="range" bind:value={sides} min="3" max="12" step="1" />

{sides}

<style>
	svg {
		display: block;
		stroke-width: 1;
		stroke: var(--ocean);
		fill: none;
	}
</style>
