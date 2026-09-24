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

	function numeral(hour: number) {
		switch (hour) {
			case 0: return "XII";
			case 3: return "III";
			case 6: return "VI";
			case 9: return "IX";
			default: return undefined;
		}
	}

	/** Always-positive modulo */
	function mod(value: number, divisor: number) {
		return ((value % divisor) + divisor) % divisor;
	}

	/**
	 * Arc from the hour (`start`) to the minute (`end`),
	 * filling clockwise until the minute reaches the hour,
	 * then draining anti-clockwise for the following hour.
	 */
	function span(hour: number, start: number, end: number) {
		/** Minutes the minute hand is past the hour hand, clockwise */
		const past = mod(Math.round((end - start) * 60), 60);
		const crossings = hour + (past <= minutes ? 1 : 0);
		const filling = crossings % 2 === 1;

		const length = filling ? past / 60 : 1 - past / 60;
		const direction = filling ? 1 : -1;

		return { length, direction } as const;
	}

	function arc(hour: number, start: number, end: number) {
		const { length, direction } = span(hour, start, end);
		const middle = toPolar(start + (direction * length) / 2, 48);
		const finish = toPolar(start + direction * length, 48);
		const flag = direction === 1 ? 1 : 0;

		// split in two halves so it never needs the large-arc flag and can draw a full circle
		return [
			`A 48,48 0 0 ${flag} ${middle.x},${middle.y}`,
			`A 48,48 0 0 ${flag} ${finish.x},${finish.y}`,
		].join(" ");
	}

	/** Whether the arc runs over `position`, ends included */
	function covered(position: number, hour: number, start: number, end: number) {
		const { length, direction } = span(hour, start, end);
		return mod(direction * (position - start), 1) <= length + 1e-4;
	}
</script>

{#snippet point(index: number, hour: number, start: number, end: number)}
	{@const position = (index - 3) / 12}
	{@const { x, y } = toPolar(position, 48)}
	{#if index === hour % 12 || covered(position, hour, start, end)}
		<!-- hidden under the arc or the hour bar -->
	{:else if numeral(index)}
		<text {x} {y} fill="#88A4AC" font-size="6" text-anchor="middle" dominant-baseline="central">
			{numeral(index)}
		</text>
	{:else}
		<circle cx={x} cy={y} r="1" fill="#88A4AC" />
	{/if}
{/snippet}

{#snippet boussole(hour: number)}
	{@const start = ((hour - 3) % 12) / 12}
	{@const end = ((minutes - 15) % 60) / 60}
	<svg viewBox="-60 -60 120 120" width="240" height="240">
		<circle cx="0" cy="0" r="54" fill="#111" />
		{#each { length: 12 }, index}
			{@render point(index, hour, start, end)}
		{/each}
		<path
			stroke="white"
			stroke-width="1.5"
			fill="none"
			d={[
				`M ${toPolar(start, 48).x},${toPolar(start, 48).y}`,
				arc(hour, start, end),
			].join(" ")}
		/>
		<line
			x1={toPolar(start, 44).x}
			y1={toPolar(start, 44).y}
			x2={toPolar(start, 52).x}
			y2={toPolar(start, 52).y}
			stroke="white"
			stroke-width="1.5"
		/>
	</svg>
{/snippet}

{@render boussole(hours)}
{@render boussole(hours + 3)}
{@render boussole(hours + 6)}
{@render boussole(hours + 9)}

<br/>

<label>
	<input type="range" min="0" max="23" step="1" bind:value={hours} />
	hours {hours}
</label>
<label>
	<input type="range" min="0" max="59" step="1" bind:value={minutes} />
	minutes {minutes}
</label>

<style>
	text {
		font-weight: 600;
	}
</style>
