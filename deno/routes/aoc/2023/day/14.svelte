<script>
	let input = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

	$: lines = input
		.split("\n")
		.filter((line) => line.match(/^[.O#]+$/))
		.map((line) => line.replaceAll("#", "■").replaceAll("O", "○").replaceAll(".", " "));

	$: width = lines[0]?.length ?? 0;
	$: height = lines.length;

	$: rocks = lines.flatMap((line, y) =>
		line
			.split("")
			.map((rock, x) => ({ rock, x, y }))
			.filter(({ rock }) => rock !== "."),
	);

	/** @param {string} a */
	const left = (a) => (a === "○" ? -1 : 1);
	/** @param {string} a */
	const right = (a) => (a === " " ? -1 : 1);

	/**
	 * @param {string} line
	 * @param {typeof left | typeof right} compare
	 */
	const shift = (line, compare) =>
		line
			.split("■")
			.map((s) => s.split("").sort(compare).join(""))
			.join("■");

	/**
	 * https://stackoverflow.com/a/46805290
	 *
	 * @param {readonly string[]} lines
	 */
	const transpose = (lines) => lines[0]?.split("").map((col, i) => lines.map((row) => row[i]).join("")) ?? [];

	/**
	 * @param {readonly string[]} lines
	 * @param {"north" | "south" | "east" | "west"} direction
	 */
	const move = (lines, direction) => {
		switch (direction) {
			case "west": {
				return lines.map((line) => shift(line, left));
			}
			case "east": {
				return lines.map((line) => shift(line, right));
			}
			case "north": {
				const rows = transpose(lines);
				return transpose(rows.map((line) => shift(line, left)));
			}
			case "south": {
				const rows = transpose(lines);
				return transpose(rows.map((line) => shift(line, right)));
			}
		}
	};

	const cycle = /** @type {const} */ (["north", "west", "south", "east"]);

	/**
	 *
	 * @param {readonly string[]} lines
	 * @param {number} count
	 */
	const run_cycles = (lines, count = 1) => {
		/** @type {Map<string, string>} */
		const map = new Map();

		let id = String(lines);
		let cycle_count = 0;
		let last_seen = 0;
		while (cycle_count < count) {
			const found = map.get(id);
			if (found) {
				const diff = map.size - [...map.keys()].indexOf(id);
				const leftover = count - cycle_count;
				const jump = Math.floor(leftover / diff);
				cycle_count += jump * diff;
				id = found;
			} else {
				const new_id = String(cycle.reduce((l, direction) => move(l, direction), id.split(",")));
				map.set(id, new_id);
				id = new_id;
			}
			cycle_count++;
		}

		return id.split(",");
	};
</script>

<textarea cols="24" rows="12" bind:value={input}></textarea>

<button type="button" on:click={() => (lines = move(lines, "north"))}>north</button>
<button type="button" on:click={() => (lines = move(lines, "west"))}>west</button>
<button type="button" on:click={() => (lines = move(lines, "south"))}>south</button>
<button type="button" on:click={() => (lines = move(lines, "east"))}>east</button>

<br />
<br />

<button type="button" on:click={() => (lines = run_cycles(lines))}>1 cycle</button>
<button type="button" on:click={() => (lines = run_cycles(lines, 3))}>3 cycles</button>
<button type="button" on:click={() => (lines = run_cycles(lines, 100))}>100 cycles</button>
<button type="button" on:click={() => (lines = run_cycles(lines, 1000000000))}>1000000000 cycles</button>

<hr />

<h2>Both parts</h2>

<p>
	Total weight on north beam: <strong
		>{rocks.filter(({ rock }) => rock === "○").reduce((acc, { y }) => acc + (height - y), 0)}</strong
	>
</p>

<div class="mirror" style="--width:{width};--height:{height};">
	{#each rocks as { rock, x, y }}
		<div class="rock" style="--x:{x + 1};--y:{y + 1};">{rock}</div>
	{/each}
</div>

<style>
	.mirror {
		display: grid;
		grid-template-columns: repeat(var(--width), 1rem);
		grid-template-rows: repeat(var(--height), 1rem);
	}

	.mirror .rock {
		grid-column-start: var(--x);
		grid-row-start: var(--y);
	}
</style>
