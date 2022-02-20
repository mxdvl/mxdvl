<script context="module" lang="ts">
	import type { WorkUrls } from "../../../content/src/routes/works/index.json";
	import type { Lang } from "$lib/lang";

	const getTitle = (url?: string) => {
		const title = `TODO: ${url ?? "missing"}`;
		return title;
	};

	export const cleanDate = (date: string) => new Date(date).toISOString().slice(0, 7);
</script>

<script lang="ts">
	export let works: WorkUrls[];
	export let lang: Lang;
</script>

<ul>
	{#each works as work}
		<li>
			<a href={work[lang] ?? work.en}>
				<h3>
					{getTitle(work[lang])}
				</h3>
				<h4>
					{cleanDate(work.date)}
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
