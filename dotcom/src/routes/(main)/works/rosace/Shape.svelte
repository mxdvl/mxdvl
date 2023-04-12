<script lang="ts">
	import type { Writable } from "svelte/store";
	import type { Pattern } from "./data";
	import Mirror from "./Mirror.svelte";
	import Use from "./Use.svelte";
	import Path from "./Path.svelte";
	import Spread from "./Spread.svelte";
	import { animate, selected } from "./store";

	export let pattern: Writable<Pattern>;

	export let guides = false;

	$: active = $selected === $pattern.id && guides;
</script>

<g id={$pattern.id} style={`--end:${360 / $pattern.count}deg;`} class:animate={$animate}>
	<defs>
		<Path id={$pattern.id} d={$pattern.d} />
	</defs>
	<Spread count={$pattern.count} let:angle>
		{#if active}
			<Path {angle} d={`M0,0V-600`} colour="var(--skies)" />
		{/if}

		<Mirror scales={$pattern.mirror ? [-1, 1] : [1]} let:scale>
			<Use position={$pattern.position} {angle} {scale} id={$pattern.id} />
		</Mirror>
	</Spread>
</g>

<style>
	g {
		animation: rotate 3.6s linear infinite paused;
		transition: 120ms;
	}

	g.animate {
		animation-play-state: running;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(var(--end, 0deg));
		}
	}
</style>
