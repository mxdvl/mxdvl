<script lang="ts">
	import Polygon from "./Polygon.svelte";
	import Spread from "./Spread.svelte";

	const xmlns = "http://www.w3.org/2000/svg";

	const size = 20 * 18 * 2;

	let sides = 5;
</script>

<svg viewBox={`-${size / 2},-${size / 2} ${size},${size}`} width={size} height={size}>
	<Spread count={sides}>
		<path d="M24,0 h24 v3 h-12 Z" />
	</Spread>

	<Polygon radius={20} {sides} />
</svg>

<input type="range" bind:value={sides} min="3" max="12" step="1" />

{sides}

<style>
	svg {
		display: block;
	}

	path {
		stroke-width: 1;
		stroke: var(--ocean);
		fill: none;
	}
</style>
