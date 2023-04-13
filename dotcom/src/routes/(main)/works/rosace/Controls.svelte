<script lang="ts">
	import type { Writable } from "svelte/store";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { fileSave } from "browser-fs-access";

	import Control from "./Control.svelte";
	import Button from "$lib/Button.svelte";
	import { add_pattern, animate, selected } from "./store";
	import type { Pattern } from "./data";

	export let patterns: Writable<Map<string, Writable<Pattern>>>;

	const duration = 240;

	const animation = ["animate", undefined] as const;
	const extra = ["extra", undefined] as const;

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
	{#each [animation, ...$patterns.entries(), extra] as [id, pattern] (id)}
		<li
			class:current={$selected === id}
			class:button={!pattern}
			transition:fade={{ duration }}
			animate:flip={{ duration }}
		>
			{#if pattern}
				<Control {pattern} {patterns} />
			{:else if id === "animate"}
				<Button on:click={() => animate.update((_) => !_)}
					>{#if $animate} Pause {:else} Play {/if} Animation
				</Button>
			{:else if id === "extra"}
				<Button
					on:click={() => {
						add_pattern();
					}}>Add new shape</Button
				>
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
		box-sizing: border-box;
		border: 2px solid var(--skies);
		margin: -1px;
		overflow-y: scroll;
		height: calc(2 * var(--grid-y));
		transition: height 240ms;
		background-color: var(--clouds);
	}

	li.current {
		height: calc(10 * var(--grid-y));
		border-color: var(--ocean);
		z-index: 1;
	}

	li.button {
		padding: 6px;
	}

	ul {
		padding: 0;
	}

	@media (max-width: 342px) {
		ul {
			font-size: 14.5px;
		}

		li.current {
			height: calc(12 * var(--grid-y));
		}
	}
</style>
