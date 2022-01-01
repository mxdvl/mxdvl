<script lang="ts">
	import { onMount } from "svelte";
	import type { Lang } from "./lang";

	type Theme = "light" | "dark";
	let themePreference: Theme | undefined;
	let currentTheme: Theme = "dark";

	const opposite = (theme: Theme) => (theme === "dark" ? "light" : "dark");

	const systemTheme = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

	const setTheme = (newTheme: Theme | "default"): void => {
		document.body.classList.add("themed");
		const { classList } = document.querySelector("html");
		classList.remove("light", "dark", "default");
		switch (newTheme) {
			case "light":
				currentTheme = "light";
				localStorage.setItem("theme", "light");
				break;
			case "dark":
				currentTheme = "dark";
				localStorage.setItem("theme", "dark");
				break;
			case "default":
				currentTheme = systemTheme();
				localStorage.removeItem("theme");
				break;
		}

		themePreference = localStorage.theme;
		classList.add(currentTheme);
	};

	onMount(() => {
		themePreference = localStorage.theme;
		currentTheme = themePreference ? themePreference : systemTheme();
	});

	export let lang: Lang;
</script>

{#if lang === "fr"}
	<p>
		Vous n’aimez pas le <button disabled={!themePreference} on:click={() => setTheme("default")}
			>thème système</button
		>?
		<button disabled={!!themePreference} on:click={() => setTheme(opposite(currentTheme))}>Changez-le</button>!
	</p>
{:else}
	<p>
		Don’t like your <button disabled={!themePreference} on:click={() => setTheme("default")}>system theme</button>?
		<button disabled={!!themePreference} on:click={() => setTheme(opposite(currentTheme))}>Override it!</button>
	</p>
{/if}

<style>
	button {
		display: inline-block;
		--border: var(--ocean);
		border: none;
		padding: 0;
		margin: 0;
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		font-style: inherit;
		font-weight: inherit;
		line-height: inherit;
		background-size: 1rem 1rem;
		background-repeat: repeat-x;
		background-position: bottom center;
		background-color: transparent;
	}
	button:enabled {
		background-image: linear-gradient(to top, var(--border), var(--border) 0.125rem, transparent 0.0625rem);
	}
</style>
