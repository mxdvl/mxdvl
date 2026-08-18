<script lang="ts">
	const TAU = Math.PI * 2;

	const now: Omit<Date, `set${string}`> = new Date();
	let hours = $state(now.getHours());
	let minutes = $state(now.getMinutes());

	const start = $derived((hours % 12) / 12);
	const end = $derived((minutes % 60) / 60);

	function toPolar(percentage: number, radius: number) {
		const radians = TAU * percentage;

		const x = Math.cos(radians) * radius;
		const y = Math.sin(radians) * radius;

		return { x, y } as const;
	}
</script>

<svg viewBox="-60 -60 120 120" width="240" height="240">
	<circle cx="0" cy="0" r="54" fill="#111" />
	<path
		stroke="white"
		fill="none"
		d={[
			`M ${toPolar(start, 42).x},${toPolar(start, 42).y}`,
			`L ${toPolar(start, 48).x},${toPolar(start, 48).y}`,
			`A 48,48 0 ${start < end ? 1 : 0} 0 ${toPolar(end, 48).x} ${toPolar(end, 48).y}`,
			`L${toPolar(end, 52).x},${toPolar(end, 52).y}`,
		].join(" ")}
	/>
</svg>

<label>
	<input type="range" min="0" max="24" step="1" bind:value={hours} />
	hours {hours}
</label>
<label>
	<input type="range" min="0" max="60" step="1" bind:value={minutes} />
	minutes {minutes}
</label>
