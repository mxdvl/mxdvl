<script lang="ts">
	import type { Lang } from "./lang";
	import { page } from "$app/stores";
	import Logo from "$lib/CMPS.svelte";

	export let lang: Lang;

	let path: string;
	$: path = $page.url.pathname.split("/").filter(Boolean)[0] ?? "";
</script>

<header class="header wrap wide" role="banner">
	<nav>
		<ul>
			<li class="home">
				<a
					class={`branding ${["allo", "hi"].includes(path) ? "active" : ""}`}
					href={lang == "fr" ? "/allo" : "/hi"}
					rel="home"
				>
					<Logo />
				</a>
			</li>

			<li class={`menu-item ${["works", "travaux"].includes(path) ? "active" : ""}`}>
				{#if lang == "fr"}
					<a href="/travaux">Travaux</a>
				{:else}
					<a href="/works">Works</a>
				{/if}
			</li>

			<li class={`menu-item ${["profile", "profil"].includes(path) ? "active" : ""}`}>
				{#if lang == "fr"}
					<a href="/profil">Profil</a>
				{:else}
					<a href="/profile">Profile</a>
				{/if}
			</li>

			<li class={`menu-item ${["tools", "outils"].includes(path) ? "active" : ""}`}>
				<a href="/tools">
					{#if lang == "fr"}
						Outils
					{:else}
						Tools
					{/if}
				</a>
			</li>

			<li class="menu-item desktop" lang="fr">
				<a class={path === "allo" ? "active" : ""} href="/allo">allô</a>
				<span class="padded">&mdash;</span>
				<a class={path === "hi" ? "active" : ""} href="/hi">hi</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		height: calc(var(--grid) * 2);
		padding-bottom: var(--grid);
		border-bottom: 2px solid var(--skies);
		margin-bottom: -1px;
	}

	ul {
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		height: 100%;
		margin: -1px 0;
		padding: 0;

		font-weight: 480;
	}

	li {
		display: flex;
		text-transform: uppercase;
		align-items: center;
		font-weight: 320;
		font-size: 1.75rem;
		line-height: calc(2 * var(--grid));
	}

	li * {
		display: block;
	}

	.padded {
		padding: 0 0.5rem;
	}

	a {
		text-decoration: none;
		transition: font-weight 300ms;
	}

	a:not(.branding) {
		position: relative;
		top: 0.125rem;
	}

	.desktop {
		display: none;
	}

	.active {
		stroke-width: 4px;
		font-weight: 540;
	}

	@media screen and (min-width: 740px) {
		.desktop {
			display: flex;
		}
	}
</style>
