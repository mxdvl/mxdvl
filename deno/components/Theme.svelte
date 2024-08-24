<script>
	import { onMount } from "svelte";
	import Button from "./Button.svelte";
	import { lang } from "./lang.js";

	/** @typedef {"light" | "dark"} Theme */
	/** @type {Theme | undefined} */
	let currentTheme = undefined;

	/** @type {() => Theme} */
	const systemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

	/**
	 * @param {Theme} theme
	 * @param {HTMLElement} element
	 */
	const toggleClass = (theme, element) => {
		const { classList } = element;
		classList.remove("light", "dark");
		classList.add(theme);
		document.querySelector("link[rel=icon]")?.setAttribute("href", `/cmps-${theme}.svg`);
		document
			.querySelector("link[rel=mask-icon]")
			?.setAttribute("color", theme === "dark" ? "rgb(93.44% 98.82% 100%)" : "rgb(0% 14.37% 13.78%)");
	};

	/** @param {Theme} theme */
	const setTheme = (theme) => {
		document.body.classList.add("themed");

		const newTheme = theme === systemTheme() ? "default" : theme;
		switch (newTheme) {
			case "light":
			case "dark":
				currentTheme = newTheme;
				localStorage.setItem("theme", newTheme);
				break;
			case "default":
				currentTheme = systemTheme();
				localStorage.removeItem("theme");
				break;
		}

		toggleClass(currentTheme, document.documentElement);
	};

	onMount(() => {
		const themePreference = localStorage.getItem("theme");
		switch (themePreference) {
			case "light":
			case "dark":
				setTheme(themePreference);
			default:
				setTheme(systemTheme());
		}
	});
</script>

{#if $lang === "fr"}
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
