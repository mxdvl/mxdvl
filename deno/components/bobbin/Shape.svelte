<script>
	import Mirror from "./Mirror.svelte";
	import Use from "./Use.svelte";
	import Path from "./Path.svelte";
	import Spread from "./Spread.svelte";
	import { bobbin } from "./store.svelte.js";

	/** @typedef {import('./data').Pattern} Pattern */

	/** @type {{ pattern: Pattern, guides: boolean }} */
	let { pattern, guides = false } = $props();


	/** @type {SVGElement | undefined} */
	let g = $state();
	/** @type {Animation | undefined} */
	let animation = $state();

	const duration = 3600;
	const to = $derived(360 / pattern.count);

	/*
	onMount(() => {
		animate.subscribe(($animate) => {
			if (!g) return;
			if ($animate) {
				animation?.cancel();
				animation = g.animate(
					{
						transform: ["rotate(0deg)", `rotate(${to}deg)`],
					},
					{ duration, iterations: 1, easing: "cubic-bezier(0.1, 0, 0.5, 0.5)" },
				);
				animation.finished.then((a) => {
					a.effect?.updateTiming({ easing: "linear", iterations: Infinity });
				});
			} else if (animation) {
				const { progress = null } = animation.effect?.getComputedTiming() ?? {};
				if (progress === null) {
					return;
				}

				const from = to * progress;

				animation.cancel();
				animation = g.animate(
					{
						transform: [`rotate(${progress > 1 / 2 ? from - to : from}deg)`, `rotate(0deg)`],
					},
					{ duration: 240, fill: "forwards", easing: "ease", iterations: 1 },
				);
			}
		});
	});
*/

	const active = $derived(bobbin.selected === pattern.id && guides);
</script>

<g id={pattern.id} style={`--end:${360 / pattern.count}deg;`} bind:this={g}>
	<defs>
		<Path {...pattern} />
	</defs>
	<Spread count={pattern.count}>
		{#snippet snippet(angle)}
			{#if active}
				<Path {angle} d={`M0,0V-600`} colour="var(--skies)" />
			{/if}

		<Mirror scales={pattern.mirror ? [-1, 1] : [1]}>
			{#snippet snippet(scale)}
				<Use {...pattern} {angle} {scale} />
			{/snippet}
		</Mirror>
		{/snippet}
	</Spread>
</g>
