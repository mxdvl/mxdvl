<script lang="ts">
	import type { Writable } from "svelte/store";
	import type { Pattern } from "./data";
	import { selected } from "./store";

	export let pattern: Writable<Pattern>;
	export let patterns: Writable<Map<string, Writable<Pattern>>>;

	$: current = $pattern.id === $selected;
</script>

<h3>
	{$pattern.id}
	{#if current}
		–
		<button
			on:click={() => {
				selected.set(undefined);
			}}>unselect</button
		>
	{:else}
		– <button
			on:click={() => {
				selected.set($pattern.id);
			}}>select</button
		>
	{/if}
</h3>

{#if current}
	<label>
		<input type="range" bind:value={$pattern.count} min="3" max="12" step="1" />
		– Number of sides ({$pattern.count})
	</label>

	<label>
		<input type="checkbox" bind:checked={$pattern.mirror} />
		– Mirror ({$pattern.mirror})
	</label>

	{#if $pattern?.position}
		<div>
			position – {Math.round($pattern.position.x)},{Math.round($pattern.position.y)}
		</div>
	{/if}

	<div>
		Path – {$pattern.d.slice(0, 24)}…
	</div>
{/if}
