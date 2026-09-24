<script lang="ts">
	const TAU = Math.PI * 2;

	const now: Omit<Date, `set${string}`> = new Date();
	let hours = $state(now.getHours());
	let minutes = $state(now.getMinutes());

	function toPolar(percentage: number, radius: number) {
		const radians = TAU * percentage;

		const x = Math.cos(radians) * radius;
		const y = Math.sin(radians) * radius;

		return { x, y } as const;
	}

	/** Fraction of a full turn travelled going anti-clockwise from `start` to `end` */
	function sweep(start: number, end: number) {
		return (((start - end) % 1) + 1) % 1;
	}
</script>

{#snippet boussole(start: number, end: number)}
	<svg viewBox="-60 -60 120 120" width="240" height="240">
		<circle cx="0" cy="0" r="54" fill="#111" />
		<line x></line>
		<path
			stroke="white"
			fill="none"
			d={[
				`M ${toPolar(start, 42).x},${toPolar(start, 42).y}`,
				`L ${toPolar(start, 48).x},${toPolar(start, 48).y}`,
				`A 48,48 0 ${sweep(start, end) > 0.5 ? 1 : 0} 0 ${toPolar(end, 48).x} ${toPolar(end, 48).y}`,
				`L${toPolar(end, 52).x},${toPolar(end, 52).y}`,
			].join(" ")}
		/>
	</svg>
{/snippet}

{@render boussole(((hours - 3) % 12) / 12, ((minutes - 15) % 60) / 60)}
{@render boussole(((hours - 0) % 12) / 12, ((minutes - 15) % 60) / 60)}
{@render boussole(((hours + 3) % 12) / 12, ((minutes - 15) % 60) / 60)}
{@render boussole(((hours + 6) % 12) / 12, ((minutes - 15) % 60) / 60)}

<br/>

<label>
	<input type="range" min="0" max="24" step="1" bind:value={hours} />
	hours {hours}
</label>
<label>
	<input type="range" min="0" max="60" step="1" bind:value={minutes} />
	minutes {minutes}
</label>
