<script lang="ts">
	import Button from "./Button.svelte";

	const percentiles = [
		0, 12_800, 13_200, 13_500, 13_800, 14_100, 14_500, 14_800, 15_100,
		15_400, 15_700, 16_000, 16_300, 16_600, 17_000, 17_300, 17_600, 18_000,
		18_300, 18_700, 19_000, 19_400, 19_700, 20_000, 20_400, 20_800, 21_100,
		21_500, 21_800, 22_100, 22_500, 22_800, 23_100, 23_500, 23_800, 24_100,
		24_400, 24_800, 25_100, 25_500, 25_800, 26_200, 26_500, 26_900, 27_300,
		27_700, 28_100, 28_500, 28_900, 29_300, 29_700, 30_100, 30_600, 31_000,
		31_500, 31_900, 32_400, 32_900, 33_400, 34_000, 34_500, 35_000, 35_600,
		36_200, 36_800, 37_400, 38_000, 38_700, 39_400, 40_100, 40_800, 41_600,
		42_400, 43_200, 44_100, 45_000, 45_900, 46_900, 47_900, 48_900, 49_900,
		50_600, 51_800, 53_100, 54_400, 56_000, 57_700, 59_700, 61_800, 64_400,
		67_400, 70_800, 74_800, 79_700, 85_800, 93_600, 102_000, 118_000,
		145_000, 207_000,
	] as const satisfies readonly number[];

	let salary = $state(42_000);

	let percentile = $derived.by(() => {
		const validSalary = Number.isFinite(salary) ? salary : 0;
		const percentile = percentiles.findIndex((income) => income >= validSalary);
		return percentile !== -1 ? percentile : 99;
	});
</script>

<p>
	<label>
		How much do you earn before taxes in GBP? £<input
			type="number"
			min={0}
			max={500_000}
			step={5_000}
			bind:value={salary}
		/>
	</label>
</p>

<p>
	Jump to
	the <Button on:click={() => (salary = percentiles[10])}>lower decile</Button>,
	the <Button on:click={() => (salary = percentiles[25])}>lower quartile</Button>,
	the <Button on:click={() => (salary = percentiles[50])}>median</Button>,
	the <Button on:click={() => (salary = percentiles[75])}>upper quartile</Button>,
	the <Button on:click={() => (salary = percentiles[90])}>upper decile</Button>,
	the <Button on:click={() => (salary = percentiles[99] + 1000)}>top 1%</Button>.
</p>

<p>
	With this income, you earn more than {percentile}% of the
	<a
		href="https://www.gov.uk/government/statistics/percentile-points-from-1-to-99-for-total-income-before-and-after-tax"
		>UK population as of 2024</a
	>.
</p>
