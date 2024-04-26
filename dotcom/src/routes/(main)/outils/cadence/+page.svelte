<script context="module">
	const one_mile_in_kilometres = 1.609344;

	/** @param {number} pace */
	export const toMiles = (pace) => pace * one_mile_in_kilometres;

	/** @param {number} pace */
	export const toKilometre = (pace) => pace / one_mile_in_kilometres;

	/** @param {number} pace */
	export const toMinuteSeconds = (pace) => {
		const minutes = String(Math.floor(pace / 60)).padStart(2, "0");
		const seconds = String(Math.floor(pace % 60)).padStart(2, "0");

		return `${minutes}:${seconds}`;
	};
</script>

<script>
	import Alternates from "$lib/Alternates.svelte";

	const initial = 4 * 60 + 21;
	const step = 1;
	const min = 3 * 60;
	const max = 9 * 60;

	let perKilometre = initial;
	let perMile = toMiles(initial);

</script>

<Alternates en="/tools/pace" fr="/outils/cadence" />

<input type="range" bind:value={perKilometre} {min} {max} {step} on:change={() => perMile = toMiles(perKilometre)} />

<p>Une cadence de <strong>{toMinuteSeconds(perKilometre)} min / km</strong>…</p>

<p>Équivaut <strong>{toMinuteSeconds(perMile)} min / mile</strong>!</p>

<input type="range" bind:value={perMile} {min} {max} {step} on:change={() => perKilometre = toKilometre(perMile)} />

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

	strong {
		font-variant-numeric: tabular-nums;
	}
</style>
