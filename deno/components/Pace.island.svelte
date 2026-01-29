<script lang="ts">
	import type { Lang } from "./lang.js";

	type Props = {
		lang: Lang
	}

	let { lang = "en" }: Props = $props();

	const one_mile_in_kilometres = 1.609344;

	function format(pace: number) {
		const hours = Math.floor(pace / 3600);
		const minutes = Math.floor((pace / 60) % 60);
		const seconds = Math.floor(pace % 60);

		return (hours === 0 ? [minutes, seconds] : [hours, minutes, seconds])
			.flatMap(value => value >= 0 ? [String(value).padStart(2, "0")] : [])
			.join(":");
	};

	const initial = 4 * 60 + 21;
	const min = 160;
	const max = 540;
	const step = 1;

	let perKilometre = $state(initial);
	let perMile = $derived(perKilometre * one_mile_in_kilometres);
</script>


<article>
	{#if lang === "en"}
		<p>a running pace of <strong>{format(perKilometre)} min / km</strong></p>

		<input type="range" bind:value={perKilometre} {min} {max} {step} />

		<p>is equivalent to <strong>{format(perMile)} min / mile</strong></p>
	{:else if lang === "fr"}
		<p>une cadence de <strong>{format(perKilometre)} min / km</strong></p>

		<input type="range" bind:value={perKilometre} {min} {max} {step} />

		<p>équivaut <strong>{format(perMile)} min / mile</strong></p>
	{:else}
		<p>…</p>
	{/if}

	<table>
		<thead>
			<tr>
				<th></th>
				<th>km</th>
				<th>miles</th>
			</tr>
		</thead>
		<tbody>
			{#each [1,2,3,4,5,8,10,15,20] as distance}
			<tr>
				<td>{distance}</td>
				<td>{format(distance * perKilometre)}</td>
				<td>{format(distance * perMile)}</td>
			</tr>
			{/each}
			<tr>
				<td>Half</td>
				<td colspan="2">{format(21.0975 * perKilometre)}</td>
			</tr>
			<tr>
				<td>Marathon</td>
				<td colspan="2">{format(42.195 * perKilometre)}</td>
			</tr>
			{#each [50,80,100] as distance}
			<tr>
				<td>{distance}</td>
				<td>{format(distance * perKilometre)}</td>
				<td>{format(distance * perMile)}</td>
			</tr>
			{/each}
		</tbody>
	</table>
</article>

<style>
	p {
		text-align: center;
	}

	strong {
		font-variant-numeric: tabular-nums;
	}

	input {
		width: 100%;
		accent-color: var(--ocean);
	}

	input:hover {
		accent-color: var(--glint);
	}

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
