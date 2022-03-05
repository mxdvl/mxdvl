<script lang="ts">
	import { onMount } from "svelte";
	import Button from "./Button.svelte";
	import type { Lang } from "./lang";

	type Theme = "light" | "dark";
	let themePreference: Theme;
	let currentTheme: Theme;

	const systemTheme = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

	const toggleClass = (theme: Theme, element: HTMLElement) => {
		const { classList } = element;
		classList.remove("light", "dark");
		classList.add(theme);
		document.querySelector("link[rel=icon]")?.setAttribute("href", `/cmps-${theme}.svg`);
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
		toggleClass(theme, document.documentElement);
	};

	onMount(() => {
		themePreference = localStorage.theme;
		currentTheme = themePreference ?? systemTheme();

		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (ev) => {
			if (!themePreference) currentTheme = ev.matches ? "dark" : "light";
			toggleClass(currentTheme, document.documentElement);
		});
	});

	export let lang: Lang;
</script>

{#if lang === "fr"}
	<p>
		Changer de thème? Vous pouvez choisir
		<Button disabled={!currentTheme || currentTheme === "light"} on:click={() => setTheme("light")}>clair</Button>
		ou
		<Button disabled={!currentTheme || currentTheme === "dark"} on:click={() => setTheme("dark")}>sombre</Button>.
	</p>
{:else}
	<p>
		Change the theme? You can choose
		<Button disabled={!currentTheme || currentTheme === "light"} on:click={() => setTheme("light")}>light</Button>
		or
		<Button disabled={!currentTheme || currentTheme === "dark"} on:click={() => setTheme("dark")}>dark</Button>.
	</p>
{/if}
