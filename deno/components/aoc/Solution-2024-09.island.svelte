<script>
	import {} from "./helpers.js";
	/** @typedef {`${number},${number}`} Coordinates */

	let input = $state(``);

	let part = $state("one");

	let part_one = $derived.by(() => {
		return "???";
	});

	let part_two = $derived.by(() => {
		return "???";
	});
</script>

<textarea rows="10" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – {part_one}</summary>
</details>

<details open={part === "two"}>
	<summary>Part 2 – {part_two}</summary>
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
