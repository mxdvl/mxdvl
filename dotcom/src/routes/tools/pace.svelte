<script lang="ts">
	const initial = 4.25;
	const mile = 1.609344;
	const step = 5 / 60;
	const min = 2;
	const max = 24;

	let perKilometre = initial / 1;
	let perMile = initial / mile;

	const setPace = (newPace: number, units: "km" | "m") => {
		if (units === "km") perMile = newPace * mile;
		if (units === "m") perKilometre = newPace / mile;
	};

	const toMinuteSeconds = (pace: number) => {
		const minutes = String(Math.floor(pace)).padStart(2, "0");
		const seconds = String(Math.round(60 * (pace % 1))).padStart(2, "0");

		return `${minutes}:${seconds}`;
	};

	$: setPace(perKilometre, "km");
	$: setPace(perMile, "m");
</script>

<p>Running a</p>

<p>
	<input type="range" bind:value={perKilometre} {min} {max} {step} />
</p>

<p>
	{toMinuteSeconds(perKilometre)} min / km
</p>

<p>is the same as a</p>

<p>
	<input type="range" bind:value={perMile} {min} {max} {step} />
</p>

<p>
	{toMinuteSeconds(perMile)} min / mile
</p>
