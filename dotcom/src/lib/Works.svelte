<script lang="ts">
	import { cleanDate } from "$lib/date";
	import type { Work } from "src/routes/works.json";
	import type { Lang } from "./lang";

	export let works: Work[];
	export let lang: Lang;

	const getUrl = (work: Work) => {
		const url = work.urls[lang] ?? work.urls["en"];
		return "/" + url.split("/").slice(-2).join("/");
	};

	const getTitle = (titles: Work["metadata"]["titles"]) => {
		const title = titles[lang] ?? titles["en"] + " (en)";
		return title;
	};
</script>

<ul>
	{#each works as work}
		<li>
			<a href={getUrl(work)}>
				<h3>
					{getTitle(work.metadata.titles)}
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
