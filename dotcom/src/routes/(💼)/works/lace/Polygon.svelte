<script lang="ts">
	import { on_circle } from "./weaving";

	export let radius: number;
	export let sides: number;

	$: [first, ...rest] = on_circle()(radius)(sides);
</script>

{#if first}
	<path d={["M", first.join(","), "L", ...rest.map(([x, y]) => `${x},${y} `), "Z"].join("")} />
{/if}
