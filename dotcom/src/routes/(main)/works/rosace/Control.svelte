<script lang="ts">
	import type { Writable } from "svelte/store";
	import { fly } from "svelte/transition";

	import Button from "$lib/Button.svelte";
	import type { Pattern } from "./data";
	import { selected, toggle } from "./store";

	export let pattern: Writable<Pattern>;
	export let patterns: Writable<Map<string, Writable<Pattern>>>;

	$: current = $pattern.id === $selected;

	const toggle_selected = () => toggle($pattern.id);
</script>

<h3>
	#path-{$pattern.id}

	<Button on:click={toggle_selected}
		>{#if current}unselect{:else}select{/if}</Button
	>
</h3>

{#if current}
	<ul class="further-controls" transition:fly|local={{ y: -12, duration: 240 }}>
		<li>
			Count:
			<button
				on:click={() => {
					$pattern.count = Math.max(1, $pattern.count - 3);
				}}>-3</button
			>
			<input type="number" bind:value={$pattern.count} min="3" max="120" step="1" />
			<button
				on:click={() => {
					$pattern.count = Math.min(120, $pattern.count + 3);
				}}>+3</button
			>
		</li>

		<li>
			<label>
				Mirror:
				<input type="checkbox" bind:checked={$pattern.mirror} />
			</label>
		</li>

		<li>
			Position: {Math.round($pattern.position.x)},{Math.round($pattern.position.y)}
		</li>

		<li>
			<textarea bind:value={$pattern.d} cols="32" rows="4" />
		</li>

		<li>
			<Button
				on:click={() => {
					selected.set(undefined);
					$patterns.delete($pattern.id);
					$patterns = $patterns;
				}}>remove</Button
			>
		</li>
	</ul>
{/if}

<style>
	h3 {
		margin: 0;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		font-size: 1rem;
		line-height: 1rem;
		padding: 9px 6px;
	}

	ul.further-controls {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 3px;
		gap: 12px;
		flex-direction: row;
		flex-wrap: wrap;
		list-style-type: none;
	}

	textarea {
		display: block;
		font-family: monospace;
		background-color: inherit;
		resize: none;
		font-size: inherit;
		border: 2px solid var(--skies);
	}
</style>
