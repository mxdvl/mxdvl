<script>
	let input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

	/** @type {(a: number, b: number) => number}*/
	const sum = (a, b) => a + b;

	/**
	 * @param {string} left
	 * @param {string} right
	 */
	const mirror = (left, right) => {
		if (left.length !== right.length) return false;
		return left.split("").every((character, index) => character === right.at(-index - 1));
	};

	/**
	 * @param {readonly string[]} left
	 * @param {readonly string[]} right
	 */
	const mirrors = (left, right) => {
		if (left.length !== right.length) return false;
		return left.every((line, index) => mirror(line, right.at(index) ?? ""));
	};

	$: fragments = input
		.split("\n\n")
		.map((fragment) => fragment.trim().replaceAll(".", " ").replaceAll("#", "█").split("\n"))
		.map((fragment) => {
			/** @type {number | undefined} */
			let columns = undefined;
			const width = fragment[0]?.length ?? 0;
			for (let column = 1; column < width; column++) {
				const offset = Math.max(0, Math.floor(column * 2 - width));

				const left = fragment.map((f) => f.slice(offset, column));
				const right = fragment.map((f) => f.slice(column, column * 2));

				if (mirrors(left, right)) {
					columns = column;
					break;
				}
			}

			/** @type {number | undefined} */
			let rows;
			const height = fragment.length;
			for (let row = 1; row < height; row++) {
				const offset = Math.max(0, Math.floor(row * 2 - height));

				const top = fragment.slice(offset, row);
				const bottom = fragment.slice(row, row * 2).reverse();

				if (top.length === bottom.length && top.every((t, i) => t === bottom[i])) {
					rows = row;
					break;
				}
			}

			return {
				fragment: fragment.flatMap((line, row) =>
					line.split("").map((character, col) => ({
						character,
						row,
						col,
					})),
				),
				width,
				height,
				columns,
				rows,
			};
		});
</script>

<textarea cols="30" rows="12" bind:value={input}></textarea>

<h2>Part 1</h2>

<p>
	Summary: <strong>{fragments.map(({ rows = 0, columns = 0 }) => columns + rows * 100).reduce(sum)}</strong>
</p>

<ul>
	{#each fragments as { fragment, rows = 0, columns = 0, width, height }}
		<li class="grid" style="--width:{width + 1};--height:{height + 1}">
			{#each fragment.filter(({ character }) => character === "█") as { character, row, col }}
				<div
					class:hm={col < columns}
					class:vm={row < rows}
					style="grid-row-start:{row + 1};grid-column-start:{col + 1}"
				/>
			{/each}
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style-type: none;
		letter-spacing: 0.125em;
	}

	li {
		display: grid;
		padding-block: 2rem;
		gap: 0.125em;
		grid-template-columns: repeat(var(--width), 1rem);
		grid-template-rows: repeat(var(--height), 1rem);
	}

	li > div {
		background-color: currentColor;
	}

	.hm {
		color: var(--blue);
	}

	.vm {
		color: var(--green);
	}
</style>
