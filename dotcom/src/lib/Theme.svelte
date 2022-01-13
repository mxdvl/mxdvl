<script lang="ts">
	import { onMount } from "svelte";
	import type { Lang } from "./lang";

	type Theme = "light" | "dark";
	let themePreference: Theme | undefined;
	let currentTheme: Theme | undefined;

	const systemTheme = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

	const toggleClass = (theme: Theme, html: HTMLHtmlElement) => {
		const { classList } = html;
		classList.remove("light", "dark");
		classList.add(theme);
		document.querySelector("link[rel=icon]").setAttribute("href", `/cmps-${theme}.svg`);
	};

	const setTheme = (theme: Theme): void => {
		currentTheme = theme;
		document.body.classList.add("themed");

		const newTheme = theme === systemTheme() ? "default" : theme;
		switch (newTheme) {
			case "light":
			case "dark":
				localStorage.setItem("theme", newTheme);
				break;
			case "default":
				currentTheme = systemTheme();
				localStorage.removeItem("theme");
				break;
		}

		themePreference = localStorage.theme;
		toggleClass(theme, document.querySelector("html"));
	};

	onMount(() => {
		themePreference = localStorage.theme;
		currentTheme = themePreference ?? systemTheme();

		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (ev) => {
			if (!themePreference) currentTheme = ev.matches ? "dark" : "light";
			toggleClass(currentTheme, document.querySelector("html"));
		});
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
		or
		<button disabled={!currentTheme || currentTheme === "dark"} on:click={() => setTheme("dark")}>dark</button>.
	</p>
{/if}
