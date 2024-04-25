<script context="module">
	const one_mile_in_kilometres = 1.609344;

	/** @param {number} pace */
	export const toMiles = (pace) => pace / one_mile_in_kilometres;

	/** @param {number} pace */
	export const toKilometre = (pace) => pace * one_mile_in_kilometres;

	/** @param {number} pace */
	export const toMinuteSeconds = (pace) => {
		const minutes = String(Math.floor(pace)).padStart(2, "0");
		const seconds = String(Math.floor(60 * (pace % 1))).padStart(2, "0");

		return `${minutes}:${seconds}`;
	};
</script>

<script>
	import Alternates from "$lib/Alternates.svelte";

	const initial = 4.333;
	const step = 5 / 60;
	const min = 3;
	const max = 12;

	let perKilometre = initial;
	let perMile = toMiles(initial);

	/**
	 * @param {number} newPace
	 * @param {"km" | "m"} units
	 */
	const setPace = (newPace, units) => {
		if (units === "m") perMile = toMiles(newPace);
		if (units === "km") perKilometre = toKilometre(newPace);
	};

	$: setPace(perKilometre, "km");
	$: setPace(perMile, "m");
</script>

<Alternates en="/tools/pace" fr="/outils/cadence" />

<input type="range" bind:value={perKilometre} {min} {max} {step} />

<p>Une cadence de {toMinuteSeconds(perKilometre)} min / km…</p>

<p>Équivaut {toMinuteSeconds(perMile)} min / mile!</p>

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
