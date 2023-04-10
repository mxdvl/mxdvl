<script lang="ts">
	export let size = 36;
	export let centre = true;

	const origin = centre ? `${-size / 2},${-size / 2}` : "0,0";
</script>

<svg viewBox={`${origin} ${size},${size}`} width={size} height={size} stroke="black" stroke-width={1} fill="none">
	<slot />
</svg>
