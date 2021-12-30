<script lang="ts">
	import { onMount } from "svelte";
	import type { Lang } from "./lang";

	type Theme = "light" | "dark" | "default";
	let theme: Theme = "default";
	let override: Theme = "default";

	const setTheme = (newTheme: Theme): void => {
		document.body.classList.add("themed");
		const { classList } = document.querySelector("html");
		classList.remove("light", "dark", "default");
		switch (newTheme) {
			case "light":
				theme = "light";
				classList.add("light");
				localStorage.setItem("theme", "light");
				break;
			case "dark":
				theme = "dark";
				classList.add("dark");
				localStorage.setItem("theme", "dark");
				break;
			case "default":
				theme = "default";
				classList.add("default");
				localStorage.removeItem("theme");
				break;
		}
	};

	onMount(() => {
		override = window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
		theme = localStorage.theme ? localStorage.theme : "default";
	});

	export let lang: Lang;
</script>

{#if lang === "fr"}
<p>
	Vous n’aimez pas le <span class={theme !== "default" && "active"} on:click={() => setTheme("default")}
		>thème système</span
	>?
	<span class={theme === "default" && "active"} on:click={() => setTheme(override)}>Changez-le</span>!
</p>
{:else}
	<p>
		Don’t like your <span class={theme !== "default" && "active"} on:click={() => setTheme("default")}
			>system theme</span
		>?
		<span class={theme === "default" && "active"} on:click={() => setTheme(override)}>Override it!</span>
	</p>
{/if}

<style>
	span {
		--border: var(--ocean);
		color: inherit;
		text-decoration: none;
		background-size: 1rem 1rem;
		background-repeat: repeat-x;
		background-position: bottom center;
	}
	span.active {
		background-image: linear-gradient(to top, var(--border), var(--border) 0.125rem, transparent 0.0625rem);
		cursor: pointer;
	}
</style>
