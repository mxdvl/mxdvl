<script>
	import Logo from "./CMPS.svelte";
	import { capitalise } from "../../dotcom/src/lib/capitalise.js";

	/** @typedef {import('./lang.js').Lang} Lang */

	/** @type {Lang} */
	export let lang;

	/** @type {URL} */
	export let url;

	const pages =
		/** @type {const} @satisfies {ReadonlyArray<Record<Lang, string> & {width: number}>}*/ ([
			{
				en: "works",
				fr: "travaux",
				width: 3,
			},
			{
				en: "profile",
				fr: "profil",
				width: 3,
			},
			{
				en: "tools",
				fr: "outils",
				width: 2,
			},
		]);

	/** @type {string} */
	const path = url.pathname.split("/").filter(Boolean)[0] ?? "";
</script>

<header>
	<nav>
		<ul>
			<li class="home">
				<a
					class={`branding ${
						["allô", "hi"].includes(path) ? "active" : ""
					}`}
					href={lang == "fr" ? "/allô" : "/hi"}
					rel="home"
				>
					<Logo />
				</a>
			</li>

			{#each pages as page}
				<li
					class="page"
					class:active={[page.fr, page.en].includes(path)}
					style="--width: {page.width}"
				>
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
		border-bottom: 2px solid currentColor;
		color: var(--skies);
		transition: color 1.2s;
	}

	ul {
		--size: var(--grid-x);
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		height: 100%;
		margin: 0;
		padding: 0;
		padding-top: calc(var(--grid-y) / 2);
		gap: 0;

		font-weight: 480;
	}

	li {
		display: block;
		flex: 0 1 calc(var(--size) * var(--width));
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
		border: 2px solid;
		border-color: var(--frame, transparent);
		pointer-events: none;
		transform: translateY(-1px);
	}
</style>
