<script lang="ts">
	const TAU = Math.PI * 2;

	let now = $state(Date.now());
	/** Minutes to shift every clock by */
	let delta = $state(0);

	$effect(() => {
		const interval = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(interval);
	});

	const cities = [
		["NOW", undefined],
		["MTL", "America/Toronto"],
		["LDN", "Europe/London"],
		["TYO", "Asia/Tokyo"],
	] as const;

	/** Hour and minute of the shifted time in `timeZone`, or locally */
	function clock(timeZone: string | undefined) {
		const parts = new Intl.DateTimeFormat("en-GB", {
			timeZone,
			hour: "numeric",
			minute: "numeric",
			hourCycle: "h23",
		}).formatToParts(now + delta * 60_000);
		const part = (type: "hour" | "minute") =>
			Number(parts.find((part) => part.type === type)?.value);
		return { hour: part("hour"), minute: part("minute") };
	}

	/** How hour points under the arc are drawn */
	const treatments = ["gap", "cut", "numerals", "hidden"] as const;
	type Treatment = (typeof treatments)[number];

	function toPolar(percentage: number, radius: number) {
		const radians = TAU * percentage;

		const x = Math.cos(radians) * radius;
		const y = Math.sin(radians) * radius;

		return { x, y } as const;
	}

	function numeral(hour: number) {
		switch (hour) {
			case 0:
				return "XII";
			case 3:
				return "III";
			case 6:
				return "VI";
			case 9:
				return "IX";
			default:
				return undefined;
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
	function span(hour: number, minute: number, start: number, end: number) {
		/** Minutes the minute hand is past the hour hand, clockwise */
		const past = mod(Math.round((end - start) * 60), 60);
		const crossings = hour + (past <= minute ? 1 : 0);
		const filling = crossings % 2 === 1;

		const length = filling ? past / 60 : 1 - past / 60;
		const direction = filling ? 1 : -1;

		return { length, direction } as const;
	}

	/** Length of the ring to leave clear around each numeral */
	function clearance(index: number) {
		switch (index) {
			case 0:
				return 12; // XII, the arc runs along it
			case 6:
				return 10; // VI, the arc runs along it
			case 3:
			case 9:
				return 9; // III and IX, the arc runs through their height
			default:
				return 0;
		}
	}

	/** Arc path, broken around the numerals when `clear` */
	function arc(
		hour: number,
		minute: number,
		start: number,
		end: number,
		clear = false,
	) {
		const { length, direction } = span(hour, minute, start, end);
		const flag = direction === 1 ? 1 : 0;

		/** Distances along the arc to leave clear, in order */
		const cuts = [0, 3, 6, 9]
			.filter((index) => clear && index !== hour % 12)
			.map((index) => {
				const distance = mod(direction * ((index - 3) / 12 - start), 1);
				const half = clearance(index) / 2 / (TAU * 48);
				return [distance - half, distance + half] as const;
			})
			.sort(([a], [b]) => a - b);

		const segments: [number, number][] = [];
		let from = 0;
		for (const [before, after] of cuts) {
			segments.push([from, Math.min(before, length)]);
			from = Math.max(from, after);
		}
		segments.push([from, length]);

		// split each segment in two halves so it never needs the large-arc flag and can draw a full circle
		return segments
			.filter(([from, to]) => to > from)
			.map(([from, to]) => {
				const [a, b, c] = [from, (from + to) / 2, to].map((distance) =>
					toPolar(start + direction * distance, 48),
				);
				return `M ${a.x},${a.y} A 48,48 0 0 ${flag} ${b.x},${b.y} A 48,48 0 0 ${flag} ${c.x},${c.y}`;
			})
			.join(" ");
	}

	/** Whether the arc runs over `position` and at least `beyond` past it, ends included */
	function covered(
		position: number,
		hour: number,
		minute: number,
		start: number,
		end: number,
		beyond = 0,
	) {
		const { length, direction } = span(hour, minute, start, end);
		return mod(direction * (position - start), 1) <= length - beyond + 1e-4;
	}

	/** Quarters the arc has run at least a minute past get a gap */
	function gapped(
		index: number,
		hour: number,
		minute: number,
		start: number,
		end: number,
	) {
		return (
			numeral(index) !== undefined &&
			index !== hour % 12 &&
			covered((index - 3) / 12, hour, minute, start, end, 1 / 60)
		);
	}
</script>

{#snippet point(
	index: number,
	hour: number,
	minute: number,
	start: number,
	end: number,
	treatment: Treatment,
)}
	{@const position = (index - 3) / 12}
	{@const { x, y } = toPolar(position, 48)}
	{@const under = covered(position, hour, minute, start, end)}
	{#if index === hour % 12}
		<!-- under the hour bar -->
	{:else if numeral(index) && (treatment === "numerals" || !under)}
		<text
			{x}
			{y}
			style:fill={under ? "var(--craie)" : "var(--brume)"}
			font-size="5"
			text-anchor="middle"
			dominant-baseline="central"
		>
			{numeral(index)}
		</text>
	{:else if !under}
		<circle cx={x} cy={y} r="1" style:fill="var(--brume)" />
	{/if}
{/snippet}

{#snippet mark(
	index: number,
	hour: number,
	minute: number,
	start: number,
	end: number,
	treatment: Treatment,
)}
	{@const position = (index - 3) / 12}
	{#if index === hour % 12 || !covered(position, hour, minute, start, end)}
		<!-- drawn by `point`, or under the hour bar -->
	{:else if treatment === "cut"}
		{@const { x, y } = toPolar(position, 48)}
		<circle cx={x} cy={y} r="0.75" style:fill="var(--encre)" />
	{/if}
{/snippet}

{#snippet tick(
	index: number,
	hour: number,
	minute: number,
	start: number,
	end: number,
	stroke: string,
	width: number,
)}
	{#if gapped(index, hour, minute, start, end)}
		{@const inner = toPolar((index - 3) / 12, 46)}
		{@const outer = toPolar((index - 3) / 12, 50)}
		<line
			x1={inner.x}
			y1={inner.y}
			x2={outer.x}
			y2={outer.y}
			style:stroke
			stroke-width={width}
		/>
	{/if}
{/snippet}

{#snippet boussole(
	name: string,
	hour: number,
	minute: number,
	treatment: Treatment,
)}
	{@const start = ((hour - 3) % 12) / 12}
	{@const end = ((minute - 15) % 60) / 60}
	<svg viewBox="-60 -60 120 120" width="240" height="240">
		<circle cx="0" cy="0" r="54" style:fill="var(--encre)" />
		<text
			style:fill="var(--brume)"
			font-size="5"
			text-anchor="middle"
			dominant-baseline="central">{name}</text
		>
		{#each { length: 12 }, index}
			{@render point(index, hour, minute, start, end, treatment)}
		{/each}
		<path
			style:stroke="var(--craie)"
			stroke-width="1.5"
			fill="none"
			d={arc(hour, minute, start, end, treatment === "numerals")}
		/>
		<line
			x1={toPolar(start, 44).x}
			y1={toPolar(start, 44).y}
			x2={toPolar(start, 52).x}
			y2={toPolar(start, 52).y}
			style:stroke="var(--craie)"
			stroke-width="1.5"
		/>
		{#each { length: 12 }, index}
			{@render mark(index, hour, minute, start, end, treatment)}
		{/each}
		{#if treatment === "gap"}
			{#each { length: 12 }, index}
				{@render tick(
					index,
					hour,
					minute,
					start,
					end,
					"var(--encre)",
					3,
				)}
				{@render tick(
					index,
					hour,
					minute,
					start,
					end,
					"var(--brume)",
					0.75,
				)}
			{/each}
		{/if}
	</svg>
{/snippet}

{#each treatments as treatment}
	<p>{treatment}</p>
	{#each cities as [name, timeZone]}
		{@const { hour, minute } = clock(timeZone)}
		{@render boussole(name, hour, minute, treatment)}
	{/each}
{/each}

<br />

<label>
	<input type="range" min="-300" max="300" step="1" bind:value={delta} />
	delta {delta > 0 ? "+" : ""}{delta} minutes
</label>

<style>
	svg {
		--encre: #111;
		--craie: white;
		--brume: #88a4ac;
	}

	text {
		font-weight: 600;
	}
</style>
