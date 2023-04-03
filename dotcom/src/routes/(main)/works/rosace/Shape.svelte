<script lang="ts">
	import type { Writable } from "svelte/store";
	import type { Pattern } from "./data";
	import Mirror from "./Mirror.svelte";
	import Path from "./Path.svelte";
	import Spread from "./Spread.svelte";
	import { selected } from "./store";

	export let pattern: Writable<Pattern>;

	export let guides = false;

	$: active = $selected === $pattern.id && guides;
</script>

<g id={$pattern.id}>
	{#if active}
		<circle r={120} stroke="var(--skies)" stroke-width={2} />
		<circle r={240} stroke="var(--skies)" stroke-width={2} />
	{/if}
	<Spread count={$pattern.count} let:angle>
		{#if active}
			<Path angle={angle - 90} d={`M0,0H600`} colour="var(--skies)" />
		{/if}

		<Mirror scales={$pattern.mirror ? [-1, 1] : [1]} let:scale>
			<Path position={$pattern.position} {angle} {scale} id={$pattern.id} d={$pattern.d} />
		</Mirror>
	</Spread>
</g>
