<script lang="ts">
	import type { Writable } from "svelte/store";
	import type { Pattern } from "./data";
	import Mirror from "./Mirror.svelte";
	import Use from "./Use.svelte";
	import Path from "./Path.svelte";
	import Spread from "./Spread.svelte";
	import { animate, selected } from "./store";
	import { onMount } from "svelte";

	export let pattern: Writable<Pattern>;

	export let guides = false;

	let g: SVGGElement | undefined;
	let animation: Animation | undefined;

	const duration = 3600;
	$: to = 360 / $pattern.count;

	onMount(() => {
		animate.subscribe(($animate) => {
			if (!g) return;
			if ($animate) {
				animation = g.animate(
					{
						rotate: ["0deg", `${to}deg`],
					},
					{ duration, fill: "both", iterations: Infinity },
				);
			} else if (animation) {
				const { currentTime } = animation;
				if (currentTime === null) {
					return;
				}

				const iteration_time = currentTime % duration;

				const from = (to * iteration_time) / duration;

				animation = g.animate(
					{
						rotate: [`${from > to / 2 ? from - to : from}deg`, `${0}deg`],
					},
					{ duration: 240, fill: "forwards", easing: "ease", iterations: 1 },
				);
			}
		});
	});

	$: active = $selected === $pattern.id && guides;
</script>

<g id={$pattern.id} style={`--end:${360 / $pattern.count}deg;`} bind:this={g}>
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
