<script lang="ts">
	import type { Writable } from "svelte/store";
	import { writable } from "svelte/store";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { fileSave } from "browser-fs-access";

	import Control from "./Control.svelte";
	import Button from "$lib/Button.svelte";
	import { selected, uid } from "./store";
	import { loop } from "./weaving";
	import type { Pattern, Point } from "./data";

	export let patterns: Writable<Map<string, Writable<Pattern>>>;

	const duration = 240;

	const extra = ["extra", undefined] as const;

	const add_shape = (e: MouseEvent) => {
		console.log(e);
		const id = uid();
		const count: number = Math.round(Math.random() * 9 + 3);
		const mirror: boolean = Math.random() > 1 / 2;
		const position: Point = { x: Math.random() * 40, y: Math.random() * 40 };

		$patterns.set(
			id,
			writable({
				id,
				count,
				mirror,
				position,
				// a triangle
				d: ["M0,0", ...loop(3, 3 / 2, 12), "Z"].join(""),
			}),
		);
		$patterns = $patterns;
		selected.set(id);
	};

	/** the SVG XML namespace */
	const xmlns = "http://www.w3.org/2000/svg";

	const save_svg = async () => {
		const svg = document.querySelector("svg#rosace");
		if (!svg) return;

		const html = svg.outerHTML.replace("<svg ", `<svg xmlns="${xmlns}" `);

		const blob = new Blob([html], { type: "image/svg+xml" });
		await fileSave(blob, {
			fileName: "Rosace.svg",
			extensions: [".svg"],
		});
	};
</script>

<ul>
	{#each [...$patterns.entries(), extra] as [id, pattern] (id)}
		<li
			class:current={$selected === id}
			class:button={id === "extra"}
			transition:fade={{ duration }}
			animate:flip={{ duration }}
		>
			{#if pattern}
				<Control {pattern} {patterns} />
			{:else}
				<Button on:click={add_shape}>Add new shape</Button>
				<Button on:click={save_svg}>Save SVG</Button>
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		display: flex;
		flex-direction: column;
		margin: 0;
	}

	li {
		list-style-type: none;
		border: 2px solid var(--skies);
		margin: -1px;
		overflow-y: scroll;
		height: calc(2 * var(--grid-y) - 1px);
		transition: height 240ms;
		background-color: var(--clouds);
	}

	li.current {
		height: calc(9 * var(--grid-y) - 1px);
		border-color: var(--ocean);
		z-index: 1;
	}

	li.button {
		padding: 9px;
		height: calc(1 * var(--grid-y) - 1px);
	}

	ul {
		padding: 0;
	}

	@media (max-width: 342px) {
		ul {
			font-size: 14.5px;
		}

		li.current {
			height: calc(12 * var(--grid-y) - 1px);
		}
	}
</style>
