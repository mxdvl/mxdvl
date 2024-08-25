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
	import Alternates from "../../components/Alternates.svelte";
	import Layout from "../../components/Layout.svelte";

	const initial = 4 * 60 + 21;
	const step = 1;
	const min = 3 * 60;
	const max = 9 * 60;

	let perKilometre = initial;
	let perMile = toMiles(initial);

	/**
	 * @param {number} newPace
	 * @param {"km" | "m"} units
	 */
	const setPace = (newPace, units) => {
		if (units === "km") perMile = toMiles(newPace);
		if (units === "m") perKilometre = toKilometre(newPace);
	};

	$: setPace(perKilometre, "km");
	$: setPace(perMile, "m");
</script>

<Alternates en="/tools/pace" fr="/outils/cadence" />

<Layout lang="fr">
<input type="range" bind:value={perKilometre} {min} {max} {step} />

<p>Une cadence de <strong>{toMinuteSeconds(perKilometre)} min / km</strong>…</p>

<p>Équivaut <strong>{toMinuteSeconds(perMile)} min / mile</strong>!</p>

<input type="range" bind:value={perMile} {min} {max} {step} />
</Layout>

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
