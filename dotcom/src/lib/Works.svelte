<script context="module" lang="ts">
	import type { Work } from "../../../content/src/lib/works";
	import type { Lang } from "$lib/lang";

	const getUrl = (work: Work, lang: Lang) => {
		const url = work.urls[lang] ?? work.urls["en"];
		const slug = url.split("/").slice(-1)?.[0]?.replace(".json", "");
		return lang === "fr" ? `/travaux/${slug}`: `/work/${slug}`;
	};

	const getTitle = (titles: Work["metadata"]["titles"], lang: Lang) => {
		const title = titles[lang] ?? titles["en"];
		return title;
	};

	export const cleanDate = (date: string) => new Date(date).toISOString().slice(0, 7);
</script>

<script lang="ts">
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
		--columns: 1;
		--width: 100%;
		display: grid;
		padding: 0;
		margin: 0;
		grid-template-columns: repeat(var(--columns), calc(var(--width) * var(--grid)));
		gap: var(--grid);
	}

	li {
		display: block;
		height: calc(3 * var(--grid-double) + 2px);
		box-sizing: border-box;
		margin: -1px;
	}

	li a {
		display: block;
		box-sizing: border-box;
		text-decoration: none;
		height: 100%;
		padding: 0.5rem;
		border-radius: 1px;
		border: 2px solid var(--skies);
	}

	li h3 {
		line-height: var(--grid);
	}

	li a:hover {
		border-color: currentColor;
	}

	li a:active {
		border-color: var(--glint);
	}

	@media screen and (min-width: 620px) {
		ul {
			--columns: 2;
			--width: 14;
			gap: var(--grid-double);
		}
	}

	@media screen and (min-width: 740px) {
		ul {
			--columns: 2;
			--width: 19;
			gap: var(--grid-double);
		}
	}

	@media screen and (min-width: 960px) {
		ul {
			--columns: 3;
			--width: 16;
		}
	}

	@media screen and (min-width: 1200px) {
		ul {
			--columns: 3;
			--width: 20;
			gap: calc(3 * var(--grid));
		}
	}

	@media screen and (min-width: 1400px) {
		ul {
			--columns: 4;
			--width: 15;
			gap: calc(4 * var(--grid));
		}
	}
</style>
