<script>
	let input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

	$: lines = input.split("\n").flatMap((line) => {
		const matches = [...line.matchAll(/-?\d+/g)].map(Number);
		return matches.length > 0 ? [matches] : [];
	});

	$: derivatives = lines.map((line) => {
		const derivatives = [line];
		let last_derivative = line;
		let count = 0;
		while (count++ < 100 && !last_derivative.every((d) => d === 0)) {
			last_derivative = last_derivative.slice(1).reduce((deltas, _, index) => {
				const [a, b] = last_derivative.slice(index);
				if (a === undefined || b === undefined) return deltas;
				deltas.push(b - a);
				return deltas;
			}, /** @type {number[]} */ ([]));
			derivatives.push(last_derivative);
		}
		return /** @type {readonly number[][]} */ (derivatives);
	});

	$: part_one = derivatives.map((derivatives) => {
		const final = derivatives.reduceRight((final, next) => {
			return final + (next.at(-1) ?? 0);
		}, 0);
		console.log(final);

		return { derivatives, final };
	});

	/** @type {(a: number, b: number) => number}*/
	const sum = (a, b) => a + b;

	$: part_two = derivatives.map((derivatives) => {
		const final = derivatives.reduceRight((final, next) => {
			return (next.at(0) ?? 0) - final;
		}, 0);

		return { derivatives, final };
	});

	$: predictions = derivatives.map((derivatives) => {
		const with_predictions = derivatives
			.slice()
			.reverse()
			.map((derivative, index, stack) => {
				const higher = stack[index - 1];
				const past = (higher?.at(0) ?? 0) + (derivative.at(0) ?? 0);
				const future = (higher?.at(-1) ?? 0) + (derivative.at(-1) ?? 0);
				console.log({ past, higher, derivative, future });

				return [past, ...derivative, future];
			})
			.reverse();

		return with_predictions;
	});
</script>

<textarea rows="12" bind:value={input}></textarea>

<hr />

<h2>Both parts</h2>

<div class="graphs">
	{#each predictions as derivatives}
		{@const width = (derivatives[0]?.length ?? 1) * 2 - 1}
		{@const height = derivatives.length * 30}
		<ul class="graph" style="--cols:{width};--rows:{height};">
			{#each derivatives as line, y}
				{#each line as number, x}
					<li
						class:first={x === 0}
						class:last={x === line.length - 1}
						class:top={y === 0}
						style="grid-column-start:{Math.ceil(1 + x * 2 + y)};grid-row-start:{y + 1}"
					>
						{number}
					</li>
				{/each}
			{/each}
		</ul>
	{/each}
</div>

<hr />

<h2>Part two: {part_two.map(({ final }) => final).reduce(sum)}</h2>

<hr />

<h2>Part one: {part_one.map(({ final }) => final).reduce(sum)}</h2>

<style>
	.graphs {
		display: flex;
		flex-direction: column;
	}

	.graph {
		display: grid;
		list-style-type: none;
		grid-template-columns: repeat(var(--cols), min-content);
	}

	.first {
		color: var(--blue);
	}

	.last {
		color: var(--red);
	}

	.top:is(.first, .last) {
		font-weight: bold;
	}
</style>
