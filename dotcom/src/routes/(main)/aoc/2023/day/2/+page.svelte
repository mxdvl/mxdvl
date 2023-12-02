<script>
	let input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;

	const reds = {
		test: /(\d+) red/,
		max: 12,
	};
	const greens = {
		test: /(\d+) green/,
		max: 13,
	};
	const blues = {
		test: /(\d+) blue/,
		max: 14,
	};

	/** @type {(a: number, b: number) => number}*/
	const sum = (a, b) => a + b;

	$: games = input.split("\n").flatMap((game) => {
		const [, id, rest = ""] = game.match(/^Game (\d+): (.+)/) ?? [];
		if (!id) return [];

		const draws = rest?.split(";").map((play) => {
			const [, red = 0] = play.match(reds.test)?.map(Number) ?? [];
			const [, green = 0] = play.match(greens.test)?.map(Number) ?? [];
			const [, blue = 0] = play.match(blues.test)?.map(Number) ?? [];
			return { red, green, blue };
		});

		return { id: Number(id), rest, draws };
	});

	$: part_one = games.filter(({ draws }) =>
		draws.every(({ red, green, blue }) => red <= reds.max && green <= greens.max && blue <= blues.max),
	);

	/** @type {(pixel: {red: number, green: number, blue: number}) => number}*/
	const product = ({ red, green, blue }) => red * green * blue;

	$: part_two = games.map((game) => {
		return game.draws.reduce(
			(acc, next) => {
				return {
					red: Math.max(acc.red, next.red),
					green: Math.max(acc.green, next.green),
					blue: Math.max(acc.blue, next.blue),
				};
			},
			{ red: 0, green: 0, blue: 0 },
		);
	});
</script>

<textarea cols="80" rows="6" bind:value={input}></textarea>

<p>
	Part two: <code>{part_two.map(product).reduce(sum)}</code>
</p>

<ul>
	{#each part_two as { red, green, blue }}
		<li>
			{product({ red, green, blue })} = <span class="red">{red}</span> &times; <span class="green">{green}</span>
			&times; <span class="blue">{blue}</span>
		</li>
	{/each}
</ul>

<p>
	Part one: <code>{part_one.map(({ id }) => id).reduce(sum)}</code>
</p>

<ul>
	{#each part_one as { id, draws }}
		<li>
			{id}:
			{#each draws as { red, green, blue }, index}
				{#if index !== 0}
					{" "}-{" "}
				{/if}
				<span class="red">{red}</span>
				<span class="green">{green}</span>
				<span class="blue">{blue}</span>
			{/each}
		</li>
	{/each}
</ul>

<style>
	ul {
		font-family: monospace;
		list-style-type: none;
		padding: 0;
	}

	.red {
		color: red;
	}

	.green {
		color: green;
	}

	.blue {
		color: blue;
	}
</style>
