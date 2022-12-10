<script lang="ts">
	const initial = 4.25;
	const mile = 1.609344;
	const step = 5 / 60;
	const min = 3;
	const max = 12;

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

<input type="range" bind:value={perKilometre} {min} {max} {step} />

<p>A running pace of {toMinuteSeconds(perKilometre)} min / km…</p>

<p>Is equivalent to {toMinuteSeconds(perMile)} min / mile!</p>

<input type="range" bind:value={perMile} {min} {max} {step} />

<style>
	p {
		text-align: center;
	}
	input {
		width: 100%;
		accent-color: var(--ocean);
	}

	input:hover {
		accent-color: var(--glint);
	}
</style>
