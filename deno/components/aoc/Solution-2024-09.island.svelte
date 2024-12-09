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

	let part_two = $derived.by(() => {
		let line = numbers.flatMap((size, index) => ({
			size,
			id: index % 2 === 0 ? index / 2 : " ",
			moved: false,
		}));

		const lines = [[...line]];

		let offset_index = 0;
		while (
			offset_index < line.length // prevent infinite loop
		) {
			const index = line.length - offset_index;
			offset_index++;
			const last = line.at(index);
			console.log({ index, offset_index, last });
			if (typeof last?.id !== "number") continue;
			if (last.moved) continue;

			const free_index = line.findIndex(
				(file, i) =>
					i < index && file.id === " " && file.size >= last.size,
			);
			if (free_index < 0) continue;

			line.splice(index, 1, { id: " ", size: last.size });
			const [free] = line.splice(free_index, 1, last);
			last.moved = true;
			const remaining = free.size - last.size;
			console.log({ remaining });
			if (remaining > 0) {
				line.splice(free_index + 1, 0, { size: remaining, id: " " });
			}

			// lines.push([...line]);
		}

		lines.push([...line]);


		const checksum = line
			.flatMap(({ size, id }) => {
				return Array.from({ length: size }, () =>
					typeof id === "number" ? id : 0,
				);
			})
			.reduce((accumulator, id, index) => accumulator + id * index, 0);

		return { line, lines, checksum };
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – {part_one.checksum}</summary>

	<pre>{part_one.line}</pre>

	<ul>
		{#each part_one.lines as line}
			<li><pre>{line.join("-")}</pre></li>
		{/each}
	</ul>
</details>

<details open={part === "two"}>
	<summary>Part 2 – {part_two.checksum}</summary>

	<ul>
		{#each part_two.lines as line}
			<li>
				<pre>{line
						.map(({ size, id }) => String(id).repeat(size))
						.join("")}</pre>
			</li>
		{/each}
	</ul>
</details>

<style>
	.grid {
		display: grid;
		padding: 0;
		list-style-type: none;
		grid-template-columns: repeat(var(--width), var(--col, 1ch));
		grid-template-rows: repeat(var(--height), 1.25rem);
	}

	.blue {
		color: var(--blue);
	}

	.green {
		color: var(--green);
	}

	.red {
		color: var(--red);
	}
</style>
