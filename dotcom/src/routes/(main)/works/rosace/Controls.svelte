<script lang="ts">
	import type { Writable } from "svelte/store";
	import { fly } from "svelte/transition";
	import Button from "../../../../lib/Button.svelte";
	import type { Pattern } from "./data";
	import { selected, toggle } from "./store";

	export let pattern: Writable<Pattern>;
	export let patterns: Writable<Map<string, Writable<Pattern>>>;

	$: current = $pattern.id === $selected;

	const toggle_selected = () => toggle($pattern.id);
</script>

<li class:current>
	<h3>
		{$pattern.id}

		<Button on:click={toggle_selected}
			>{#if current}unselect{:else}select{/if}</Button
		>
	</h3>

	{#if current}
		<ul class="further-controls" transition:fly={{ y: -20 }}>
			<label>
				<input type="range" bind:value={$pattern.count} min="3" max="12" step="1" />
				– Sides ({$pattern.count})
			</label>

			<label>
				<input type="checkbox" bind:checked={$pattern.mirror} />
				– Mirror ({$pattern.mirror})
			</label>

			{#if $pattern.position}
				<div>
					position – {Math.round($pattern.position.x)},{Math.round($pattern.position.y)}
				</div>
			{/if}

			<div>
				Path – {$pattern.d.slice(0, 24)}…
			</div>

			<button
				on:click={() => {
					$patterns.delete($pattern.id);
					$patterns = $patterns;
				}}>remove</button
			>
		</ul>
	{/if}
</li>

<style>
	h3 {
		margin: 0;
		display: flex;
		justify-content: space-between;
		font-size: 1rem;
		line-height: 1rem;
		padding: 9px 6px;
	}

	li {
		list-style-type: none;
		border: 2px solid var(--skies);
		margin: -1px;
		overflow: hidden;
		height: calc(2 * var(--grid-y));
		transition: height 240ms;
		background-color: var(--clouds);
	}

	li.current {
		height: calc(8 * var(--grid-y));
	}

	ul.further-controls {
		display: flex;
		padding: 0;
		flex-direction: column;
	}
</style>
