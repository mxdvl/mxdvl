<script>
	import Alternates from "$lib/Alternates.svelte";
	import { toKilometre, toMiles, toMinuteSeconds } from "../../outils/cadence/+page.svelte";

	const initial = 4.3333;
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
