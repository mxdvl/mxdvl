<script>
	let input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

	let part = "two";

	const word = "XMAS";

	const directions = /** @type {const} */ ([
		"→",
		"←",
		"↑",
		"↓",
		"↖",
		"↗",
		"↘",
		"↙",
	]);

	$: matches = input.split("\n").reduce((accumulator, line, y) => {
		const at = get_letter(input);
		for (let [x, letter] of line.split("").entries()) {
			if (letter !== "X") {
				continue;
			}
			for (const direction of directions) {
				switch (direction) {
					case "→": {
						if (
							at(x + 1, y) === "M" &&
							at(x + 2, y) === "A" &&
							at(x + 3, y) === "S"
						) {
							accumulator.push({ x, y, direction });
						}
						continue;
					}
					case "←": {
						if (
							at(x - 1, y) === "M" &&
							at(x - 2, y) === "A" &&
							at(x - 3, y) === "S"
						) {
							accumulator.push({ x, y, direction });
						}
						continue;
					}
					case "↑": {
						if (
							at(x, y - 1) === "M" &&
							at(x, y - 2) === "A" &&
							at(x, y - 3) === "S"
						) {
							accumulator.push({ x, y, direction });
						}
						continue;
					}
					case "↓": {
						if (
							at(x, y + 1) === "M" &&
							at(x, y + 2) === "A" &&
							at(x, y + 3) === "S"
						) {
							accumulator.push({ x, y, direction });
						}
						continue;
					}
					case "↖": {
						if (
							at(x - 1, y - 1) === "M" &&
							at(x - 2, y - 2) === "A" &&
							at(x - 3, y - 3) === "S"
						) {
							accumulator.push({ x, y, direction });
						}
						continue;
					}
					case "↗": {
						if (
							at(x + 1, y - 1) === "M" &&
							at(x + 2, y - 2) === "A" &&
							at(x + 3, y - 3) === "S"
						) {
							accumulator.push({ x, y, direction });
						}
						continue;
					}
					case "↘": {
						if (
							at(x + 1, y + 1) === "M" &&
							at(x + 2, y + 2) === "A" &&
							at(x + 3, y + 3) === "S"
						) {
							accumulator.push({ x, y, direction });
						}
						continue;
					}
					case "↙": {
						if (
							at(x - 1, y + 1) === "M" &&
							at(x - 2, y + 2) === "A" &&
							at(x - 3, y + 3) === "S"
						) {
							accumulator.push({ x, y, direction });
						}
						continue;
					}
				}
			}
		}
		return accumulator;
	}, /** @type {Array<{x: number, y: number, direction: typeof directions[number]}>} */ ([]));

	$: crosses = input.split("\n").reduce((accumulator, line, y) => {
		const at = get_letter(input);
		for (let [x, letter] of line.split("").entries()) {
			if (letter !== "A") {
				continue;
			}
			const up_right = [at(x - 1, y + 1), at(x + 1, y - 1)]
				.sort()
				.join("A");
			const down_right = [at(x - 1, y - 1), at(x + 1, y + 1)]
				.sort()
				.join("A");

			if (up_right === "MAS" && down_right === "MAS") {
				accumulator.push({ x, y });
			}
		}
		return accumulator;
	}, /** @type {Array<{x: number, y: number}>} */ ([]));

	/**
	 * @param {string} input
	 * @returns {(x: number, y: number) => string} position
	 */
	function get_letter(input) {
		const width = input.indexOf("\n") + 1;
		return function (x, y) {
			if (x < 0 || x >= width - 1 || y < 0) {
				return "<";
			}
			return input[x + y * width] ?? ">";
		};
	}
</script>

<textarea rows="7" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – {matches.length}</summary>

	<div
		class="grid"
		style="grid-template-columns: repeat({input.indexOf('\n')},1ch);"
	>
		{#each input.split("\n") as line, y}
			{#each line.split("") as character, x}
				<span
					{x}
					{y}
					class:green={matches.some(
						(match) => match.x === x && match.y === y,
					)}>{character}</span
				>
			{/each}
		{/each}
	</div>

	<ol>
		{#each matches as { x, y, direction }}
			<li>{x},{y} {direction}</li>
		{/each}
	</ol>
</details>

<details open={part === "two"}>
	<summary>Part 2 – {crosses.length}</summary>

	<div
		class="grid"
		style="grid-template-columns: repeat({input.indexOf('\n')},1ch);"
	>
		{#each input.split("\n") as line, y}
			{#each line.split("") as character, x}
				<span
					{x}
					{y}
					class:green={crosses.some(
						(match) =>
							Math.abs(match.x - x) === 1 &&
							Math.abs(match.y - y) === 1,
					)}
					class:red={crosses.some(
						(match) => match.x === x && match.y === y,
					)}>{character}</span
				>
			{/each}
		{/each}
	</div>
</details>

<style>
	.grid {
		display: grid;
	}

	.green {
		color: var(--green);
	}

	.red {
		color: var(--red);
	}

	span:not(.green, .red) {
		opacity: 0.24;
	}

	.green,
	.red {
		font-weight: bold;
	}

	ol {
		padding-left: 6ch;
	}
</style>
