<script context="module" lang="ts">
	import type { Load } from "@sveltejs/kit";
	import type { Work } from "./works.json";

	export const load: Load = async ({ fetch }) => {
		const url = "/works.json";
		const res = await fetch(url);
		const works = (await res.json()).works;

		return {
			props: {
				works,
			},
		};
	};
</script>

<script lang="ts">
	import { cleanDate } from "$lib/date";

	export let works: Work[];
</script>

## worky works

<ul>
	{#each works as work}
		<li>
			<a href={"/" + work.urls.en.split("/").slice(-2).join("/")}>
				<h3>
					{work.metadata.titles.en}
				</h3>
				<h4>
					{cleanDate(work.metadata.date)}
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
