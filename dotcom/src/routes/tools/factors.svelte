<script lang="ts">
	const max = 100_000_000_003;

	let number = 12_000;

	const getFactors = (n: number): number[] => {
		const factors = [n];

		for (var i = 2; i <= Math.sqrt(n); i++) {
			if (number % i == 0) {
				factors.push(i);

				if (number / i != i) factors.push(number / i);
			}
		}

		return factors.sort((a, b) => a - b);
	};
</script>

<input type="number" min="1" {max} bind:value={number} />

<ul>
	{#each getFactors(number) as factor}
		<li>{factor}</li>
	{/each}
</ul>

<style>
	ul {
		display: flex;
		list-style-type: none;
		padding: var(--grid);
		margin: 0;
		gap: var(--grid);
		flex-wrap: wrap;
		justify-content: center;
	}

	li {
		background-color: var(--skies);
	}
</style>
