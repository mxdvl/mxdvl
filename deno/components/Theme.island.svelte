<script>
	import { onMount } from "svelte";
	import Button from "./Button.svelte";

	/** @typedef {"light" | "dark"} Theme */

	/** @type {Theme} */
	let themePreference;
	/** @type {Theme} */
	let currentTheme;
	/** @type {Lang} */
	let lang;

	const systemTheme = () =>
		window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";

	/**
	 * @param {Theme} theme
	 * @param {HTMLElement} element
	 */
	const toggleClass = (theme, element) => {
		const { classList } = element;
		classList.remove("light", "dark");
		classList.add(theme);
		document
			.querySelector("link[rel=icon]")
			?.setAttribute("href", `/cmps-${theme}.svg`);
		document
			.querySelector("link[rel=mask-icon]")
			?.setAttribute(
				"color",
				theme === "dark"
					? "rgb(93.44% 98.82% 100%)"
					: "rgb(0% 14.37% 13.78%)"
			);
	};

	/** @param {Theme} theme */
	const setTheme = (theme) => {
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

		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", (ev) => {
				if (!themePreference)
					currentTheme = ev.matches ? "dark" : "light";
				toggleClass(currentTheme, document.documentElement);
			});
	});
</script>

<svelte:head
	><svelte:element this="script" defer>
		{@html `
const html = document.querySelector("html");
const mq = window.matchMedia("(prefers-color-scheme: dark)");
try {
	const { theme } = localStorage;
	if (theme) {
		html.classList.add(theme);
		document.querySelector("link[rel=icon]")?.setAttribute("href", \`/cmps-\${theme}.svg\`);
		document
			.querySelector("link[rel=apple-touch-icon]")
			?.setAttribute("href", \`/cmps-icon-\${theme}.png\`);
		document
			.querySelector("link[rel=mask-icon]")
			?.setAttribute("color", theme === "dark" ? "rgb(93.44% 98.82% 100%)" : "rgb(0% 14.37% 13.78%)");
	} else {
		html.classList.toggle("dark", mq.matches);
		html.classList.toggle("light", !mq.matches);
		console.log(document.querySelector("link[rel=mask-icon]"));
		document
			.querySelector("link[rel=mask-icon]")
			?.setAttribute("color", mq.matches ? "rgb(93.44% 98.82% 100%)" : "rgb(0% 14.37% 13.78%)");
	}
} catch (error) {
	html.classList.add("light");
	console.log(error);
}
`}</svelte:element
	></svelte:head
>

{#if lang === "fr"}
	<p>
		Changer de thème? Vous pouvez choisir
		<Button
			disabled={!currentTheme || currentTheme === "light"}
			on:click={() => setTheme("light")}>clair</Button
		>
		ou
		<Button
			disabled={!currentTheme || currentTheme === "dark"}
			on:click={() => setTheme("dark")}>sombre</Button
		>.
	</p>
{:else}
	<p>
		Change the theme? You can choose
		<Button
			disabled={!currentTheme || currentTheme === "light"}
			on:click={() => setTheme("light")}>light</Button
		>
		or
		<Button
			disabled={!currentTheme || currentTheme === "dark"}
			on:click={() => setTheme("dark")}>dark</Button
		>.
	</p>
{/if}
