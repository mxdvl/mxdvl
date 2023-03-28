<script lang="ts">
	import type { Writable } from "svelte/store";
	import type { Pattern } from "./data";

	export let current: Writable<Pattern>;
	export let patterns: Writable<Map<string, Writable<Pattern>>>;
</script>

<h3>
	Selected – {$current.id}
	<button
		on:click={() => {
			$patterns.delete($current.id);
			$patterns = $patterns;
		}}>delete</button
	>
</h3>

<label>
	<input type="range" bind:value={$current.count} min="3" max="12" step="1" />
	– Number of sides ({$current.count})
</label>

<label>
	<input type="checkbox" bind:checked={$current.mirror} />
	– Mirror ({$current.mirror})
</label>

{#if $current?.position}
	<div>
		position – {Math.round($current.position.x)},{Math.round($current.position.y)}
	</div>
{/if}

<div>
	Path – {$current.d.slice(0, 24)}…
</div>
