<script>
	import { toMinuteSeconds } from "../../routes/outils/cadence.svelte";

	/** @type {number} */
	export let perKilometre;

	/** @type {number} */
	export let perMile;

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
		<tr>
			<td>1</td>
			<td>{calculateTime(1, perKilometre)}</td>
			<td>{calculateTime(1, perMile)}</td>
		</tr>
		<tr>
			<td>2</td>
			<td>{calculateTime(2, perKilometre)}</td>
			<td>{calculateTime(2, perMile)}</td>
		</tr>
		<tr>
			<td>3</td>
			<td>{calculateTime(3, perKilometre)}</td>
			<td>{calculateTime(3, perMile)}</td>
		</tr>
		<tr>
			<td>4</td>
			<td>{calculateTime(4, perKilometre)}</td>
			<td>{calculateTime(4, perMile)}</td>
		</tr>
		<tr>
			<td>5</td>
			<td>{calculateTime(5, perKilometre)}</td>
			<td>{calculateTime(5, perMile)}</td>
		</tr>
		<tr>
			<td>10</td>
			<td>{calculateTime(10, perKilometre)}</td>
			<td>{calculateTime(10, perMile)}</td>
		</tr>
		<tr>
			<td>Half</td>
			<td colspan="2">{calculateTime(21.0975, perKilometre)}</td>
		</tr>
		<tr>
			<td>Marathon</td>
			<td colspan="2">{calculateTime(42.195, perKilometre)}</td>
		</tr>
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
