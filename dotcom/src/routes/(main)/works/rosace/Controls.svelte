<script lang="ts">
	import { derived, readable, writable, type Writable } from "svelte/store";
	import type { Pattern } from "./data";

	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { current, selected, uid } from "./store";
	import Control from "./Control.svelte";
	import Button from "$lib/Button.svelte";

	export let patterns: Writable<Map<string, Writable<Pattern>>>;

	const duration = 240;

	const last_pattern = derived([$current ?? readable(undefined)], ([$current_value]) => {
		if ($current_value !== undefined) {
			const { position, mirror, count } = $current_value;
			return { position, mirror, count };
		} else {
			return { position: { x: 0, y: 0 }, mirror: false, count: 3 };
		}
	});

	const add_shape = ["add-shape", undefined] as const;
</script>

<ul>
	{#each [...$patterns.entries(), add_shape] as [id, pattern] (id)}
		<li
			class:current={$selected === id}
			class:button={id === "add-shape"}
			transition:fade={{ duration }}
			animate:flip={{ duration }}
		>
			{#if pattern}
				<Control {pattern} {patterns} />
			{:else}
				<Button
					on:click={() => {
						const id = uid();
						const { count, mirror, position } = $last_pattern;
						$patterns.set(
							id,
							writable({
								id,
								count,
								mirror,
								position,
								// a triangle
								d: "M0,0L20,20,v-20,Z",
							}),
						);
						$patterns = $patterns;
						selected.set(id);
					}}>Add new shape</Button
				>
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
		overflow: hidden;
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
</style>
