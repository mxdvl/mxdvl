<script>
	let input = `Time:      7  15   30
Distance:  9  40  200`;

	$: [times = [0], distances = [0]] = input.split("\n").map((line) => [...line.matchAll(/\d+/g)].map(Number));
	$: races = times
		.map((time, index) => ({ time, distance: distances[index] ?? -1 }))
		.map((race) => ({
			...race,
			ways: Array.from({ length: race.time - 1 }, (_, i) => i + 1).filter(
				(seconds) => seconds * (race.time - seconds) > race.distance,
			),
		}));

	/** @type {(a: number, b: number) => number}*/
	const product = (a, b) => a * b;

	$: race = {
		time: Number(times.join("")),
		distance: Number(distances.join("")),
	};

	$: ways = Array.from({ length: race.time - 1 }, (_, i) => i + 1).filter(
		(seconds) => seconds * (race.time - seconds) > race.distance,
	);
</script>

<textarea cols="40" rows="36" bind:value={input}></textarea>

<hr />

<h2>Part two</h2>

<p>
	{race.distance}mm in {race.time}ms &rarr; {ways.length}
</p>

<ul>
	{#each ways.slice(0, 12) as way}
		<li>hold for {way}ms to beat to race</li>
	{/each}
</ul>

<hr />

<h2>Part one</h2>

<p>Number of ways = {races.map(({ ways }) => ways.length).reduce(product)}</p>

<ul>
	{#each races as { time, distance, ways }}
		<li>{distance}mm in {time}ms &rarr; {ways.length} ({ways.map((way) => `${way}ms`).join(", ")})</li>
	{/each}
</ul>

<style>
	ul.nested {
		padding-left: 2ch;
		margin-top: 0;
		margin-bottom: 1rem;
	}
</style>
