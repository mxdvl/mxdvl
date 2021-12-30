<script lang="ts">
	import type { Lang } from "./lang";
	import Logo from "$lib/CMPS.svelte";

	export let lang: Lang;

	export let path: string;
</script>

<header class="header wrap wide" role="banner">
	<nav>
		<ul>
			<li class="home">
				<a class="branding" href={lang == "fr" ? "/allo" : "/hi"} rel="home">
					<Logo />
				</a>
			</li>

			<li class={`menu-item ${["works", "travaux"].includes(path) && "active"}`}>
				{#if lang == "en"}
					<a href="/works">Works</a>
				{:else if lang == "fr"}
					<a href="/travaux">Travaux</a>
				{:else}
					No dice
				{/if}
			</li>

			<li class={`menu-item ${["profile", "profil"].includes(path) && "active"}`}>
				{#if lang == "en"}
					<a href="/profile">Profile</a>
				{:else if lang == "fr"}
					<a href="/profil">Profil</a>
				{:else}
					waddup/error
				{/if}
			</li>

			<li class="menu-item desktop" lang="fr">
				<a class={path === "allo" && "active"} href="/allo">allô</a>
				<span class="padded">&mdash;</span>
				<a class={path === "hi" && "active"} href="/hi">hi</a>
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
		background: none;
	}

	:not(.home) a {
		position: relative;
		top: 0.125rem;
	}

	.desktop {
		display: none;
	}

	.active {
		color: var(--glint);
	}

	@media screen and (min-width: 740px) {
		.desktop {
			display: flex;
		}
	}
</style>
