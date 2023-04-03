<script lang="ts">
	import type { Point } from "./data";

	export let d: string;
	export let id: string | undefined = undefined;
	export let position: Point = { x: 0, y: 0 };
	export let angle = 0;
	export let scale = 1;

	export let colour: string | undefined = undefined;

	const transform = `scale(${scale} 1) rotate(${angle}) translate(${position.x} ${position.y})`;
</script>

<path id={`shape-${id}`} {transform} stroke={colour} {d} />
