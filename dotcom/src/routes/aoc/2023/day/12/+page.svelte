<script>
	let input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

	/** @type {(a: number, b: number) => number}*/
	const sum = (a, b) => a + b;

	/**
	 * @param {string} springs
	 */
	const get_groupings = (springs) => springs.split(".").filter(Boolean);

	/**
	 * @param {readonly number[]} expected
	 * @param {readonly string[]} found
	 */
	const hash = (expected, found) => `${found.join(".")} ${expected.join(",")}`;

	/** @type {Map<string, number>} */
	const map = new Map();

	/**
	 * @param {readonly number[]} expected
	 * @param {readonly string[]} found
	 * @returns {number}
	 */
	const possible_combinations = (expected, found) => {
		const [needed] = expected;
		if (needed === undefined) {
			return found.filter((f) => f.includes("#")).length === 0 ? 1 : 0;
		}

		const id = hash(expected, found);
		const memo = map.get(id);
		if (memo !== undefined) return memo;

		const [first, ...rest] = found;
		if (first === undefined) {
			map.set(id, 0);
			return 0;
		}

		if ((first.split("?").at(0)?.length ?? -1) > needed) {
			map.set(id, 0);
			return 0;
		}

		if (first.includes("?")) {
			if (first.length === needed && first.includes("#")) {
				const result = possible_combinations(expected.slice(1), rest);
				map.set(id, result);
				return result;
			}

			const trim = first.replace("?", ".").split(".");
			const result =
				possible_combinations(expected, [...trim.filter(Boolean), ...rest]) +
				possible_combinations(expected, [first.replace("?", "#"), ...rest]);
			map.set(id, result);
			return result;
		} else {
			if (first.length !== needed) return 0;
			const result = possible_combinations(expected.slice(1), rest);
			map.set(id, result);
			return result;
		}
	};

	/**
	 * @param {string} input
	 */
	const parse_lines = (input, length = 1) =>
		input.split("\n").flatMap((line) => {
			const matches = line.match(/^([.?#]+) ([\d,]+)$/);
			if (!matches) return [];

			const [, raw_springs, raw_groupings] = matches;
			if (!raw_springs || !raw_groupings) return [];

			const groupings = Array.from({ length }, () => raw_groupings.split(",").map(Number)).flat();

			if (groupings.length === 0) return [];
			const springs = get_groupings(Array.from({ length }, () => raw_springs).join("?"));

			return [{ springs, groupings }];
		});

	/**
	 * @param {ReturnType<typeof parse_lines>[number]} arg
	 */
	const to_possible_combination = ({ groupings, springs }) => possible_combinations(groupings, springs);

	const repeats = 5;
</script>

<textarea cols="30" rows="12" bind:value={input}></textarea>

<hr />

<h2>Part 2</h2>

<p>
	There are <strong>{parse_lines(input, repeats).map(to_possible_combination).reduce(sum)}</strong> arrangements
</p>

<ul>
	{#each parse_lines(input, repeats) as { springs, groupings }}
		<li>
			<strong>{possible_combinations(groupings, springs)}</strong> &rarr; {springs}
		</li>
	{/each}
</ul>

<hr />

<h2>Part 1</h2>

<p>
	There are <strong>{parse_lines(input).map(to_possible_combination).reduce(sum)}</strong> arrangements
</p>

<ul>
	{#each parse_lines(input) as { springs, groupings }}
		<li>
			<strong>{possible_combinations(groupings, springs)}</strong> &rarr; {springs}
		</li>
	{/each}
</ul>
