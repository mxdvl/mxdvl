<script>
	import { toMinuteSeconds } from "../../routes/outils/cadence.svelte";

	/** @type {number} */
	export let perKilometre;

	/** @type {number} */
	export let perMile;

	const one_mile_in_kilometres = 1.609344;

	// Typical running distances
	const distances = [
		{ label: "1 km", km: 1 },
		{ label: "2 km", km: 2 },
		{ label: "3 km", km: 3 },
		{ label: "4 km", km: 4 },
		{ label: "5 km", km: 5 },
		{ label: "10 km", km: 10 },
		{ label: "Half Marathon", km: 21.0975 },
		{ label: "Marathon", km: 42.195 },
	];

	/**
	 * Calculate time for a given distance
	 * @param {number} distance - Distance in the unit
	 * @param {number} pace - Pace in seconds per unit
	 */
	const calculateTime = (distance, pace) => {
		const totalSeconds = distance * pace;
		return toMinuteSeconds(totalSeconds);
	};
</script>

<table>
	<thead>
		<tr>
			<th></th>
			<th>km</th>
			<th>miles</th>
		</tr>
	</thead>
	<tbody>
		{#each distances as { label, km }}
			<tr>
				<td>{label}</td>
				<td>{calculateTime(km, perKilometre)}</td>
				<td>{calculateTime(km / one_mile_in_kilometres, perMile)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		margin: 2rem 0;
		font-variant-numeric: tabular-nums;
	}

	th,
	td {
		padding: 0.5rem;
		text-align: left;
		border-bottom: 1px solid var(--ocean, #ccc);
	}

	th {
		font-weight: bold;
		text-align: center;
	}

	td:first-child {
		font-weight: 500;
	}

	td:not(:first-child) {
		text-align: center;
	}

	tbody tr:hover {
		background-color: var(--ocean-alpha-10, rgba(0, 100, 200, 0.05));
	}
</style>
