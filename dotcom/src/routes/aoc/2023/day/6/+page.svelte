<script>
	let input = `Time:      7  15   30
Distance:  9  40  200`;

	$: [times = [0], distances = [0]] = input.split("\n").map((line) => [...line.matchAll(/\d+/g)].map(Number));

	/**
	 * @param {number} time
	 * @param {number} record
	 * @returns {readonly [number, number]}
	 */
	const find_ways = (time, record) => {
		let hold = 1;
		while ((time - hold) * hold <= record) {
			hold++;
		}
		return /** @type {const} */ ([hold, time - hold]);
	};

	$: races = times
		.map((time, index) => ({ time, distance: distances[index] ?? -1 }))
		.map((race) => ({ ...race, ways: find_ways(race.time, race.distance) }));

	/** @type {(a: number, b: number) => number}*/
	const product = (a, b) => a * b;

	$: race = {
		time: Number(times.join("")),
		distance: Number(distances.join("")),
	};

	$: ways = find_ways(race.time, race.distance);
</script>

<textarea cols="40" rows="36" bind:value={input}></textarea>

<hr />

<h2>Part two</h2>

<p>
	{race.distance}mm in {race.time}ms &rarr; {ways[1] - ways[0] + 1} ways
</p>

<p>
	Hold at least for {ways[0]}ms, and at most for {ways[1]}ms.
</p>

<hr />

<h2>Part one</h2>

<p>Number of ways = {races.map(({ ways: [from, to] }) => 1 + to - from).reduce(product)}</p>

<ul>
	{#each races as { time, distance, ways }}
		<li>{distance}mm in {time}ms &rarr; {ways[1] - ways[0] + 1} ({ways.map((way) => `${way}ms`).join(", ")})</li>
	{/each}
</ul>
