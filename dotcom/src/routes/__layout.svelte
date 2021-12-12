<script context="module" lang="ts">
	import { Lang, pathLang } from "$lib/lang";
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ page }) => {
		const lang: Lang = pathLang(page.path);
		return {
			props: {
				lang
			}
		};
	};
</script>

<script lang="ts">
	import Header from "$lib/Header.svelte";
	import Footer from "$lib/Footer.svelte";

	import "../app.css";
	import "../ibm-plex-var.css";

	const setTheme = (theme: "light" | "dark" | "default") => {
		const { classList } = document.querySelector("html");
		classList.remove("light", "dark", "default");
		switch (theme) {
			case "light":
				classList.add("light");
				localStorage.setItem("theme", "light");
				break;
			case "dark":
				classList.add("dark");
				localStorage.setItem("theme", "dark");
				break;
			case "default":
				classList.add("default");
				localStorage.removeItem("theme");
				break;
		}
		return theme;
	};

	export let lang: Lang;
</script>

<Header {lang} />

<main>
	<slot />
</main>

<button on:click={() => setTheme("light")}>light</button>
<button on:click={() => setTheme("dark")}>dark</button>
<button on:click={() => setTheme("default")}>reset</button>

<Footer {lang} />

<style>
	main {
		padding: 1rem;
		margin: 0 auto;
	}
</style>
