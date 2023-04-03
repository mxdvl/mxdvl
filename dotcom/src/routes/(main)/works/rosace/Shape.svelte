<script lang="ts">
	import type { Writable } from "svelte/store";
	import type { Pattern } from "./data";
	import Mirror from "./Mirror.svelte";
	import Use from "./Use.svelte";
	import Path from "./Path.svelte";
	import Spread from "./Spread.svelte";
	import { selected } from "./store";

	export let pattern: Writable<Pattern>;

	export let guides = false;

	$: active = $selected === $pattern.id && guides;
</script>

<g id={$pattern.id}>
	<defs>
		<Path id={$pattern.id} d={$pattern.d} />
	</defs>
	<Spread count={$pattern.count} let:angle>
		{#if active}
			<Path angle={angle - 90} d={`M0,0H600`} colour="var(--skies)" />
		{/if}

		<Mirror scales={$pattern.mirror ? [-1, 1] : [1]} let:scale>
			<Use position={$pattern.position} {angle} {scale} id={$pattern.id} />
		</Mirror>
	</Spread>
</g>
