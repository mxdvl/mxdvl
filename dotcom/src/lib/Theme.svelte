<script lang="ts">
	import { onMount } from "svelte";
	import type { Lang } from "./lang";

	type Theme = "light" | "dark";
	let themePreference: Theme | undefined;
	let currentTheme: Theme | undefined;

	const systemTheme = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

	const setTheme = (theme: Theme): void => {
		const newTheme = theme === systemTheme() ? "default" : theme;
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

	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (ev) => {
		if (!themePreference) currentTheme = ev.matches ? "dark" : "light";
	});

	export let lang: Lang;
</script>

{#if lang === "fr"}
	<p>
		Changer de thème? Vous pouvez choisir
		<button disabled={!currentTheme || currentTheme === "light"} on:click={() => setTheme("light")}>clair</button>
		ou
		<button disabled={!currentTheme || currentTheme === "dark"} on:click={() => setTheme("dark")}>sombre</button>.
	</p>
{:else}
	<p>
		Change the theme? You can choose
		<button disabled={!currentTheme || currentTheme === "light"} on:click={() => setTheme("light")}>light</button>
		ou
		<button disabled={!currentTheme || currentTheme === "dark"} on:click={() => setTheme("dark")}>dark</button>.
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
