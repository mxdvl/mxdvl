<script>
	import { toMinuteSeconds } from "../../routes/outils/cadence.svelte";

	/** @type {{ perKilometre: number, perMile: number }} */
	let { perKilometre, perMile } = $props();

	// Typical running distances
	const distances = [
		{ label: "1 km", km: 1, miles: 0.621371 },
		{ label: "2 km", km: 2, miles: 1.242742 },
		{ label: "3 km", km: 3, miles: 1.864114 },
		{ label: "4 km", km: 4, miles: 2.485485 },
		{ label: "5 km", km: 5, miles: 3.106856 },
		{ label: "10 km", km: 10, miles: 6.213712 },
		{ label: "Half", km: 21.0975, miles: 13.1094 },
		{ label: "Marathon", km: 42.195, miles: 26.2188 },
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
		{#each distances as { label, km, miles }}
			<tr>
				<td>{label}</td>
				<td>{calculateTime(km, perKilometre)}</td>
				<td>{calculateTime(miles, perMile)}</td>
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
