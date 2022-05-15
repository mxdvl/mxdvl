<script context="module" lang="ts">
	import type { Lang } from "./lang";
	const pages: Array<Record<Lang, string> & Record<"width", number>> = [
		{
			en: "works",
			fr: "travaux",
			width: 3,
		},
		{
			en: "profile",
			fr: "profil",
			width: 2,
		},
		{
			en: "tools",
			fr: "outils",
			width: 2,
		},
	];

	const capitalise = <T extends string>(s: T): Capitalize<T> =>
		(s.slice(0, 1).toUpperCase() + s.slice(1)) as Capitalize<T>;
</script>

<script lang="ts">
	import { page } from "$app/stores";
	import Logo from "$lib/CMPS.svelte";

	export let lang: Lang;

	let path: string;
	$: path = $page.url.pathname.split("/").filter(Boolean)[0] ?? "";
</script>

<header>
	<nav>
		<ul>
			<li class="home">
				<a
					class={`branding ${["allô", "hi"].includes(path) ? "active" : ""}`}
					href={lang == "fr" ? "/allô" : "/hi"}
					rel="home"
				>
					<Logo />
				</a>
			</li>

			{#each pages as page}
				<li class={`page ${[page.fr, page.en].includes(path) ? "active" : ""}`} style="--width: {page.width}">
					<a href={`/${page[lang]}`}>{capitalise(page[lang])}</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	header {
		padding-bottom: var(--grid);
		position: relative;
		margin: 0;
	}

	header::after {
		content: "";
		position: absolute;
		width: 100%;
		bottom: -1px;
		border-bottom: 2px solid var(--skies);
	}

	ul {
		--size: var(--grid-double);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		height: 100%;
		margin: 0;
		padding: 0;
		gap: 0;

		font-weight: 480;
	}

	li {
		display: block;
		flex: 0 0 calc(var(--size) * var(--width));
		text-transform: uppercase;
		text-align: center;
		font-weight: 420;
		font-size: 1.111rem;
		line-height: calc(2 * var(--grid));
	}

	.padded {
		padding: 0 0.5rem;
	}

	a {
		display: block;
		text-decoration: none;
		transition: font-weight 300ms;
	}

	a:not(.branding) {
		position: relative;
	}

	.active {
		stroke-width: 4px;
		font-weight: 540;
		position: relative;
		--frame: var(--skies);
	}

	.page a {
		transform: translateY(1px);
	}

	.page a:hover {
		--frame: var(--border);
	}

	.page a:active {
		--border: var(--glint);
	}

	.page a::before {
		content: "";
		position: absolute;
		inset: -1px;
		border: 2px solid var(--frame);
		pointer-events: none;
		transform: translateY(-1px);
	}
</style>
