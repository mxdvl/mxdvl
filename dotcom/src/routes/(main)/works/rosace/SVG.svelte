<script lang="ts">
	export let size = 36;
	export let centre = true;

	const origin = centre ? `${-size / 2},${-size / 2}` : "0,0";
</script>

<svg
	viewBox={`${origin} ${size},${size}`}
	width={size}
	height={size}
	stroke="var(--earth)"
	stroke-width={1}
	fill="none"
>
	<rect x={-size} y={-size} width={size * 2} height={size * 2} fill="var(--clouds)" />
	<slot />
</svg>

<style>
	svg {
		border: 2px solid var(--skies);
	}
</style>
