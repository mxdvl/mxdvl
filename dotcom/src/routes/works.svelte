<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { Work } from "./works.json";

	export const load: Load = async ({ fetch }) => {
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

<script lang="ts">
	export let works: Work[];
</script>

## worky works

<ul>
	{#each works as work}
		<li>
			<a href={`/works/${work.slug}`}>
				<h3>
					{work.metadata.title}
				</h3>
				<h4>
					{work.metadata.date}
				</h4>
			</a>
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

	li a {
		display: block;
		background-image: none;
	}
</style>
