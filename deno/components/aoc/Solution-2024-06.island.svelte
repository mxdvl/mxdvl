<script>
	let input = $state(`TBC`);

	let part = $state("one");

	let part_one = $derived(input.split("\n"))
</script>

<textarea rows="7" bind:value={input}></textarea>

<details open={part === "one"}>
	<summary
		>Part 1 – {'???'}</summary
	>

	<ul>
		{#each [] as _}
			<li>
			</li>
		{/each}
	</ul>


</details>

<details open={part === "two"}>
	<summary
		>Part 2 – {'???'}</summary
	>

	<ul>
		{#each [] as _}
			<li>
			</li>
		{/each}
	</ul>
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
