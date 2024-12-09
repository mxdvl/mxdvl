<script>
	import {} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(`2333133121414131402`);

	let part = $state("two");

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
				console.log("pop", last);
			}

			line.splice(count - 1, 1, last);

			// lines.push([...line]);
		}

		lines.push([...line]);

		const checksum = line.reduce((accumulator, next, index) => {
			const number = parseInt(next, 10);
			if (Number.isNaN(number)) {
				console.log({ number, next });
				return accumulator;
			}
			return accumulator + number * index;
		}, 0);

		return { line, lines, checksum };
	});

	let steps = $state(1);
	const max = $derived(Math.floor(input.length / 2));

	let part_two = $derived.by(() => {
		let line = numbers.flatMap((length, index) =>
			Array.from({ length }, () => (index % 2 === 0 ? index / 2 : " ")),
		);

		const max_id = line.findLast((id) => typeof id === "number");

		let moved = false;
		let id = max_id;
		while (
			id >= 0 &&
			id > max_id - steps
			// offset_index < line.length // prevent infinite loop
			// && offset_index < steps * 2
		) {
			// the current block
			const end = line.findLastIndex((block_id) => block_id === id);
			const start = line
				.slice(0, end)
				.findLastIndex((block_id) => block_id !== id);
			const size = end - start;

			// let’s find a spot!
			const free_idx = line.findIndex(
				(block_id, index) =>
					block_id === " " &&
					index < start &&
					line
						.slice(index, index + size)
						.every((block_id) => block_id === " "),
			);

			moved = free_idx !== -1;
			if (moved) {
				const blocks = line.splice(
					start + 1,
					size,
					...Array.from({ length: size }, () => " "),
				);
				line.splice(free_idx, size, ...blocks);
			}

			id--;
		}

		const checksum = line.reduce(
			(accumulator, id, index) =>
				id === " " ? accumulator : accumulator + id * index,
			0,
		);

		return { line, checksum, max_id, last_move: id + 1, moved };
	});

	let tiny = $state(true);
</script>

<textarea rows="10" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – {part_one.checksum}</summary>

	<ul>
		{#each part_one.lines as line}
			<li><pre>{line.join("-")}</pre></li>
		{/each}
	</ul>
</details>

<details open={part === "two"}>
	<summary>Part 2 – {part_two.checksum}</summary>

	<label>
		<input type="range" bind:value={steps} min={0} {max} width={280} />
		{steps}/{max}
	</label>

	<br />

	<label> <input type="checkbox" bind:checked={tiny} /> tiny?</label>

	<hr />

	<div class="flex">
		{#each part_two.line as id}
			{@const green = id == part_two.last_move}
			{@const red = green && !part_two.moved}
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
