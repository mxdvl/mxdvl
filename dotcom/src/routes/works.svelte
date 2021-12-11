<script context="module">
	export const load = async ({ fetch }) => {
		const url = "/works.json";
		const res = await fetch(url);
		const works = (await res.json()).works;

		return {
			props: {
				works
			}
		};
	};
</script>

<script>
	export let works;
</script>

## worky works

<ul>
	{#each works as work}
		<li>
			<h3>
				{work.metadata.title}
			</h3>
		</li>
	{/each}
</ul>

<style>
	ul {
		display: grid;
		padding: 1rem;
		margin: 0;
		grid-template-columns: repeat(3, 24rem);
		gap: 1rem;
	}

	li {
		display: block;
		height: 6rem;
		padding: 0.5rem;
		border: 0.125rem solid var(--ocean);
		box-sizing: border-box;
	}

	li:hover {
		cursor: pointer;
	}
</style>
