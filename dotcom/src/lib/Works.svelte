<script lang="ts">
	import type { Work } from "$lib/works";
	import type { Lang } from "./lang";

	import { getUrl, cleanDate, getTitle } from "$lib/works";

	export let works: Work[];
	export let lang: Lang;
</script>

<ul>
	{#each works as work}
		<li>
			<a href={getUrl(work, lang)}>
				<h3>
					{getTitle(work.metadata.titles, lang)}
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
		padding: 0;
		margin: 0;
		grid-template-columns: repeat(3, calc(12 * var(--grid-double)));
		gap: var(--grid);
	}

	li {
		display: block;
		height: calc(3 * var(--grid-double) + 2px);
		padding: 0.5rem;
		border: 0.125rem solid var(--ocean);
		box-sizing: border-box;
		margin: -1px;
		border-radius: 1px;
	}

	li a {
		display: block;
		background-image: none;
	}
</style>
