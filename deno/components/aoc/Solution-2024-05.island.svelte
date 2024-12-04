<script>
	let input = `TBC`;

	let part = "one";
</script>

<textarea rows="7" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary>Part 1 – ???</summary>
</details>

<details open={part === "two"}>
	<summary>Part 2 – ???</summary>
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
</style>
