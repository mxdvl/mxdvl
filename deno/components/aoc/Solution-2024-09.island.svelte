<script>
	import {} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`2333133121414131402`);

	let part = $state({ one: false, two: true });

	const numbers = $derived(
		input.split("").flatMap((character) => {
			const number = parseInt(character, 10);
			return number >= 0 && number < 10 ? [number] : [];
		}),
	);

	let part_one = $derived.by(() => {
		let line = numbers.flatMap((length, index) =>
			Array.from({ length }, () => (index % 2 === 0 ? index / 2 : " ")),
		);

		const lines = [[...line]];

		let count = 0;
		while (
			line.includes(" ", count) &&
			line.length > 0 &&
			count < 1_000_000 // prevent infinite loop
		) {
			const number = line.at(count++);
			if (typeof number === "number") continue;

			let last = line.pop();
			while (last === " " && line.length > 0) {
				last = line.pop();
			}

			line.splice(count - 1, 1, last);

			// lines.push([...line]);
		}

		lines.push([...line]);

		const checksum = line.reduce((accumulator, next, index) => {
			const number = parseInt(next, 10);
			if (Number.isNaN(number)) {
				return accumulator;
			}
			return accumulator + number * index;
		}, 0);

		return { line, lines, checksum };
	});

	let steps = $state(1);
	const max = $derived(Math.ceil(input.length / 2));

	let part_two = $derived.by(() => {
		let line = numbers.flatMap((length, index) =>
			Array.from({ length }, () => (index % 2 === 0 ? index / 2 : " ")),
		);

		const max_id = line.findLast((id) => typeof id === "number");

		/** keep track of where we last saw a free space of that size */
		const free_indices = [undefined, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		/** @type {[number, number]} */
		const from = [-1, -1];
		/** @type {[number, number]} */
		const to = [-1, -1];
		let lines = [{ line: [...line], from, to }];
		let id = max_id;
		let cursor = line.length;
		while (id >= 0) {
			while (line[cursor] !== id && cursor > 0) {
				cursor--;
			}
			// the current block
			const end = cursor;
			while (line[cursor] === id) {
				cursor--;
			}
			const start = cursor + 1;
			const size = end - start + 1;

			let free_index = free_indices[size] ?? start;
			let free_size = 0;
			let can_move = false;
			while (free_index < start) {
				if (line[free_index] === " ") {
					free_size++;
				} else {
					free_size = 0;
				}
				if (free_size >= size) {
					can_move = true;
					break;
				}
				free_index++;
			}
			free_indices[size] = can_move ? free_index : undefined;

			if (can_move) {
				const blocks = line.splice(
					start,
					size,
					...Array.from({ length: size }, () => " "),
				);
				line.splice(free_index - size + 1, size, ...blocks);
			}

			lines.push({
				line: [...line],
				from: [start, end],
				to: [free_index, free_index + size - 1],
			});
			id--;
		}

		const checksum = line.reduce(
			(accumulator, id, index) =>
				id === " " ? accumulator : accumulator + id * index,
			0,
		);

		return { lines, checksum, max_id };
	});

	const { line, from, to } = $derived(part_two.lines[steps]);

	let tiny = $state(false);
</script>

<textarea rows="10" bind:value={input}></textarea>

<details bind:open={part.one}>
	<summary>Part 1 – {part_one.checksum}</summary>

	<ul>
		{#each part_one.lines as line}
			<li><pre>{line.join("-")}</pre></li>
		{/each}
	</ul>
</details>

<details bind:open={part.two}>
	<summary>Part 2 – {part_two.checksum}</summary>

	<label>
		<input type="range" bind:value={steps} min={0} {max} width={280} />
		{steps}/{max}
	</label>

	<br />

	<label> <input type="checkbox" bind:checked={tiny} /> tiny?</label>

	<hr />

	<div class="flex">
		{#each line as id, index (index)}
			{@const green = to[0] !== -1 && to[0] <= index && index <= to[1]}
			{@const red = from[0] <= index && index <= from[1]}
			<pre class:blue={!tiny || id !== " "} class:green class:red>{tiny
					? ""
					: id.toString(36).padStart(3, " ")}</pre>
		{/each}
	</div>
</details>

<style>
	.flex {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		padding: 0;
		list-style-type: none;
		gap: 1px;
	}

	.flex pre {
		margin: 0;
		padding: 0.125em;
	}

	.blue {
		background: var(--blue);
		color: Canvas;
	}

	.green {
		background: var(--green);
	}

	.red {
		background: var(--red);
	}
</style>
