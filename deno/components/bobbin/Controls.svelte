<script>
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { fileSave } from "npm:browser-fs-access";

	import Control from "./Control.svelte";
	import Button from "../Button.svelte";
	import { add_pattern, bobbin } from "./store.svelte.js";

	/** @typedef {import('./data.js').Pattern} Pattern */

	/** @type {{ svg: SVGSVGElement }} */
	let { svg = $bindable() } = $props();

	const duration = 240;

	const animation = /** @type {const} */ (["animate", undefined]);
	const extra = /** @type {const} */ (["extra", undefined]);

	/** the SVG XML namespace */
	const xmlns = "http://www.w3.org/2000/svg";

	const save_svg = async () => {
		const html = svg.outerHTML.replace(
			/^<svg\b/,
			`<svg xmlns="${xmlns}" fill="none" stroke="#111" stroke-width="1" `,
		);

		const blob = new Blob([html], { type: "image/svg+xml" });
		await fileSave(blob, {
			fileName: "Bobbin.svg",
			extensions: [".svg"],
		});
	};
</script>

<ul>
	{#each [animation, ...bobbin.patterns, extra] as [id, pattern] (id)}
		<li
			class:current={bobbin.selected === id}
			class:button={!pattern}
			transition:fade={{ duration }}
			animate:flip={{ duration }}
		>
			{#if pattern}
				<Control {pattern} />
			{:else if id === "animate"}
				<Button
					on:click={() => {
						bobbin.animate = !bobbin.animate;
					}}
					>{#if bobbin.animate}
						Pause
					{:else}
						Play
					{/if} Animation
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
		grid-row-end: span 2;
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
