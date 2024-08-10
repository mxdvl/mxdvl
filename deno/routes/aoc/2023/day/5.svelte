<script>
	let input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

	$: [raw_seeds = "", ...rest] = input.split("\n\n");

	$: seeds = raw_seeds?.split(":")[1]?.trim().split(" ").map(Number) ?? [];

	/** @typedef {{readonly from: number, readonly to: number}} Range */
	/** @typedef {Range & {readonly difference: number}} Mapping */

	$: part_two_ranges = [...raw_seeds.matchAll(/(\d+) (\d+)/g)].map(([, from, to]) => ({
		from: Number(from),
		to: Number(from) + Number(to),
	}));

	/**
	 * @param {Range} a
	 * @param {Range} b
	 */
	const sort_ranges = (a, b) => a.from - b.from;

	$: maps = rest.map((map) => {
		const [name, ...ranges] = map.split("\n").filter(Boolean);

		// /** @type {Map<number, number>} */
		// const mapping = new Map();

		// console.log(name);

		const mappings = ranges
			.map((raw_range) => {
				const [to = 0, from = 0, range = 0] = raw_range.split(" ").map(Number);
				const difference = to - from;

				return { from, to: from + range - 1, difference };
			})
			.sort(sort_ranges);

		return { name, mappings };
	});

	/**
	 * @param {number[]} converted
	 * @param {typeof maps[number]} seed
	 */
	const reducer = (converted, { mappings }) => {
		const last_conversion = converted.at(-1);
		// console.log(converted, last_conversion);
		if (!last_conversion) throw "No conversion found";
		const { difference = 0 } =
			mappings.find(({ from, to }) => last_conversion >= from && last_conversion <= to) ?? {};

		return converted.concat(last_conversion + difference);
	};

	/**
	 * @param {Range} range
	 * @param {number} intersection
	 * @returns {[Range] | [Range, Range]}
	 */
	const split_range = (range, intersection) => {
		if (intersection < range.from || intersection > range.to) return [range];

		return [
			{ from: range.from, to: intersection },
			{ from: intersection + 1, to: range.to },
		];
	};

	/**
	 * @param {readonly Range[]} ranges
	 * @param {readonly Mapping[]} mappings
	 */
	const remap_ranges = (ranges, mappings) => {
		// const new_ranges = ranges.map((range) =>
		// 	split_range(
		// 		range,
		// 		mappings.flatMap(({ from, to }) => [from, to]),
		// 	).map((seed) => seed + (mappings.find(({ from, to }) => from <= seed && seed <= to)?.difference ?? 0)),
		// );
		// console.log({ old_ranges: ranges, mappings, new_ranges });
	};

	/**
	 * @param {readonly Range[]} ranges
	 * @param {typeof maps[number]} seed
	 */
	const faster_reducer = (ranges, { mappings }) =>
		ranges
			.flatMap((range) =>
				mappings
					.filter(({ from, to }) => from <= range.to && to >= range.from)
					.reduce(
						(ranges_accumulator, mapping) => {
							const last_range = ranges_accumulator.at(-1);
							if (!last_range) throw "No last range found";

							const slice = ranges_accumulator.slice(0, -1);

							// range fully inside mapping
							//    [ range ]
							//  { |       | }
							//    {       | }
							//    {       }
							if (last_range.from >= mapping.from && last_range.to <= mapping.to) {
								const next = [
									{
										from: last_range.from + mapping.difference,
										to: last_range.to + mapping.difference,
									},
								];
								console.info("range fully inside mapping", { last_range, mapping, next });
								return slice.concat(...next);
							}

							// range contains the mapping
							//    [ range ]
							//    | { }   |
							//    |   {  }|
							if (last_range.from < mapping.from && last_range.to > mapping.to) {
								const next = [
									{ from: last_range.from, to: mapping.from - 1 },
									{ from: mapping.from + mapping.difference, to: mapping.to + mapping.difference },
									{ from: mapping.to + 1, to: last_range.to },
								];
								console.info("range contains the mapping", { last_range, mapping, next });
								return slice.concat(...next);
							}

							// range lower half intersects with mappin
							//    [ range ]
							//    {   }   |
							//  { |   }   |
							if (last_range.to > mapping.to) {
								const next = [
									{ from: last_range.from + mapping.difference, to: mapping.to + mapping.difference },
									{ from: mapping.to + 1, to: last_range.to },
								];
								console.info("range lower half intersects with mapping", { last_range, mapping, next });
								return slice.concat(...next);
							}

							// range higher half intersect with mapping
							//    [ range ]
							//    |   {   }
							//    |   {   | }
							if (last_range.from < mapping.from) {
								const next = [
									{ from: last_range.from, to: mapping.from - 1 },
									{ from: mapping.from + mapping.difference, to: last_range.to + mapping.difference },
								];
								console.info("range higher half intersect with mapping", { last_range, mapping, next });
								return slice.concat(...next);
							}

							console.log({ ranges_accumulator, last_range, mapping });
							throw "There is an unhandled case";
						},
						[range],
					),
			)
			.slice()
			.sort(sort_ranges)
			.reduce((ranges, next_range, _, all_ranges) => {
				const last_range = ranges.at(-1);

				if (next_range.from === 0) console.log({ last_range, next_range, all_ranges });

				// we need to consolidate overlapping ranges
				if (last_range && last_range.to >= next_range.from - 1) {
					const next = { from: last_range.from, to: next_range.to };
					// console.log(last_range, next_range, next);
					return [...ranges.slice(0, -1), next];
				}

				return [...ranges, next_range];
			}, /** @type {readonly Range[]} */ ([]));

	let steps = 1;
	$: current_step = maps[steps - 1];

	$: part_two = maps.reduce(faster_reducer, part_two_ranges).slice().sort(sort_ranges);
</script>

<textarea cols="40" rows="36" bind:value={input}></textarea>

<hr />

<h2>Part two</h2>

<p>Part two: {part_two[0]?.from}</p>

<input type="range" bind:value={steps} min={0} max={maps.length} />

{remap_ranges(part_two_ranges, maps[0]?.mappings ?? [])}

<div>
	<p>{current_step?.name?.replace("map:", "ranges:")}</p>
	<ul>
		{#each maps.slice(0, steps).reduce(faster_reducer, part_two_ranges) as { from, to }}
			<li>
				{from}-{to}
			</li>
		{/each}
	</ul>

	<ul>
		<li>
			{current_step?.name}
			<ul class="nested">
				{#each current_step?.mappings ?? [] as { from, to, difference }}
					<li class:nil={from === -difference}>
						{from}-{to} &rarr; {difference}
					</li>
				{/each}
			</ul>
		</li>
	</ul>
</div>

<svg viewBox="0 0 100 {100 * steps}">
	{#each part_two_ranges.flatMap(({ from, to }) => [from, to]) as seed}
		{#each maps.slice(0, steps) as { mappings }, index}
			{@const difference = mappings.find(({ from, to }) => from <= seed && seed <= to)?.difference ?? 0}
			<g stroke="var(--red)">
				<line x1={seed} x2={seed + difference} y1={100 * index} y2={100 * (index + 1)} />
			</g>
		{/each}
	{/each}
</svg>

<hr />

<h2>Part one</h2>

<p>
	Part one: {Math.min(
		...seeds.map((seed) => maps.reduce(reducer, [seed])).map((conversions) => conversions.at(-1) ?? -1),
	)}
</p>

<!-- <p>Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.</p>
<p>Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.</p>
<p>Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.</p>
<p>Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.</p> -->

<ul>
	{#each seeds as seed}
		<li>
			{@html maps
				.reduce(reducer, [seed])
				.map((value, index) => `${maps[index - 1]?.name?.match(/-to-(.+) /)?.[1] ?? "seed"} ${value}`)
				.join(", ")}
		</li>
	{/each}
</ul>

<ul>
	{#each maps as { name, mappings }}
		<li>
			{name}
			<ul class="nested">
				{#each mappings as { from, to, difference }}
					<li>
						{from}-{to} &rarr; {difference}
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>

<style>
	ul.nested {
		padding-left: 2ch;
		margin-top: 0;
		margin-bottom: 1rem;
	}

	li.nil {
		color: var(--blue);
	}

	svg {
		width: 400px;
		fill: none;
		stroke-width: 0.5;
		stroke: var(--red);
		stroke-linecap: round;
	}
</style>
