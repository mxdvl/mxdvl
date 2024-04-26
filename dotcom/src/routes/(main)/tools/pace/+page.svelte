<script>
	import Alternates from "$lib/Alternates.svelte";
	import { toKilometre, toMiles, toMinuteSeconds } from "../../outils/cadence/+page.svelte";

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

<input type="range" bind:value={perKilometre} {min} {max} {step} />

<p>A running pace of <strong>{toMinuteSeconds(perKilometre)} min / km…</strong></p>

<p>Is equivalent to <strong>{toMinuteSeconds(perMile)} min / mile</strong>!</p>

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

	strong {
		font-variant-numeric: tabular-nums;
	}
</style>
